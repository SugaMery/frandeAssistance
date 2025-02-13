const express = require('express');
const cors = require('cors'); // Import the cors package
const app = express();
const connection = require('./database');  // Import the database connection
const bcrypt = require('bcrypt'); // For password hashing
const jwt = require('jsonwebtoken'); // For generating and verifying tokens
const multer = require('multer'); // Import multer for file uploads
const path = require('path'); // Import path for handling file paths
const fs = require('fs'); // Import fs for file system operations
const { body, param, validationResult } = require('express-validator'); // Import express-validator for validation

app.use(cors());
app.use(express.json());

// Middleware for authentication
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.sendStatus(401);

    jwt.verify(token, 'your_jwt_secret', (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

// Middleware for validation
const validate = (validations) => {
    return async (req, res, next) => {
        await Promise.all(validations.map(validation => validation.run(req)));
        const errors = validationResult(req);
        if (errors.isEmpty()) {
            return next();
        }
        res.status(400).json({ errors: errors.array() });
    };
};

const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}

// Set up multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Directory to save uploaded files
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});
const upload = multer({ storage });

// Serve static files from the uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Register endpoint
app.post('/register', (req, res) => {
    const { username, email, password, first_name, last_name, role_id, city, postal_code, address, phone_number } = req.body;

    // Check if all required fields are present
    if (!username || !email || !password || !first_name || !last_name || !role_id || !city || !postal_code || !address || !phone_number) {
        return res.status(400).json({ status: 'error', message: 'All fields are required', data: null });
    }

    // Check if role_id exists
    connection.query('SELECT * FROM roles WHERE id = ?', [role_id], (err, results) => {
        if (err) return res.status(500).json({ status: 'error', message: err.message, data: null });
        if (results.length === 0) return res.status(400).json({ status: 'error', message: 'Invalid role_id', data: null });

        const hashedPassword = bcrypt.hashSync(password, 10);
        connection.query('INSERT INTO users (uuid, username, email, password, first_name, last_name, role_id, city, postal_code, address, phone_number) VALUES (UUID(), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [username, email, hashedPassword, first_name, last_name, role_id, city, postal_code, address, phone_number], (err, results) => {
            if (err) return res.status(500).json({ status: 'error', message: err.message, data: null });
            res.status(201).json({ status: 'success', message: 'User registered', data: { id: results.insertId, username, email, first_name, last_name, city, postal_code, address, phone_number } });
        });
    });
});

// Login endpoint
app.post('/login', (req, res) => {
    const { email, password , ip_address} = req.body;
    connection.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
        if (err) return res.status(500).json({ status: 'error', message: err.message, data: null });
        if (results.length === 0) return res.status(404).json({ status: 'error', message: 'User not found', data: null });

        const user = results[0];
        if (!bcrypt.compareSync(password, user.password)) {
            return res.status(401).json({ status: 'error', message: 'Invalid credentials', data: null });
        }

        const token = jwt.sign({ id: user.id, role: user.role_id }, 'your_jwt_secret', { expiresIn: '1h' });
        //print("ip addresssss",ip_address);
        // Log login history
        //const ip_address = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        const user_agent = req.headers['user-agent'];
        connection.query('INSERT INTO login_history (user_id, ip_address, user_agent) VALUES (?, ?, ?)', [user.id, ip_address, user_agent], (err) => {
            if (err) return res.status(500).json({ status: 'error', message: err.message, data: null });
            res.json({ status: 'success', message: 'Login successful', data: { token } });
        });
    });
});

// Get user information from token
app.get('/user', authenticateToken, (req, res) => {
    const userId = req.user.id;
    connection.query('SELECT id, username, email, first_name, last_name, role_id, city, postal_code, address, phone_number FROM users WHERE id = ?', [userId], (err, results) => {
        if (err) return res.status(500).json({ status: 'error', message: err.message, data: null });
        if (results.length === 0) return res.status(404).json({ status: 'error', message: 'User not found', data: null });
        res.json({ status: 'success', message: 'User information retrieved', data: results[0] });
    });
});

// Get user information from token
app.get('/user-info', authenticateToken, (req, res) => {
    const userId = req.user.id;
    connection.query('SELECT first_name, last_name, email FROM users WHERE id = ?', [userId], (err, results) => {
        if (err) return res.status(500).json({ status: 'error', message: err.message, data: null });
        if (results.length === 0) return res.status(404).json({ status: 'error', message: 'User not found', data: null });
        res.json({ status: 'success', message: 'User information retrieved', data: results[0] });
    });
});

// CRUD operations for categories
app.post('/categories', upload.single('file'), (req, res) => {
    const { name, slug } = req.body;
    const file = req.file;

    if (!file) {
        return res.status(400).json({ status: 'error', message: 'File is required', data: null });
    }

    const filePath = `http://localhost:3000/uploads/${file.filename}`;
    const fileType = file.mimetype;

    connection.query('INSERT INTO media (file_path, file_type) VALUES (?, ?)', [filePath, fileType], (err, mediaResults) => {
        if (err) return res.status(500).json({ status: 'error', message: err.message, data: null });

        const mediaId = mediaResults.insertId;
        connection.query('INSERT INTO categories (name, slug, media_id) VALUES (?, ?, ?)', [name, slug, mediaId], (err, categoryResults) => {
            if (err) return res.status(500).json({ status: 'error', message: err.message, data: null });
            res.status(201).json({ status: 'success', message: 'Category created', data: { id: categoryResults.insertId, name, slug, media_id: mediaId } });
        });
    });
});

app.get('/categories', (req, res) => {
    const query = `
        SELECT categories.*, media.file_path, media.file_type 
        FROM categories 
        LEFT JOIN media ON categories.media_id = media.id
    `;
    connection.query(query, (err, results) => {
        if (err) return res.status(500).json({ status: 'error', message: err.message, data: null });
        res.json({ status: 'success', message: 'Categories retrieved', data: results });
    });
});

app.get('/categories/:id', (req, res) => {
    const { id } = req.params;
    connection.query('SELECT * FROM categories WHERE id = ?', [id], (err, results) => {
        if (err) return res.status(500).json({ status: 'error', message: err.message, data: null });
        if (results.length === 0) return res.status(404).json({ status: 'error', message: 'Category not found', data: null });
        res.json({ status: 'success', message: 'Category retrieved', data: results[0] });
    });
});

