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
    const token = req.headers['authorization'];
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

// CRUD operations for categories
app.post('/categories', authenticateToken, validate([
    body('name').isString().notEmpty(),
    body('slug').isString().notEmpty(),
    body('media_id').optional().isInt()
]), (req, res) => {
    const { name, slug, media_id } = req.body;
    connection.query('INSERT INTO categories (name, slug, media_id) VALUES (?, ?, ?)', [name, slug, media_id], (err, results) => {
        if (err) return res.status(500).send(err);
        res.status(201).send({ id: results.insertId, name, slug, media_id });
    });
});

app.get('/categories', (req, res) => {
    connection.query('SELECT * FROM categories', (err, results) => {
        if (err) return res.status(500).send(err);
        res.send(results);
    });
});

app.get('/categories/:id', validate([
    param('id').isInt()
]), (req, res) => {
    const { id } = req.params;
    connection.query('SELECT * FROM categories WHERE id = ?', [id], (err, results) => {
        if (err) return res.status(500).send(err);
        if (results.length === 0) return res.status(404).send('Category not found');
        res.send(results[0]);
    });
});

app.put('/categories/:id', authenticateToken, validate([
    param('id').isInt(),
    body('name').isString().notEmpty(),
    body('slug').isString().notEmpty(),
    body('media_id').optional().isInt()
]), (req, res) => {
    const { id } = req.params;
    const { name, slug, media_id } = req.body;
    connection.query('UPDATE categories SET name = ?, slug = ?, media_id = ? WHERE id = ?', [name, slug, media_id, id], (err) => {
        if (err) return res.status(500).send(err);
        res.send({ id, name, slug, media_id });
    });
});

app.delete('/categories/:id', authenticateToken, validate([
    param('id').isInt()
]), (req, res) => {
    const { id } = req.params;
    connection.query('DELETE FROM categories WHERE id = ?', [id], (err) => {
        if (err) return res.status(500).send(err);
        res.status(204).send();
    });
});

// CRUD operations for chatbot_messages
app.post('/chatbot_messages', authenticateToken, validate([
    body('user_id').isInt(),
    body('message').isString().notEmpty(),
    body('response').isString().notEmpty()
]), (req, res) => {
    const { user_id, message, response } = req.body;
    connection.query('INSERT INTO chatbot_messages (user_id, message, response) VALUES (?, ?, ?)', [user_id, message, response], (err, results) => {
        if (err) return res.status(500).send(err);
        res.status(201).send({ id: results.insertId, user_id, message, response });
    });
});

app.get('/chatbot_messages', authenticateToken, (req, res) => {
    connection.query('SELECT * FROM chatbot_messages', (err, results) => {
        if (err) return res.status(500).send(err);
        res.send(results);
    });
});

app.get('/chatbot_messages/:id', authenticateToken, validate([
    param('id').isInt()
]), (req, res) => {
    const { id } = req.params;
    connection.query('SELECT * FROM chatbot_messages WHERE id = ?', [id], (err, results) => {
        if (err) return res.status(500).send(err);
        if (results.length === 0) return res.status(404).send('Chatbot message not found');
        res.send(results[0]);
    });
});

app.put('/chatbot_messages/:id', authenticateToken, validate([
    param('id').isInt(),
    body('user_id').isInt(),
    body('message').isString().notEmpty(),
    body('response').isString().notEmpty()
]), (req, res) => {
    const { id } = req.params;
    const { user_id, message, response } = req.body;
    connection.query('UPDATE chatbot_messages SET user_id = ?, message = ?, response = ? WHERE id = ?', [user_id, message, response, id], (err) => {
        if (err) return res.status(500).send(err);
        res.send({ id, user_id, message, response });
    });
});

app.delete('/chatbot_messages/:id', authenticateToken, validate([
    param('id').isInt()
]), (req, res) => {
    const { id } = req.params;
    connection.query('DELETE FROM chatbot_messages WHERE id = ?', [id], (err) => {
        if (err) return res.status(500).send(err);
        res.status(204).send();
    });
});

// CRUD operations for cities
app.post('/cities', authenticateToken, validate([
    body('name').isString().notEmpty(),
    body('postal_code').isString().notEmpty(),
    body('country').isString().notEmpty()
]), (req, res) => {
    const { name, postal_code, country } = req.body;
    connection.query('INSERT INTO cities (name, postal_code, country) VALUES (?, ?, ?)', [name, postal_code, country], (err, results) => {
        if (err) return res.status(500).send(err);
        res.status(201).send({ id: results.insertId, name, postal_code, country });
    });
});

app.get('/cities', (req, res) => {
    connection.query('SELECT * FROM cities', (err, results) => {
        if (err) return res.status(500).send(err);
        res.send(results);
    });
});

app.get('/cities/:id', validate([
    param('id').isInt()
]), (req, res) => {
    const { id } = req.params;
    connection.query('SELECT * FROM cities WHERE id = ?', [id], (err, results) => {
        if (err) return res.status(500).send(err);
        if (results.length === 0) return res.status(404).send('City not found');
        res.send(results[0]);
    });
});

app.put('/cities/:id', authenticateToken, validate([
    param('id').isInt(),
    body('name').isString().notEmpty(),
    body('postal_code').isString().notEmpty(),
    body('country').isString().notEmpty()
]), (req, res) => {
    const { id } = req.params;
    const { name, postal_code, country } = req.body;
    connection.query('UPDATE cities SET name = ?, postal_code = ?, country = ? WHERE id = ?', [name, postal_code, country, id], (err) => {
        if (err) return res.status(500).send(err);
        res.send({ id, name, postal_code, country });
    });
});

app.delete('/cities/:id', authenticateToken, validate([
    param('id').isInt()
]), (req, res) => {
    const { id } = req.params;
    connection.query('DELETE FROM cities WHERE id = ?', [id], (err) => {
        if (err) return res.status(500).send(err);
        res.status(204).send();
    });
});

// CRUD operations for comments
app.post('/comments', authenticateToken, validate([
    body('report_id').isInt(),
    body('user_id').isInt(),
    body('content').isString().notEmpty()
]), (req, res) => {
    const { report_id, user_id, content } = req.body;
    connection.query('INSERT INTO comments (report_id, user_id, content) VALUES (?, ?, ?)', [report_id, user_id, content], (err, results) => {
        if (err) return res.status(500).send(err);
        res.status(201).send({ id: results.insertId, report_id, user_id, content });
    });
});

app.get('/comments', (req, res) => {
    connection.query('SELECT * FROM comments', (err, results) => {
        if (err) return res.status(500).send(err);
        res.send(results);
    });
});

app.get('/comments/:id', validate([
    param('id').isInt()
]), (req, res) => {
    const { id } = req.params;
    connection.query('SELECT * FROM comments WHERE id = ?', [id], (err, results) => {
        if (err) return res.status(500).send(err);
        if (results.length === 0) return res.status(404).send('Comment not found');
        res.send(results[0]);
    });
});

app.put('/comments/:id', authenticateToken, validate([
    param('id').isInt(),
    body('report_id').isInt(),
    body('user_id').isInt(),
    body('content').isString().notEmpty()
]), (req, res) => {
    const { id } = req.params;
    const { report_id, user_id, content } = req.body;
    connection.query('UPDATE comments SET report_id = ?, user_id = ?, content = ? WHERE id = ?', [report_id, user_id, content, id], (err) => {
        if (err) return res.status(500).send(err);
        res.send({ id, report_id, user_id, content });
    });
});

app.delete('/comments/:id', authenticateToken, validate([
    param('id').isInt()
]), (req, res) => {
    const { id } = req.params;
    connection.query('DELETE FROM comments WHERE id = ?', [id], (err) => {
        if (err) return res.status(500).send(err);
        res.status(204).send();
    });
});

// CRUD operations for data_exports
app.post('/data_exports', authenticateToken, validate([
    body('user_id').isInt(),
    body('file_path').isString().notEmpty()
]), (req, res) => {
    const { user_id, file_path } = req.body;
    connection.query('INSERT INTO data_exports (user_id, file_path) VALUES (?, ?)', [user_id, file_path], (err, results) => {
        if (err) return res.status(500).send(err);
        res.status(201).send({ id: results.insertId, user_id, file_path });
    });
});

app.get('/data_exports', (req, res) => {
    connection.query('SELECT * FROM data_exports', (err, results) => {
        if (err) return res.status(500).send(err);
        res.send(results);
    });
});