app.put('/categories/:id', authenticateToken, (req, res) => {
    const { id } = req.params;
    const { name, slug, media_id } = req.body;
    connection.query('UPDATE categories SET name = ?, slug = ?, media_id = ? WHERE id = ?', [name, slug, media_id, id], (err) => {
        if (err) return res.status(500).json({ status: 'error', message: err.message, data: null });
        res.json({ status: 'success', message: 'Category updated', data: { id, name, slug, media_id } });
    });
});

app.delete('/categories/:id', authenticateToken, (req, res) => {
    const { id } = req.params;
    connection.query('DELETE FROM categories WHERE id = ?', [id], (err) => {
        if (err) return res.status(500).json({ status: 'error', message: err.message, data: null });
        res.status(204).json({ status: 'success', message: 'Category deleted', data: null });
    });
});

// Get categories with media
app.get('/categories_with_media', (req, res) => {
    const query = `
        SELECT categories.*, media.file_path, media.file_type 
        FROM categories 
        LEFT JOIN media ON categories.media_id = media.id
    `;
    connection.query(query, (err, results) => {
        if (err) return res.status(500).json({ status: 'error', message: err.message, data: null });
        res.json({ status: 'success', message: 'Categories with media retrieved', data: results });
    });
});

// CRUD operations for chatbot_messages
app.post('/chatbot_messages', authenticateToken, (req, res) => {
    const { user_id, message, response } = req.body;
    connection.query('INSERT INTO chatbot_messages (user_id, message, response) VALUES (?, ?, ?)', [user_id, message, response], (err, results) => {
        if (err) return res.status(500).json({ status: 'error', message: err.message, data: null });
        res.status(201).json({ status: 'success', message: 'Chatbot message created', data: { id: results.insertId, user_id, message, response } });
    });
});

app.get('/chatbot_messages', authenticateToken, (req, res) => {
    connection.query('SELECT * FROM chatbot_messages', (err, results) => {
        if (err) return res.status(500).json({ status: 'error', message: err.message, data: null });
        res.json({ status: 'success', message: 'Chatbot messages retrieved', data: results });
    });
});

app.get('/chatbot_messages/:id', authenticateToken, (req, res) => {
    const { id } = req.params;
    connection.query('SELECT * FROM chatbot_messages WHERE id = ?', [id], (err, results) => {
        if (err) return res.status(500).json({ status: 'error', message: err.message, data: null });
        if (results.length === 0) return res.status(404).json({ status: 'error', message: 'Chatbot message not found', data: null });
        res.json({ status: 'success', message: 'Chatbot message retrieved', data: results[0] });
    });
});

app.put('/chatbot_messages/:id', authenticateToken, (req, res) => {
    const { id } = req.params;
    const { user_id, message, response } = req.body;
    connection.query('UPDATE chatbot_messages SET user_id = ?, message = ?, response = ? WHERE id = ?', [user_id, message, response, id], (err) => {
        if (err) return res.status(500).json({ status: 'error', message: err.message, data: null });
        res.json({ status: 'success', message: 'Chatbot message updated', data: { id, user_id, message, response } });
    });
});

app.delete('/chatbot_messages/:id', authenticateToken, (req, res) => {
    const { id } = req.params;
    connection.query('DELETE FROM chatbot_messages WHERE id = ?', [id], (err) => {
        if (err) return res.status(500).json({ status: 'error', message: err.message, data: null });
        res.status(204).json({ status: 'success', message: 'Chatbot message deleted', data: null });
    });
});

// CRUD operations for cities
app.post('/cities', authenticateToken, (req, res) => {
    const { name, postal_code, country } = req.body;
    connection.query('INSERT INTO cities (name, postal_code, country) VALUES (?, ?, ?)', [name, postal_code, country], (err, results) => {
        if (err) return res.status(500).json({ status: 'error', message: err.message, data: null });
        res.status(201).json({ status: 'success', message: 'City created', data: { id: results.insertId, name, postal_code, country } });
    });
});

app.get('/cities', (req, res) => {
    connection.query('SELECT * FROM cities', (err, results) => {
        if (err) return res.status(500).json({ status: 'error', message: err.message, data: null });
        res.json({ status: 'success', message: 'Cities retrieved', data: results });
    });
});

app.get('/cities/:id', (req, res) => {
    const { id } = req.params;
    connection.query('SELECT * FROM cities WHERE id = ?', [id], (err, results) => {
        if (err) return res.status(500).json({ status: 'error', message: err.message, data: null });
        if (results.length === 0) return res.status(404).json({ status: 'error', message: 'City not found', data: null });
        res.json({ status: 'success', message: 'City retrieved', data: results[0] });
    });
});

app.put('/cities/:id', authenticateToken, (req, res) => {
    const { id } = req.params;
    const { name, postal_code, country } = req.body;
    connection.query('UPDATE cities SET name = ?, postal_code = ?, country = ? WHERE id = ?', [name, postal_code, country, id], (err) => {
        if (err) return res.status(500).json({ status: 'error', message: err.message, data: null });
        res.json({ status: 'success', message: 'City updated', data: { id, name, postal_code, country } });
    });
});

app.delete('/cities/:id', authenticateToken, (req, res) => {
    const { id } = req.params;
    connection.query('DELETE FROM cities WHERE id = ?', [id], (err) => {
        if (err) return res.status(500).json({ status: 'error', message: err.message, data: null });
        res.status(204).json({ status: 'success', message: 'City deleted', data: null });
    });
});

// CRUD operations for comments
app.post('/comments', (req, res) => {
    const { report_id, nom, email, content } = req.body;
    console.log("Received request to create comment");
    console.log("report_id:", report_id);
    console.log("nom:", nom);
    console.log("email:", email);
    console.log("content:", content);

    connection.query('SELECT * FROM reports WHERE id = ?', [report_id], (err, results) => {
        if (err) {
            console.error("Error checking report_id:", err);
            return res.status(500).json({ status: 'error', message: err.message, data: null });
        }
        if (results.length === 0) {
            return res.status(400).json({ status: 'error', message: 'Invalid report_id', data: null });
        }

        connection.query('INSERT INTO comments (report_id, nom, email, content) VALUES (?, ?, ?, ?)', [report_id, nom, email, content], (err, results) => {
            if (err) {
                console.error("Error inserting comment:", err);
                return res.status(500).json({ status: 'error', message: err.message, data: null });
            }
            console.log("Comment inserted successfully with ID:", results.insertId);
            res.status(201).json({ status: 'success', message: 'Comment created', data: { id: results.insertId, report_id, nom, email, content } });
        });
    });
});

app.get('/comments', (req, res) => {
    connection.query('SELECT * FROM comments', (err, results) => {
        if (err) return res.status(500).json({ status: 'error', message: err.message, data: null });
        res.json({ status: 'success', message: 'Comments retrieved', data: results });
    });
});

app.get('/comments/:id', (req, res) => {
    const { id } = req.params;
    connection.query('SELECT * FROM comments WHERE id = ?', [id], (err, results) => {
        if (err) return res.status(500).json({ status: 'error', message: err.message, data: null });
        if (results.length === 0) return res.status(404).json({ status: 'error', message: 'Comment not found', data: null });
        res.json({ status: 'success', message: 'Comment retrieved', data: results[0] });
    });
});

app.get('/comments/report/:id', (req, res) => {
    const { id } = req.params;
    connection.query('SELECT * FROM comments WHERE report_id = ?', [id], (err, results) => {
        if (err) return res.status(500).json({ status: 'error', message: err.message, data: null });
        if (results.length === 0) return res.status(404).json({ status: 'error', message: 'Comments not found', data: null });
        res.json({ status: 'success', message: 'Comments retrieved', data: results });
    });
});

app.put('/comments/:id', authenticateToken, (req, res) => {
    const { id } = req.params;
    const { report_id, nom, email, content } = req.body;
    connection.query('UPDATE comments SET report_id = ?, nom = ?, email = ?, content = ? WHERE id = ?', [report_id, nom, email, content, id], (err) => {
        if (err) return res.status(500).json({ status: 'error', message: err.message, data: null });
        res.json({ status: 'success', message: 'Comment updated', data: { id, report_id, nom, email, content } });
    });
});

app.delete('/comments/:id', authenticateToken, (req, res) => {
    const { id } = req.params;
    connection.query('DELETE FROM comments WHERE id = ?', [id], (err) => {
        if (err) return res.status(500).json({ status: 'error', message: err.message, data: null });
        res.status(204).json({ status: 'success', message: 'Comment deleted', data: null });
    });
});

// CRUD operations for data_exports
app.post('/data_exports', authenticateToken, (req, res) => {
    const { user_id, file_path } = req.body;
    connection.query('INSERT INTO data_exports (user_id, file_path) VALUES (?, ?)', [user_id, file_path], (err, results) => {
        if (err) return res.status(500).json({ status: 'error', message: err.message, data: null });
        res.status(201).json({ status: 'success', message: 'Data export created', data: { id: results.insertId, user_id, file_path } });
    });
});

app.get('/data_exports', (req, res) => {
    connection.query('SELECT * FROM data_exports', (err, results) => {
        if (err) return res.status(500).json({ status: 'error', message: err.message, data: null });
        res.json({ status: 'success', message: 'Data exports retrieved', data: results });
    });
});

app.get('/data_exports/:id', (req, res) => {
    const { id } = req.params;
    connection.query('SELECT * FROM data_exports WHERE id = ?', [id], (err, results) => {
        if (err) return res.status(500).json({ status: 'error', message: err.message, data: null });
        if (results.length === 0) return res.status(404).json({ status: 'error', message: 'Data export not found', data: null });
        res.json({ status: 'success', message: 'Data export retrieved', data: results[0] });
    });
});

app.put('/data_exports/:id', authenticateToken, (req, res) => {
    const { id } = req.params;
    const { user_id, file_path } = req.body;
    connection.query('UPDATE data_exports SET user_id = ?, file_path = ? WHERE id = ?', [user_id, file_path, id], (err) => {
        if (err) return res.status(500).json({ status: 'error', message: err.message, data: null });
        res.json({ status: 'success', message: 'Data export updated', data: { id, user_id, file_path } });
    });
});

app.delete('/data_exports/:id', authenticateToken, (req, res) => {
    const { id } = req.params;
    connection.query('DELETE FROM data_exports WHERE id = ?', [id], (err) => {
        if (err) return res.status(500).json({ status: 'error', message: err.message, data: null });
        res.status(204).json({ status: 'success', message: 'Data export deleted', data: null });
    });
});

// CRUD operations for deleted_reasons
app.post('/deleted_reasons', authenticateToken, (req, res) => {
    const { name, slug, long_name, type } = req.body;
    connection.query('INSERT INTO deleted_reasons (name, slug, long_name, type) VALUES (?, ?, ?, ?)', [name, slug, long_name, type], (err, results) => {
        if (err) return res.status(500).json({ status: 'error', message: err.message, data: null });
        res.status(201).json({ status: 'success', message: 'Deleted reason created', data: { id: results.insertId, name, slug, long_name, type } });
    });
});

app.get('/deleted_reasons', (req, res) => {
    connection.query('SELECT * FROM deleted_reasons', (err, results) => {
        if (err) return res.status(500).json({ status: 'error', message: err.message, data: null });
        res.json({ status: 'success', message: 'Deleted reasons retrieved', data: results });
    });
});

app.get('/deleted_reasons/:id', (req, res) => {
    const { id } = req.params;
    connection.query('SELECT * FROM deleted_reasons WHERE id = ?', [id], (err, results) => {
        if (err) return res.status(500).json({ status: 'error', message: err.message, data: null });
        if (results.length === 0) return res.status(404).json({ status: 'error', message: 'Deleted reason not found', data: null });
        res.json({ status: 'success', message: 'Deleted reason retrieved', data: results[0] });
    });
});

app.put('/deleted_reasons/:id', authenticateToken, (req, res) => {
    const { id } = req.params;
    const { name, slug, long_name, type } = req.body;
    connection.query('UPDATE deleted_reasons SET name = ?, slug = ?, long_name = ?, type = ? WHERE id = ?', [name, slug, long_name, type, id], (err) => {
        if (err) return res.status(500).json({ status: 'error', message: err.message, data: null });
        res.json({ status: 'success', message: 'Deleted reason updated', data: { id, name, slug, long_name, type } });
    });
});