app.get('/data_exports/:id', validate([
    param('id').isInt()
]), (req, res) => {
    const { id } = req.params;
    connection.query('SELECT * FROM data_exports WHERE id = ?', [id], (err, results) => {
        if (err) return res.status(500).send(err);
        if (results.length === 0) return res.status(404).send('Data export not found');
        res.send(results[0]);
    });
});

app.put('/data_exports/:id', authenticateToken, validate([
    param('id').isInt(),
    body('user_id').isInt(),
    body('file_path').isString().notEmpty()
]), (req, res) => {
    const { id } = req.params;
    const { user_id, file_path } = req.body;
    connection.query('UPDATE data_exports SET user_id = ?, file_path = ? WHERE id = ?', [user_id, file_path, id], (err) => {
        if (err) return res.status(500).send(err);
        res.send({ id, user_id, file_path });
    });
});

app.delete('/data_exports/:id', authenticateToken, validate([
    param('id').isInt()
]), (req, res) => {
    const { id } = req.params;
    connection.query('DELETE FROM data_exports WHERE id = ?', [id], (err) => {
        if (err) return res.status(500).send(err);
        res.status(204).send();
    });
});

// CRUD operations for deleted_reasons
app.post('/deleted_reasons', authenticateToken, validate([
    body('name').isString().notEmpty(),
    body('slug').isString().notEmpty(),
    body('long_name').isString().notEmpty(),
    body('type').isString().notEmpty()
]), (req, res) => {
    const { name, slug, long_name, type } = req.body;
    connection.query('INSERT INTO deleted_reasons (name, slug, long_name, type) VALUES (?, ?, ?, ?)', [name, slug, long_name, type], (err, results) => {
        if (err) return res.status(500).send(err);
        res.status(201).send({ id: results.insertId, name, slug, long_name, type });
    });
});

app.get('/deleted_reasons', (req, res) => {
    connection.query('SELECT * FROM deleted_reasons', (err, results) => {
        if (err) return res.status(500).send(err);
        res.send(results);
    });
});

app.get('/deleted_reasons/:id', validate([
    param('id').isInt()
]), (req, res) => {
    const { id } = req.params;
    connection.query('SELECT * FROM deleted_reasons WHERE id = ?', [id], (err, results) => {
        if (err) return res.status(500).send(err);
        if (results.length === 0) return res.status(404).send('Deleted reason not found');
        res.send(results[0]);
    });
});

app.put('/deleted_reasons/:id', authenticateToken, validate([
    param('id').isInt(),
    body('name').isString().notEmpty(),
    body('slug').isString().notEmpty(),
    body('long_name').isString().notEmpty(),
    body('type').isString().notEmpty()
]), (req, res) => {
    const { id } = req.params;
    const { name, slug, long_name, type } = req.body;
    connection.query('UPDATE deleted_reasons SET name = ?, slug = ?, long_name = ?, type = ? WHERE id = ?', [name, slug, long_name, type, id], (err) => {
        if (err) return res.status(500).send(err);
        res.send({ id, name, slug, long_name, type });
    });
});

app.delete('/deleted_reasons/:id', authenticateToken, validate([
    param('id').isInt()
]), (req, res) => {
    const { id } = req.params;
    connection.query('DELETE FROM deleted_reasons WHERE id = ?', [id], (err) => {
        if (err) return res.status(500).send(err);
        res.status(204).send();
    });
});

// CRUD operations for delete_requests
app.post('/delete_requests', authenticateToken, validate([
    body('user_id').isInt(),
    body('reason').isString().notEmpty(),
    body('status').isIn(['pending', 'processed']),
    body('deleted_reason_id').optional().isInt()
]), (req, res) => {
    const { user_id, reason, status, deleted_reason_id } = req.body;
    connection.query('INSERT INTO delete_requests (user_id, reason, status, deleted_reason_id) VALUES (?, ?, ?, ?)', [user_id, reason, status, deleted_reason_id], (err, results) => {
        if (err) return res.status(500).send(err);
        res.status(201).send({ id: results.insertId, user_id, reason, status, deleted_reason_id });
    });
});

app.get('/delete_requests', (req, res) => {
    connection.query('SELECT * FROM delete_requests', (err, results) => {
        if (err) return res.status(500).send(err);
        res.send(results);
    });
});

app.get('/delete_requests/:id', validate([
    param('id').isInt()
]), (req, res) => {
    const { id } = req.params;
    connection.query('SELECT * FROM delete_requests WHERE id = ?', [id], (err, results) => {
        if (err) return res.status(500).send(err);
        if (results.length === 0) return res.status(404).send('Delete request not found');
        res.send(results[0]);
    });
});

app.put('/delete_requests/:id', authenticateToken, validate([
    param('id').isInt(),
    body('user_id').isInt(),
    body('reason').isString().notEmpty(),
    body('status').isIn(['pending', 'processed']),
    body('deleted_reason_id').optional().isInt()
]), (req, res) => {
    const { id } = req.params;
    const { user_id, reason, status, deleted_reason_id } = req.body;
    connection.query('UPDATE delete_requests SET user_id = ?, reason = ?, status = ?, deleted_reason_id = ? WHERE id = ?', [user_id, reason, status, deleted_reason_id, id], (err) => {
        if (err) return res.status(500).send(err);
        res.send({ id, user_id, reason, status, deleted_reason_id });
    });
});

app.delete('/delete_requests/:id', authenticateToken, validate([
    param('id').isInt()
]), (req, res) => {
    const { id } = req.params;
    connection.query('DELETE FROM delete_requests WHERE id = ?', [id], (err) => {
        if (err) return res.status(500).send(err);
        res.status(204).send();
    });
});

// CRUD operations for evidence
app.post('/evidence', authenticateToken, upload.single('file'), validate([
    body('report_id').isInt()
]), (req, res) => {
    const { report_id } = req.body;
    const file_path = req.file.path;
    connection.query('INSERT INTO evidence (report_id, file_path) VALUES (?, ?)', [report_id, file_path], (err, results) => {
        if (err) return res.status(500).send(err);
        res.status(201).send({ id: results.insertId, report_id, file_path });
    });
});

app.get('/evidence', (req, res) => {
    connection.query('SELECT * FROM evidence', (err, results) => {
        if (err) return res.status(500).send(err);
        res.send(results);
    });
});

app.get('/evidence/:id', validate([
    param('id').isInt()
]), (req, res) => {
    const { id } = req.params;
    connection.query('SELECT * FROM evidence WHERE id = ?', [id], (err, results) => {
        if (err) return res.status(500).send(err);
        if (results.length === 0) return res.status(404).send('Evidence not found');
        res.send(results[0]);
    });
});

app.put('/evidence/:id', authenticateToken, upload.single('file'), validate([
    param('id').isInt(),
    body('report_id').isInt()
]), (req, res) => {
    const { id } = req.params;
    const { report_id } = req.body;
    const file_path = req.file.path;
    connection.query('UPDATE evidence SET report_id = ?, file_path = ? WHERE id = ?', [report_id, file_path, id], (err) => {
        if (err) return res.status(500).send(err);
        res.send({ id, report_id, file_path });
    });
});

app.delete('/evidence/:id', authenticateToken, validate([
    param('id').isInt()
]), (req, res) => {
    const { id } = req.params;
    connection.query('DELETE FROM evidence WHERE id = ?', [id], (err) => {
        if (err) return res.status(500).send(err);
        res.status(204).send();
    });
});

// CRUD operations for invoices
app.post('/invoices', authenticateToken, upload.single('file'), validate([
    body('payment_id').isInt(),
    body('invoice_number').isString().notEmpty(),
    body('media_id').optional().isInt()
]), (req, res) => {
    const { payment_id, invoice_number, media_id } = req.body;
    const file_path = req.file.path;
    connection.query('INSERT INTO invoices (payment_id, invoice_number, file_path, media_id) VALUES (?, ?, ?, ?)', [payment_id, invoice_number, file_path, media_id], (err, results) => {
        if (err) return res.status(500).send(err);
        res.status(201).send({ id: results.insertId, payment_id, invoice_number, file_path, media_id });
    });
});

app.get('/invoices', (req, res) => {
    connection.query('SELECT * FROM invoices', (err, results) => {
        if (err) return res.status(500).send(err);
        res.send(results);
    });
});

app.get('/invoices/:id', validate([
    param('id').isInt()
]), (req, res) => {
    const { id } = req.params;
    connection.query('SELECT * FROM invoices WHERE id = ?', [id], (err, results) => {
        if (err) return res.status(500).send(err);
        if (results.length === 0) return res.status(404).send('Invoice not found');
        res.send(results[0]);
    });
});