app.delete('/deleted_reasons/:id', authenticateToken, (req, res) => {
    const { id } = req.params;
    connection.query('DELETE FROM deleted_reasons WHERE id = ?', [id], (err) => {
        if (err) return res.status(500).json({ status: 'error', message: err.message, data: null });
        res.status(204).json({ status: 'success', message: 'Deleted reason deleted', data: null });
    });
});

// CRUD operations for delete_requests
app.post('/delete_requests', authenticateToken, (req, res) => {
    const { user_id, reason, status, deleted_reason_id } = req.body;
    connection.query('INSERT INTO delete_requests (user_id, reason, status, deleted_reason_id) VALUES (?, ?, ?, ?)', [user_id, reason, status, deleted_reason_id], (err, results) => {
        if (err) return res.status(500).json({ status: 'error', message: err.message, data: null });
        res.status(201).json({ status: 'success', message: 'Delete request created', data: { id: results.insertId, user_id, reason, status, deleted_reason_id } });
    });
});

app.get('/delete_requests', (req, res) => {
    connection.query('SELECT * FROM delete_requests', (err, results) => {
        if (err) return res.status(500).json({ status: 'error', message: err.message, data: null });
        res.json({ status: 'success', message: 'Delete requests retrieved', data: results });
    });
});

app.get('/delete_requests/:id', (req, res) => {
    const { id } = req.params;
    connection.query('SELECT * FROM delete_requests WHERE id = ?', [id], (err, results) => {
        if (err) return res.status(500).json({ status: 'error', message: err.message, data: null });
        if (results.length === 0) return res.status(404).json({ status: 'error', message: 'Delete request not found', data: null });
        res.json({ status: 'success', message: 'Delete request retrieved', data: results[0] });
    });
});

app.put('/delete_requests/:id', authenticateToken, (req, res) => {
    const { id } = req.params;
    const { user_id, reason, status, deleted_reason_id } = req.body;
    connection.query('UPDATE delete_requests SET user_id = ?, reason = ?, status = ?, deleted_reason_id = ? WHERE id = ?', [user_id, reason, status, deleted_reason_id, id], (err) => {
        if (err) return res.status(500).json({ status: 'error', message: err.message, data: null });
        res.json({ status: 'success', message: 'Delete request updated', data: { id, user_id, reason, status, deleted_reason_id } });
    });
});

app.delete('/delete_requests/:id', authenticateToken, (req, res) => {
    const { id } = req.params;
    connection.query('DELETE FROM delete_requests WHERE id = ?', [id], (err) => {
        if (err) return res.status(500).json({ status: 'error', message: err.message, data: null });
        res.status(204).json({ status: 'success', message: 'Delete request deleted', data: null });
    });
});

// CRUD operations for evidence
app.post('/evidence', authenticateToken, upload.single('file'), (req, res) => {
    const { report_id } = req.body;
    const file_path = `http://localhost:3000/uploads/${req.file.filename}`;
    connection.query('INSERT INTO evidence (report_id, file_path) VALUES (?, ?)', [report_id, file_path], (err, results) => {
        if (err) return res.status(500).json({ status: 'error', message: err.message, data: null });
        res.status(201).json({ status: 'success', message: 'Evidence created', data: { id: results.insertId, report_id, file_path } });
    });
});

app.get('/evidence', (req, res) => {
    connection.query('SELECT * FROM evidence', (err, results) => {
        if (err) return res.status(500).json({ status: 'error', message: err.message, data: null });
        res.json({ status: 'success', message: 'Evidence retrieved', data: results });
    });
});

app.get('/evidence/:id', (req, res) => {
    const { id } = req.params;
    connection.query('SELECT * FROM evidence WHERE id = ?', [id], (err, results) => {
        if (err) return res.status(500).json({ status: 'error', message: err.message, data: null });
        if (results.length === 0) return res.status(404).json({ status: 'error', message: 'Evidence not found', data: null });
        res.json({ status: 'success', message: 'Evidence retrieved', data: results[0] });
    });
});

app.put('/evidence/:id', authenticateToken, upload.single('file'), (req, res) => {
    const { id } = req.params;
    const { report_id } = req.body;
    const file_path = `http://localhost:3000/uploads/${req.file.filename}`;
    connection.query('UPDATE evidence SET report_id = ?, file_path = ? WHERE id = ?', [report_id, file_path, id], (err) => {
        if (err) return res.status(500).json({ status: 'error', message: err.message, data: null });
        res.json({ status: 'success', message: 'Evidence updated', data: { id, report_id, file_path } });
    });
});

app.delete('/evidence/:id', authenticateToken, (req, res) => {
    const { id } = req.params;
    connection.query('DELETE FROM evidence WHERE id = ?', [id], (err) => {
        if (err) return res.status(500).json({ status: 'error', message: err.message, data: null });
        res.status(204).json({ status: 'success', message: 'Evidence deleted', data: null });
    });
});

// CRUD operations for invoices
app.post('/invoices', authenticateToken, upload.single('file'), (req, res) => {
    const { payment_id, invoice_number, media_id } = req.body;
    const file_path = `http://localhost:3000/uploads/${req.file.filename}`;
    connection.query('INSERT INTO invoices (payment_id, invoice_number, file_path, media_id) VALUES (?, ?, ?, ?)', [payment_id, invoice_number, file_path, media_id], (err, results) => {
        if (err) return res.status(500).json({ status: 'error', message: err.message, data: null });
        res.status(201).json({ status: 'success', message: 'Invoice created', data: { id: results.insertId, payment_id, invoice_number, file_path, media_id } });
    });
});

app.get('/invoices', (req, res) => {
    connection.query('SELECT * FROM invoices', (err, results) => {
        if (err) return res.status(500).json({ status: 'error', message: err.message, data: null });
        res.json({ status: 'success', message: 'Invoices retrieved', data: results });
    });
});

app.get('/invoices/:id', (req, res) => {
    const { id } = req.params;
    connection.query('SELECT * FROM invoices WHERE id = ?', [id], (err, results) => {
        if (err) return res.status(500).json({ status: 'error', message: err.message, data: null });
        if (results.length === 0) return res.status(404).json({ status: 'error', message: 'Invoice not found', data: null });
        res.json({ status: 'success', message: 'Invoice retrieved', data: results[0] });
    });
});

app.put('/invoices/:id', authenticateToken, upload.single('file'), (req, res) => {
    const { id } = req.params;
    const { payment_id, invoice_number, media_id } = req.body;
    const file_path = `http://localhost:3000/uploads/${req.file.filename}`;
    connection.query('UPDATE invoices SET payment_id = ?, invoice_number = ?, file_path = ?, media_id = ? WHERE id = ?', [payment_id, invoice_number, file_path, media_id, id], (err) => {
        if (err) return res.status(500).json({ status: 'error', message: err.message, data: null });
        res.json({ status: 'success', message: 'Invoice updated', data: { id, payment_id, invoice_number, file_path, media_id } });
    });
});

app.delete('/invoices/:id', authenticateToken, (req, res) => {
    const { id } = req.params;
    connection.query('DELETE FROM invoices WHERE id = ?', [id], (err) => {
        if (err) return res.status(500).json({ status: 'error', message: err.message, data: null });
        res.status(204).json({ status: 'success', message: 'Invoice deleted', data: null });
    });
});

// CRUD operations for login_history
app.post('/login_history', authenticateToken, (req, res) => {
    const { user_id, ip_address, user_agent } = req.body;
    connection.query('INSERT INTO login_history (user_id, ip_address, user_agent) VALUES (?, ?, ?)', [user_id, ip_address, user_agent], (err, results) => {
        if (err) return res.status(500).json({ status: 'error', message: err.message, data: null });
        res.status(201).json({ status: 'success', message: 'Login history created', data: { id: results.insertId, user_id, ip_address, user_agent } });
    });
});

app.get('/login_history', (req, res) => {
    connection.query('SELECT * FROM login_history', (err, results) => {
        if (err) return res.status(500).json({ status: 'error', message: err.message, data: null });
        res.json({ status: 'success', message: 'Login history retrieved', data: results });
    });
});

app.get('/login_history/:id', (req, res) => {
    const { id } = req.params;
    connection.query('SELECT * FROM login_history WHERE id = ?', [id], (err, results) => {
        if (err) return res.status(500).json({ status: 'error', message: err.message, data: null });
        if (results.length === 0) return res.status(404).json({ status: 'error', message: 'Login history not found', data: null });
        res.json({ status: 'success', message: 'Login history retrieved', data: results[0] });
    });
});

app.put('/login_history/:id', authenticateToken, (req, res) => {
    const { id } = req.params;
    const { user_id, ip_address, user_agent } = req.body;
    connection.query('UPDATE login_history SET user_id = ?, ip_address = ?, user_agent = ? WHERE id = ?', [user_id, ip_address, user_agent, id], (err) => {
        if (err) return res.status(500).json({ status: 'error', message: err.message, data: null });
        res.json({ status: 'success', message: 'Login history updated', data: { id, user_id, ip_address, user_agent } });
    });
});

app.delete('/login_history/:id', authenticateToken, (req, res) => {
    const { id } = req.params;
    connection.query('DELETE FROM login_history WHERE id = ?', [id], (err) => {
        if (err) return res.status(500).json({ status: 'error', message: err.message, data: null });
        res.status(204).json({ status: 'success', message: 'Login history deleted', data: null });
    });
});

// CRUD operations for notifications
app.post('/notifications', authenticateToken, (req, res) => {
    const { user_id, title, message, read_status } = req.body;
    connection.query('INSERT INTO notifications (user_id, title, message, read_status) VALUES (?, ?, ?, ?)', [user_id, title, message, read_status], (err, results) => {
        if (err) return res.status(500).json({ status: 'error', message: err.message, data: null });
        res.status(201).json({ status: 'success', message: 'Notification created', data: { id: results.insertId, user_id, title, message, read_status } });
    });
});

app.get('/notifications', (req, res) => {
    connection.query('SELECT * FROM notifications', (err, results) => {
        if (err) return res.status(500).json({ status: 'error', message: err.message, data: null });
        res.json({ status: 'success', message: 'Notifications retrieved', data: results });
    });
});

app.get('/notifications/:id', (req, res) => {
    const { id } = req.params;
    connection.query('SELECT * FROM notifications WHERE id = ?', [id], (err, results) => {
        if (err) return res.status(500).json({ status: 'error', message: err.message, data: null });
        if (results.length === 0) return res.status(404).json({ status: 'error', message: 'Notification not found', data: null });
        res.json({ status: 'success', message: 'Notification retrieved', data: results[0] });
    });
});

app.put('/notifications/:id', authenticateToken, (req, res) => {
    const { id } = req.params;
    const { user_id, title, message, read_status } = req.body;
    connection.query('UPDATE notifications SET user_id = ?, title = ?, message = ?, read_status = ? WHERE id = ?', [user_id, title, message, read_status, id], (err) => {
        if (err) return res.status(500).json({ status: 'error', message: err.message, data: null });
        res.json({ status: 'success', message: 'Notification updated', data: { id, user_id, title, message, read_status } });
    });
});

app.delete('/notifications/:id', authenticateToken, (req, res) => {
    const { id } = req.params;
    connection.query('DELETE FROM notifications WHERE id = ?', [id], (err) => {
        if (err) return res.status(500).json({ status: 'error', message: err.message, data: null });
        res.status(204).json({ status: 'success', message: 'Notification deleted', data: null });
    });
});

// CRUD operations for notification_templates
app.post('/notification_templates', authenticateToken, (req, res) => {
    const { name, content } = req.body;
    connection.query('INSERT INTO notification_templates (name, content) VALUES (?, ?)', [name, content], (err, results) => {
        if (err) return res.status(500).json({ status: 'error', message: err.message, data: null });
        res.status(201).json({ status: 'success', message: 'Notification template created', data: { id: results.insertId, name, content } });
    });
});

app.get('/notification_templates', (req, res) => {
    connection.query('SELECT * FROM notification_templates', (err, results) => {
        if (err) return res.status(500).json({ status: 'error', message: err.message, data: null });
        res.json({ status: 'success', message: 'Notification templates retrieved', data: results });
    });
});