app.put('/invoices/:id', authenticateToken, upload.single('file'), validate([
    param('id').isInt(),
    body('payment_id').isInt(),
    body('invoice_number').isString().notEmpty(),
    body('media_id').optional().isInt()
]), (req, res) => {
    const { id } = req.params;
    const { payment_id, invoice_number, media_id } = req.body;
    const file_path = req.file.path;
    connection.query('UPDATE invoices SET payment_id = ?, invoice_number = ?, file_path = ?, media_id = ? WHERE id = ?', [payment_id, invoice_number, file_path, media_id, id], (err) => {
        if (err) return res.status(500).send(err);
        res.send({ id, payment_id, invoice_number, file_path, media_id });
    });
});

app.delete('/invoices/:id', authenticateToken, validate([
    param('id').isInt()
]), (req, res) => {
    const { id } = req.params;
    connection.query('DELETE FROM invoices WHERE id = ?', [id], (err) => {
        if (err) return res.status(500).send(err);
        res.status(204).send();
    });
});

// CRUD operations for login_history
app.post('/login_history', authenticateToken, validate([
    body('user_id').isInt(),
    body('ip_address').isString().notEmpty(),
    body('user_agent').isString().notEmpty()
]), (req, res) => {
    const { user_id, ip_address, user_agent } = req.body;
    connection.query('INSERT INTO login_history (user_id, ip_address, user_agent) VALUES (?, ?, ?)', [user_id, ip_address, user_agent], (err, results) => {
        if (err) return res.status(500).send(err);
        res.status(201).send({ id: results.insertId, user_id, ip_address, user_agent });
    });
});

app.get('/login_history', (req, res) => {
    connection.query('SELECT * FROM login_history', (err, results) => {
        if (err) return res.status(500).send(err);
        res.send(results);
    });
});

app.get('/login_history/:id', validate([
    param('id').isInt()
]), (req, res) => {
    const { id } = req.params;
    connection.query('SELECT * FROM login_history WHERE id = ?', [id], (err, results) => {
        if (err) return res.status(500).send(err);
        if (results.length === 0) return res.status(404).send('Login history not found');
        res.send(results[0]);
    });
});

app.put('/login_history/:id', authenticateToken, validate([
    param('id').isInt(),
    body('user_id').isInt(),
    body('ip_address').isString().notEmpty(),
    body('user_agent').isString().notEmpty()
]), (req, res) => {
    const { id } = req.params;
    const { user_id, ip_address, user_agent } = req.body;
    connection.query('UPDATE login_history SET user_id = ?, ip_address = ?, user_agent = ? WHERE id = ?', [user_id, ip_address, user_agent, id], (err) => {
        if (err) return res.status(500).send(err);
        res.send({ id, user_id, ip_address, user_agent });
    });
});

app.delete('/login_history/:id', authenticateToken, validate([
    param('id').isInt()
]), (req, res) => {
    const { id } = req.params;
    connection.query('DELETE FROM login_history WHERE id = ?', [id], (err) => {
        if (err) return res.status(500).send(err);
        res.status(204).send();
    });
});

// CRUD operations for notifications
app.post('/notifications', authenticateToken, validate([
    body('user_id').isInt(),
    body('title').isString().notEmpty(),
    body('content').isString().notEmpty(),
    body('is_read').isBoolean()
]), (req, res) => {
    const { user_id, title, message, read_status } = req.body;
    connection.query('INSERT INTO notifications (user_id, title, message, read_status) VALUES (?, ?, ?, ?)', [user_id, title, message, read_status], (err, results) => {
        if (err) return res.status(500).send(err);
        res.status(201).send({ id: results.insertId, user_id, title, message, read_status });
    });
});

app.get('/notifications', (req, res) => {
    connection.query('SELECT * FROM notifications', (err, results) => {
        if (err) return res.status(500).send(err);
        res.send(results);
    });
});

app.get('/notifications/:id', validate([
    param('id').isInt()
]), (req, res) => {
    const { id } = req.params;
    connection.query('SELECT * FROM notifications WHERE id = ?', [id], (err, results) => {
        if (err) return res.status(500).send(err);
        if (results.length === 0) return res.status(404).send('Notification not found');
        res.send(results[0]);
    });
});