app.get('/notification_templates/:id', (req, res) => {
    const { id } = req.params;
    connection.query('SELECT * FROM notification_templates WHERE id = ?', [id], (err, results) => {
        if (err) return res.status(500).json({ status: 'error', message: err.message, data: null });
        if (results.length === 0) return res.status(404).json({ status: 'error', message: 'Notification template not found', data: null });
        res.json({ status: 'success', message: 'Notification template retrieved', data: results[0] });
    });
});

app.put('/notification_templates/:id', authenticateToken, (req, res) => {
    const { id } = req.params;
    const { name, content } = req.body;
    connection.query('UPDATE notification_templates SET name = ?, content = ? WHERE id = ?', [name, content, id], (err) => {
        if (err) return res.status(500).json({ status: 'error', message: err.message, data: null });
        res.json({ status: 'success', message: 'Notification template updated', data: { id, name, content } });
    });
});

app.delete('/notification_templates/:id', authenticateToken, (req, res) => {
    const { id } = req.params;
    connection.query('DELETE FROM notification_templates WHERE id = ?', [id], (err) => {
        if (err) return res.status(500).json({ status: 'error', message: err.message, data: null });
        res.status(204).json({ status: 'success', message: 'Notification template deleted', data: null });
    });
});

// CRUD operations for payments
app.post('/payments', authenticateToken, (req, res) => {
    const { user_id, amount, status } = req.body;
    connection.query('INSERT INTO payments (user_id, amount, status) VALUES (?, ?, ?)', [user_id, amount, status], (err, results) => {
        if (err) return res.status(500).json({ status: 'error', message: err.message, data: null });
        res.status(201).json({ status: 'success', message: 'Payment created', data: { id: results.insertId, user_id, amount, status } });
    });
});

app.get('/payments', (req, res) => {
    connection.query('SELECT * FROM payments', (err, results) => {
        if (err) return res.status(500).json({ status: 'error', message: err.message, data: null });
        res.json({ status: 'success', message: 'Payments retrieved', data: results });
    });
});

app.get('/payments/:id', (req, res) => {
    const { id } = req.params;
    connection.query('SELECT * FROM payments WHERE id = ?', [id], (err, results) => {
        if (err) return res.status(500).json({ status: 'error', message: err.message, data: null });
        if (results.length === 0) return res.status(404).json({ status: 'error', message: 'Payment not found', data: null });
        res.json({ status: 'success', message: 'Payment retrieved', data: results[0] });
    });
});

app.put('/payments/:id', authenticateToken, (req, res) => {
    const { id } = req.params;
    const { user_id, amount, status } = req.body;
    connection.query('UPDATE payments SET user_id = ?, amount = ?, status = ? WHERE id = ?', [user_id, amount, status, id], (err) => {
        if (err) return res.status(500).json({ status: 'error', message: err.message, data: null });
        res.json({ status: 'success', message: 'Payment updated', data: { id, user_id, amount, status } });
    });
});

app.delete('/payments/:id', authenticateToken, (req, res) => {
    const { id } = req.params;
    connection.query('DELETE FROM payments WHERE id = ?', [id], (err) => {
        if (err) return res.status(500).json({ status: 'error', message: err.message, data: null });
        res.status(204).json({ status: 'success', message: 'Payment deleted', data: null });
    });
});

// CRUD operations for permissions
app.post('/permissions', authenticateToken, (req, res) => {
    const { name, description } = req.body;
    connection.query('INSERT INTO permissions (name, description) VALUES (?, ?)', [name, description], (err, results) => {
        if (err) return res.status(500).json({ status: 'error', message: err.message, data: null });
        res.status(201).json({ status: 'success', message: 'Permission created', data: { id: results.insertId, name, description } });
    });
});

app.get('/permissions', (req, res) => {
    connection.query('SELECT * FROM permissions', (err, results) => {
        if (err) return res.status(500).json({ status: 'error', message: err.message, data: null });
        res.json({ status: 'success', message: 'Permissions retrieved', data: results });
    });
});

app.get('/permissions/:id', (req, res) => {
    const { id } = req.params;
    connection.query('SELECT * FROM permissions WHERE id = ?', [id], (err, results) => {
        if (err) return res.status(500).json({ status: 'error', message: err.message, data: null });
        if (results.length === 0) return res.status(404).json({ status: 'error', message: 'Permission not found', data: null });
        res.json({ status: 'success', message: 'Permission retrieved', data: results[0] });
    });
});

app.put('/permissions/:id', authenticateToken, (req, res) => {
    const { id } = req.params;
    const { name, description } = req.body;
    connection.query('UPDATE permissions SET name = ?, description = ? WHERE id = ?', [name, description, id], (err) => {
        if (err) return res.status(500).json({ status: 'error', message: err.message, data: null });
        res.json({ status: 'success', message: 'Permission updated', data: { id, name, description } });
    });
});

app.delete('/permissions/:id', authenticateToken, (req, res) => {
    const { id } = req.params;
    connection.query('DELETE FROM permissions WHERE id = ?', [id], (err) => {
        if (err) return res.status(500).json({ status: 'error', message: err.message, data: null });
        res.status(204).json({ status: 'success', message: 'Permission deleted', data: null });
    });
});

// CRUD operations for plans
app.post('/plans', authenticateToken, (req, res) => {
    const { name, description, price } = req.body;
    connection.query('INSERT INTO plans (name, description, price) VALUES (?, ?, ?)', [name, description, price], (err, results) => {
        if (err) return res.status(500).json({ status: 'error', message: err.message, data: null });
        res.status(201).json({ status: 'success', message: 'Plan created', data: { id: results.insertId, name, description, price } });
    });
});

app.get('/plans', (req, res) => {
    connection.query('SELECT * FROM plans', (err, results) => {
        if (err) return res.status(500).json({ status: 'error', message: err.message, data: null });
        res.json({ status: 'success', message: 'Plans retrieved', data: results });
    });
});

app.get('/plans/:id', (req, res) => {
    const { id } = req.params;
    connection.query('SELECT * FROM plans WHERE id = ?', [id], (err, results) => {
        if (err) return res.status(500).json({ status: 'error', message: err.message, data: null });
        if (results.length === 0) return res.status(404).json({ status: 'error', message: 'Plan not found', data: null });
        res.json({ status: 'success', message: 'Plan retrieved', data: results[0] });
    });
});