app.put('/notifications/:id', authenticateToken, validate([
    param('id').isInt(),
    body('user_id').isInt(),
    body('title').isString().notEmpty(),
    body('content').isString().notEmpty(),
    body('is_read').isBoolean()
]), (req, res) => {
    const { id } = req.params;
    const { user_id, title, message, read_status } = req.body;
    connection.query('UPDATE notifications SET user_id = ?, title = ?, message = ?, read_status = ? WHERE id = ?', [user_id, title, message, read_status, id], (err) => {
        if (err) return res.status(500).send(err);
        res.send({ id, user_id, title, message, read_status });
    });
});

app.delete('/notifications/:id', authenticateToken, validate([
    param('id').isInt()
]), (req, res) => {
    const { id } = req.params;
    connection.query('DELETE FROM notifications WHERE id = ?', [id], (err) => {
        if (err) return res.status(500).send(err);
        res.status(204).send();
    });
});

// CRUD operations for notification_templates
app.post('/notification_templates', authenticateToken, validate([
    body('name').isString().notEmpty(),
    body('content').isString().notEmpty()
]), (req, res) => {
    const { name, content } = req.body;
    connection.query('INSERT INTO notification_templates (name, content) VALUES (?, ?)', [name, content], (err, results) => {
        if (err) return res.status(500).send(err);
        res.status(201).send({ id: results.insertId, name, content });
    });
});

app.get('/notification_templates', (req, res) => {
    connection.query('SELECT * FROM notification_templates', (err, results) => {
        if (err) return res.status(500).send(err);
        res.send(results);
    });
});

app.get('/notification_templates/:id', validate([
    param('id').isInt()
]), (req, res) => {
    const { id } = req.params;
    connection.query('SELECT * FROM notification_templates WHERE id = ?', [id], (err, results) => {
        if (err) return res.status(500).send(err);
        if (results.length === 0) return res.status(404).send('Notification template not found');
        res.send(results[0]);
    });
});

app.put('/notification_templates/:id', authenticateToken, validate([
    param('id').isInt(),
    body('name').isString().notEmpty(),
    body('content').isString().notEmpty()
]), (req, res) => {
    const { id } = req.params;
    const { name, content } = req.body;
    connection.query('UPDATE notification_templates SET name = ?, content = ? WHERE id = ?', [name, content, id], (err) => {
        if (err) return res.status(500).send(err);
        res.send({ id, name, content });
    });
});

app.delete('/notification_templates/:id', authenticateToken, validate([
    param('id').isInt()
]), (req, res) => {
    const { id } = req.params;
    connection.query('DELETE FROM notification_templates WHERE id = ?', [id], (err) => {
        if (err) return res.status(500).send(err);
        res.status(204).send();
    });
});

// CRUD operations for payments
app.post('/payments', authenticateToken, validate([
    body('subscription_id').isInt(),
    body('amount').isFloat({ gt: 0 }),
    body('payment_method').isIn(['credit_card', 'paypal', 'bank_transfer']),
    body('transaction_id').isString().notEmpty(),
    body('status').isIn(['success', 'failed', 'pending'])
]), (req, res) => {
    const { user_id, amount, status } = req.body;
    connection.query('INSERT INTO payments (user_id, amount, status) VALUES (?, ?, ?)', [user_id, amount, status], (err, results) => {
        if (err) return res.status(500).send(err);
        res.status(201).send({ id: results.insertId, user_id, amount, status });
    });
});

app.get('/payments', (req, res) => {
    connection.query('SELECT * FROM payments', (err, results) => {
        if (err) return res.status(500).send(err);
        res.send(results);
    });
});

app.get('/payments/:id', validate([
    param('id').isInt()
]), (req, res) => {
    const { id } = req.params;
    connection.query('SELECT * FROM payments WHERE id = ?', [id], (err, results) => {
        if (err) return res.status(500).send(err);
        if (results.length === 0) return res.status(404).send('Payment not found');
        res.send(results[0]);
    });
});

app.put('/payments/:id', authenticateToken, validate([
    param('id').isInt(),
    body('subscription_id').isInt(),
    body('amount').isFloat({ gt: 0 }),
    body('payment_method').isIn(['credit_card', 'paypal', 'bank_transfer']),
    body('transaction_id').isString().notEmpty(),
    body('status').isIn(['success', 'failed', 'pending'])
]), (req, res) => {
    const { id } = req.params;
    const { user_id, amount, status } = req.body;
    connection.query('UPDATE payments SET user_id = ?, amount = ?, status = ? WHERE id = ?', [user_id, amount, status, id], (err) => {
        if (err) return res.status(500).send(err);
        res.send({ id, user_id, amount, status });
    });
});

app.delete('/payments/:id', authenticateToken, validate([
    param('id').isInt()
]), (req, res) => {
    const { id } = req.params;
    connection.query('DELETE FROM payments WHERE id = ?', [id], (err) => {
        if (err) return res.status(500).send(err);
        res.status(204).send();
    });
});

// CRUD operations for permissions
app.post('/permissions', authenticateToken, validate([
    body('role_id').isInt(),
    body('module').isString().notEmpty(),
    body('can_view').isBoolean(),
    body('can_edit').isBoolean(),
    body('can_delete').isBoolean()
]), (req, res) => {
    const { name, description } = req.body;
    connection.query('INSERT INTO permissions (name, description) VALUES (?, ?)', [name, description], (err, results) => {
        if (err) return res.status(500).send(err);
        res.status(201).send({ id: results.insertId, name, description });
    });
});

app.get('/permissions', (req, res) => {
    connection.query('SELECT * FROM permissions', (err, results) => {
        if (err) return res.status(500).send(err);
        res.send(results);
    });
});

app.get('/permissions/:id', validate([
    param('id').isInt()
]), (req, res) => {
    const { id } = req.params;
    connection.query('SELECT * FROM permissions WHERE id = ?', [id], (err, results) => {
        if (err) return res.status(500).send(err);
        if (results.length === 0) return res.status(404).send('Permission not found');
        res.send(results[0]);
    });
});

app.put('/permissions/:id', authenticateToken, validate([
    param('id').isInt(),
    body('role_id').isInt(),
    body('module').isString().notEmpty(),
    body('can_view').isBoolean(),
    body('can_edit').isBoolean(),
    body('can_delete').isBoolean()
]), (req, res) => {
    const { id } = req.params;
    const { name, description } = req.body;
    connection.query('UPDATE permissions SET name = ?, description = ? WHERE id = ?', [name, description, id], (err) => {
        if (err) return res.status(500).send(err);
        res.send({ id, name, description });
    });
});

app.delete('/permissions/:id', authenticateToken, validate([
    param('id').isInt()
]), (req, res) => {
    const { id } = req.params;
    connection.query('DELETE FROM permissions WHERE id = ?', [id], (err) => {
        if (err) return res.status(500).send(err);
        res.status(204).send();
    });
});

// CRUD operations for plans
app.post('/plans', authenticateToken, validate([
    body('name').isString().notEmpty(),
    body('price').isFloat({ gt: 0 }),
    body('description').optional().isString()
]), (req, res) => {
    const { name, description, price } = req.body;
    connection.query('INSERT INTO plans (name, description, price) VALUES (?, ?, ?)', [name, description, price], (err, results) => {
        if (err) return res.status(500).send(err);
        res.status(201).send({ id: results.insertId, name, description, price });
    });
});

app.get('/plans', (req, res) => {
    connection.query('SELECT * FROM plans', (err, results) => {
        if (err) return res.status(500).send(err);
        res.send(results);
    });
});

app.get('/plans/:id', validate([
    param('id').isInt()
]), (req, res) => {
    const { id } = req.params;
    connection.query('SELECT * FROM plans WHERE id = ?', [id], (err, results) => {
        if (err) return res.status(500).send(err);
        if (results.length === 0) return res.status(404).send('Plan not found');
        res.send(results[0]);
    });
});

app.put('/plans/:id', authenticateToken, validate([
    param('id').isInt(),
    body('name').isString().notEmpty(),
    body('price').isFloat({ gt: 0 }),
    body('description').optional().isString()
]), (req, res) => {
    const { id } = req.params;
    const { name, description, price } = req.body;
    connection.query('UPDATE plans SET name = ?, description = ?, price = ? WHERE id = ?', [name, description, price, id], (err) => {
        if (err) return res.status(500).send(err);
        res.send({ id, name, description, price });
    });
});

app.delete('/plans/:id', authenticateToken, validate([
    param('id').isInt()
]), (req, res) => {
    const { id } = req.params;
    connection.query('DELETE FROM plans WHERE id = ?', [id], (err) => {
        if (err) return res.status(500).send(err);
        res.status(204).send();
    });
});