app.put('/plans/:id', authenticateToken, (req, res) => {
    const { id } = req.params;
    const { name, description, price } = req.body;
    connection.query('UPDATE plans SET name = ?, description = ?, price = ? WHERE id = ?', [name, description, price, id], (err) => {
        if (err) return res.status(500).json({ status: 'error', message: err.message, data: null });
        res.json({ status: 'success', message: 'Plan updated', data: { id, name, description, price } });
    });
});

app.delete('/plans/:id', authenticateToken, (req, res) => {
    const { id } = req.params;
    connection.query('DELETE FROM plans WHERE id = ?', [id], (err) => {
        if (err) return res.status(500).json({ status: 'error', message: err.message, data: null });
        res.status(204).json({ status: 'success', message: 'Plan deleted', data: null });
    });
});

// CRUD operations for media
app.post('/media', authenticateToken, upload.single('file'), (req, res) => {
    const { file } = req;
    const filePath = `http://localhost:3000/uploads/${file.filename}`;
    const fileType = file.mimetype;
    connection.query('INSERT INTO media (file_path, file_type) VALUES (?, ?)', [filePath, fileType], (err, results) => {
        if (err) return res.status(500).json({ status: 'error', message: err.message, data: null });
        res.status(201).json({ status: 'success', message: 'Media created', data: { id: results.insertId, file_path: filePath, file_type: fileType } });
    });
});



app.post('/media/report', authenticateToken, upload.single('file'), (req, res) => {
    const { report_id } = req.body;
    const { file } = req;
    const filePath = `http://localhost:3000/uploads/${file.filename}`;
    const fileType = file.mimetype;
    connection.query('INSERT INTO media (file_path, file_type, report_id) VALUES (?, ?, ?)', [filePath, fileType, report_id], (err, results) => {
        if (err) return res.status(500).json({ status: 'error', message: err.message, data: null });
        res.status(201).json({ status: 'success', message: 'Media created for report', data: { id: results.insertId, file_path: filePath, file_type: fileType, report_id } });
    });
});

app.get('/media', (req, res) => {
    connection.query('SELECT * FROM media', (err, results) => {
        if (err) return res.status(500).json({ status: 'error', message: err.message, data: null });
        res.json({ status: 'success', message: 'Media retrieved', data: results });
    });
});

app.get('/media/:id', (req, res) => {
    const { id } = req.params;
    connection.query('SELECT * FROM media WHERE id = ?', [id], (err, results) => {
        if (err) return res.status(500).json({ status: 'error', message: err.message, data: null });
        if (results.length === 0) return res.status(404).json({ status: 'error', message: 'Media not found', data: null });
        res.json({ status: 'success', message: 'Media retrieved', data: results[0] });
    });
});

app.put('/media/:id', authenticateToken, (req, res) => {
    const { id } = req.params;
    const { file_path, file_type } = req.body;
    connection.query('UPDATE media SET file_path = ?, file_type = ? WHERE id = ?', [file_path, file_type, id], (err) => {
        if (err) return res.status(500).json({ status: 'error', message: err.message, data: null });
        res.json({ status: 'success', message: 'Media updated', data: { id, file_path, file_type } });
    });
});

app.delete('/media/:id', authenticateToken, (req, res) => {
    const { id } = req.params;
    connection.query('DELETE FROM media WHERE id = ?', [id], (err) => {
        if (err) return res.status(500).json({ status: 'error', message: err.message, data: null });
        res.status(204).json({ status: 'success', message: 'Media deleted', data: null });
    });
});

// CRUD operations for reports
app.post('/reports', authenticateToken, upload.array('files', 4), (req, res) => {
    const { user_id, title, description, category_id, city_id } = req.body;
    console.log('Received request to create report', req.body);

    const status = 'pending'; // Set default status to 'pending'
    const files = req.files || []; // Ensure files is an array

    connection.query('INSERT INTO reports (user_id, title, description, category_id, city_id, status) VALUES (?, ?, ?, ?, ?, ?)', [user_id, title, description, category_id, city_id, status], (err, results) => {
        if (err) {
            console.error('Error inserting report:', err);
            return res.status(500).json({ status: 'error', message: err.message, data: null });
        }

        console.log('Report inserted successfully', results.insertId);
        const reportId = results.insertId; // Get the inserted report ID
        const mediaQueries = files.map(file => {
            console.log('file file', file);
            const filePath = `http://localhost:3000/uploads/${file.filename}`;
            const fileType = file.mimetype;
            console.log('file file', file);

            return new Promise((resolve, reject) => {
                connection.query('INSERT INTO media (file_path, file_type, report_id) VALUES (?, ?, ?)', [filePath, fileType, reportId], (err, mediaResults) => {
                    if (err) {
                        console.error('Error inserting media:', err);
                        return reject(err);
                    }
                    console.log('Media inserted successfully');
                    resolve(mediaResults);
                });
            });
        });

        Promise.all(mediaQueries)
            .then(() => {
                console.log('All media inserted successfully');
                res.status(201).json({ status: 'success', message: 'Report created with media', data: { id: reportId, user_id, title, description, category_id, city_id, status } });
            })
            .catch(err => {
                console.error('Error inserting media:', err);
                res.status(500).json({ status: 'error', message: err.message, data: null });
            });
    });
});

app.put('/reports/:id', authenticateToken, upload.single('file'), (req, res) => {
    const { id } = req.params;
    const { user_id, title, description, category_id, city_id, status, media_id } = req.body;
    const file_path = `http://localhost:3000/uploads/${req.file.filename}`;
    connection.query('UPDATE reports SET user_id = ?, title = ?, description = ?, category_id = ?, city_id = ?, status = ?, media_id = ?, file_path = ? WHERE id = ?', [user_id, title, description, category_id, city_id, status, media_id, file_path, id], (err) => {
        if (err) return res.status(500).json({ status: 'error', message: err.message, data: null });
        res.json({ status: 'success', message: 'Report updated', data: { id, user_id, title, description, category_id, city_id, status, media_id, file_path } });
    });
});