// CRUD operations for media
app.post('/media', authenticateToken, upload.single('file'), (req, res) => {
    const { file } = req;
    const filePath = file.path;
    const fileType = file.mimetype;
    connection.query('INSERT INTO media (file_path, file_type) VALUES (?, ?)', [filePath, fileType], (err, results) => {
        if (err) return res.status(500).send(err);
        res.status(201).send({ id: results.insertId, file_path: filePath, file_type: fileType });
    });
});

app.get('/media', (req, res) => {
    connection.query('SELECT * FROM media', (err, results) => {
        if (err) return res.status(500).send(err);
        res.send(results);
    });
});

app.get('/media/:id', validate([
    param('id').isInt()
]), (req, res) => {
    const { id } = req.params;
    connection.query('SELECT * FROM media WHERE id = ?', [id], (err, results) => {
        if (err) return res.status(500).send(err);
        if (results.length === 0) return res.status(404).send('Media not found');
        res.send(results[0]);
    });
});

app.put('/media/:id', authenticateToken, validate([
    param('id').isInt(),
    body('file_path').isString().notEmpty(),
    body('file_type').isString().notEmpty()
]), (req, res) => {
    const { id } = req.params;
    const { file_path, file_type } = req.body;
    connection.query('UPDATE media SET file_path = ?, file_type = ? WHERE id = ?', [file_path, file_type, id], (err) => {
        if (err) return res.status(500).send(err);
        res.send({ id, file_path, file_type });
    });
});

app.delete('/media/:id', authenticateToken, validate([
    param('id').isInt()
]), (req, res) => {
    const { id } = req.params;
    connection.query('DELETE FROM media WHERE id = ?', [id], (err) => {
        if (err) return res.status(500).send(err);
        res.status(204).send();
    });
});

// CRUD operations for reports
app.post('/reports', authenticateToken, upload.single('file'), validate([
    body('user_id').isInt(),
    body('title').isString().notEmpty(),
    body('description').isString().notEmpty(),
    body('category_id').isInt(),
    body('city_id').isInt(),
    body('status').isIn(['pending', 'validated', 'rejected']),
    body('media_id').optional().isInt()
]), (req, res) => {
    const { user_id, title, description, category_id, city_id, status, media_id } = req.body;
    const file_path = req.file.path;
    connection.query('INSERT INTO reports (user_id, title, description, category_id, city_id, status, media_id, file_path) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', [user_id, title, description, category_id, city_id, status, media_id, file_path], (err, results) => {
        if (err) return res.status(500).send(err);
        res.status(201).send({ id: results.insertId, user_id, title, description, category_id, city_id, status, media_id, file_path });
    });
});

app.put('/reports/:id', authenticateToken, upload.single('file'), validate([
    param('id').isInt(),
    body('user_id').isInt(),
    body('title').isString().notEmpty(),
    body('description').isString().notEmpty(),
    body('category_id').isInt(),
    body('city_id').isInt(),
    body('status').isIn(['pending', 'validated', 'rejected']),
    body('media_id').optional().isInt()
]), (req, res) => {
    const { id } = req.params;
    const { user_id, title, description, category_id, city_id, status, media_id } = req.body;
    const file_path = req.file.path;
    connection.query('UPDATE reports SET user_id = ?, title = ?, description = ?, category_id = ?, city_id = ?, status = ?, media_id = ?, file_path = ? WHERE id = ?', [user_id, title, description, category_id, city_id, status, media_id, file_path, id], (err) => {
        if (err) return res.status(500).send(err);
        res.send({ id, user_id, title, description, category_id, city_id, status, media_id, file_path });
    });
});

app.get('/reports', (req, res) => {
    connection.query('SELECT * FROM reports', (err, results) => {
        if (err) return res.status(500).send(err);
        res.send(results);
    });
});

app.get('/reports/:id', validate([
    param('id').isInt()
]), (req, res) => {
    const { id } = req.params;
    connection.query('SELECT * FROM reports WHERE id = ?', [id], (err, results) => {
        if (err) return res.status(500).send(err);
        if (results.length === 0) return res.status(404).send('Report not found');
        res.send(results[0]);
    });
});

app.delete('/reports/:id', authenticateToken, validate([
    param('id').isInt()
]), (req, res) => {
    const { id } = req.params;
    connection.query('DELETE FROM reports WHERE id = ?', [id], (err) => {
        if (err) return res.status(500).send(err);
        res.status(204).send();
    });
});


// Start the server
const port = 3000;
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