app.get('/reports', (req, res) => {
    const query = `
        SELECT reports.*, 
               users.username, users.email, users.first_name, users.last_name,
               categories.name AS category_name, categories.slug AS category_slug,
               category_media.file_path AS category_image_path, category_media.file_type AS category_image_type
        FROM reports
        LEFT JOIN users ON reports.user_id = users.id
        LEFT JOIN categories ON reports.category_id = categories.id
        LEFT JOIN media AS category_media ON categories.media_id = category_media.id
    `;
    connection.query(query, (err, reports) => {
        if (err) return res.status(500).json({ status: 'error', message: err.message, data: null });

        const reportIds = reports.map(report => report.id);
        if (reportIds.length === 0) {
            return res.json({ status: 'success', message: 'Reports retrieved', data: [] });
        }

        const mediaQuery = `
            SELECT * FROM media WHERE report_id IN (?)
        `;
        connection.query(mediaQuery, [reportIds], (err, media) => {
            if (err) return res.status(500).json({ status: 'error', message: err.message, data: null });

            const mediaByReportId = media.reduce((acc, item) => {
                if (!acc[item.report_id]) {
                    acc[item.report_id] = [];
                }
                acc[item.report_id].push(item);
                return acc;
            }, {});

            const reportsWithMedia = reports.map(report => ({
                ...report,
                media: mediaByReportId[report.id] || []
            }));

            res.json({ status: 'success', message: 'Reports retrieved', data: reportsWithMedia });
        });
    });
});

app.get('/reports/:id', (req, res) => {
    const { id } = req.params;
    const query = `
        SELECT reports.*, 
               users.username, users.email, users.first_name, users.last_name,
               categories.name AS category_name, categories.slug AS category_slug,
               category_media.file_path AS category_image_path, category_media.file_type AS category_image_type
        FROM reports
        LEFT JOIN users ON reports.user_id = users.id
        LEFT JOIN categories ON reports.category_id = categories.id
        LEFT JOIN media AS category_media ON categories.media_id = category_media.id
        WHERE reports.id = ?
    `;
    connection.query(query, [id], (err, reports) => {
        if (err) return res.status(500).json({ status: 'error', message: err.message, data: null });
        if (reports.length === 0) return res.status(404).json({ status: 'error', message: 'Report not found', data: null });

        const report = reports[0];
        const mediaQuery = `
            SELECT * FROM media WHERE report_id = ?
        `;
        connection.query(mediaQuery, [id], (err, media) => {
            if (err) return res.status(500).json({ status: 'error', message: err.message, data: null });

            report.media = media;
            res.json({ status: 'success', message: 'Report retrieved', data: report });
        });
    });
});
app.get('/reports/category/:categoryId', (req, res) => {
    const { categoryId } = req.params;
    const query = `
        SELECT reports.*, 
               users.username, users.email, users.first_name, users.last_name,
               categories.name AS category_name, categories.slug AS category_slug,
               category_media.file_path AS category_image_path, category_media.file_type AS category_image_type
        FROM reports
        LEFT JOIN users ON reports.user_id = users.id
        LEFT JOIN categories ON reports.category_id = categories.id
        LEFT JOIN media AS category_media ON categories.media_id = category_media.id
        WHERE reports.category_id = ?
    `;
    connection.query(query, [categoryId], (err, reports) => {
        if (err) return res.status(500).json({ status: 'error', message: err.message, data: null });

        const reportIds = reports.map(report => report.id);
        if (reportIds.length === 0) {
            return res.json({ status: 'success', message: 'Reports retrieved', data: [] });
        }

        const mediaQuery = `
            SELECT * FROM media WHERE report_id IN (?)
        `;
        connection.query(mediaQuery, [reportIds], (err, media) => {
            if (err) return res.status(500).json({ status: 'error', message: err.message, data: null });

            const mediaByReportId = media.reduce((acc, item) => {
                if (!acc[item.report_id]) {
                    acc[item.report_id] = [];
                }
                acc[item.report_id].push(item);
                return acc;
            }, {});

            const reportsWithMedia = reports.map(report => ({
                ...report,
                media: mediaByReportId[report.id] || []
            }));

            res.json({ status: 'success', message: 'Reports retrieved', data: reportsWithMedia });
        });
    });
});

app.delete('/reports/:id', authenticateToken, (req, res) => {
    const { id } = req.params;
    connection.query('DELETE FROM reports WHERE id = ?', [id], (err) => {
        if (err) return res.status(500).json({ status: 'error', message: err.message, data: null });
        res.status(204).json({ status: 'success', message: 'Report deleted', data: null });
    });
});

// CRUD operations for roles
app.post('/roles', authenticateToken, (req, res) => {
    const { name, slug } = req.body;
    connection.query('INSERT INTO roles (name, slug) VALUES (?, ?)', [name, slug], (err, results) => {
        if (err) return res.status(500).json({ status: 'error', message: err.message, data: null });
        res.status(201).json({ status: 'success', message: 'Role created', data: { id: results.insertId, name, slug } });
    });
});

app.get('/roles', (req, res) => {
    connection.query('SELECT * FROM roles', (err, results) => {
        if (err) return res.status(500).json({ status: 'error', message: err.message, data: null });
        res.json({ status: 'success', message: 'Roles retrieved', data: results });
    });
});

app.get('/roles/:id', (req, res) => {
    const { id } = req.params;
    connection.query('SELECT * FROM roles WHERE id = ?', [id], (err, results) => {
        if (err) return res.status(500).json({ status: 'error', message: err.message, data: null });
        if (results.length === 0) return res.status(404).json({ status: 'error', message: 'Role not found', data: null });
        res.json({ status: 'success', message: 'Role retrieved', data: results[0] });
    });
});

app.put('/roles/:id', authenticateToken, (req, res) => {
    const { id } = req.params;
    const { name, slug } = req.body;
    connection.query('UPDATE roles SET name = ?, slug = ? WHERE id = ?', [name, slug, id], (err) => {
        if (err) return rres.status(500).json({ status: 'error', message: err.message, data: null });
        res.json({ status: 'success', message: 'Role updated', data: { id, name, slug } });
    });
});

app.delete('/roles/:id', authenticateToken, (req, res) => {
    const { id } = req.params;
    connection.query('DELETE FROM roles WHERE id = ?', [id], (err) => {
        if (err) return res.status(500).json({ status: 'error', message: err.message, data: null });
        res.status(204).json({ status: 'success', message: 'Role deleted', data: null });
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ status: 'error', message: 'Internal Server Error', data: null });
});

// Start the server
const port = 3000;
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
