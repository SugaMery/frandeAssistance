-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1
-- Généré le : ven. 07 fév. 2025 à 18:32
-- Version du serveur : 10.4.32-MariaDB
-- Version de PHP : 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `assistancefraudedb`
--

-- --------------------------------------------------------

--
-- Structure de la table `categories`
--

CREATE TABLE `categories` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `slug` varchar(100) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `media_id` int(11) DEFAULT NULL,
  `description` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `categories`
--

INSERT INTO `categories` (`id`, `name`, `slug`, `created_at`, `updated_at`, `media_id`, `description`) VALUES
(23, 'Applications', 'applications', '2025-02-04 10:32:11', '2025-02-04 16:21:30', 23, 'Plateforme pour le développement et la gestion d\'applications mobiles et desktop.'),
(24, 'Sites Web', 'sites-web', '2025-02-04 10:34:12', '2025-02-04 16:21:30', 24, 'Création, hébergement et gestion de sites web professionnels et personnels.'),
(25, 'Téléphones', 'telephones', '2025-02-04 10:38:21', '2025-02-04 16:21:30', 25, 'Vente et réparation de téléphones mobiles et accessoires.'),
(26, 'Entreprises', 'entreprises', '2025-02-04 10:39:35', '2025-02-04 16:21:30', 26, 'Services et conseils pour les entreprises et entrepreneurs.'),
(27, 'Cartes Bancaires', 'cartes-bancaires', '2025-02-04 10:41:10', '2025-02-04 16:21:30', 27, 'Solutions et informations sur les cartes bancaires et services financiers.'),
(28, 'Réseaux Sociaux', 'reseaux-sociaux', '2025-02-04 10:42:26', '2025-02-04 16:21:30', 28, 'Gestion et optimisation des comptes sur les réseaux sociaux.');

-- --------------------------------------------------------

--
-- Structure de la table `chatbot_messages`
--

CREATE TABLE `chatbot_messages` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `message` text NOT NULL,
  `response` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `cities`
--

CREATE TABLE `cities` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `postal_code` varchar(10) NOT NULL,
  `country` varchar(50) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `cities`
--

INSERT INTO `cities` (`id`, `name`, `postal_code`, `country`, `created_at`, `updated_at`) VALUES
(1, 'Paris', '75000', 'France', '2025-02-05 08:04:46', '2025-02-05 08:04:46'),
(2, 'Marseille', '13000', 'France', '2025-02-05 08:04:46', '2025-02-05 08:04:46'),
(3, 'Lyon', '69000', 'France', '2025-02-05 08:04:46', '2025-02-05 08:04:46'),
(4, 'Toulouse', '31000', 'France', '2025-02-05 08:04:46', '2025-02-05 08:04:46'),
(5, 'Nice', '06000', 'France', '2025-02-05 08:04:46', '2025-02-05 08:04:46'),
(6, 'Nantes', '44000', 'France', '2025-02-05 08:04:46', '2025-02-05 08:04:46'),
(7, 'Strasbourg', '67000', 'France', '2025-02-05 08:04:46', '2025-02-05 08:04:46'),
(8, 'Montpellier', '34000', 'France', '2025-02-05 08:04:46', '2025-02-05 08:04:46'),
(9, 'Bordeaux', '33000', 'France', '2025-02-05 08:04:46', '2025-02-05 08:04:46'),
(10, 'Lille', '59000', 'France', '2025-02-05 08:04:46', '2025-02-05 08:04:46'),
(11, 'Rennes', '35000', 'France', '2025-02-05 08:04:46', '2025-02-05 08:04:46'),
(12, 'Reims', '51100', 'France', '2025-02-05 08:04:46', '2025-02-05 08:04:46'),
(13, 'Le Havre', '76600', 'France', '2025-02-05 08:04:46', '2025-02-05 08:04:46'),
(14, 'Saint-Étienne', '42000', 'France', '2025-02-05 08:04:46', '2025-02-05 08:04:46'),
(15, 'Toulon', '83000', 'France', '2025-02-05 08:04:46', '2025-02-05 08:04:46'),
(16, 'Grenoble', '38000', 'France', '2025-02-05 08:04:46', '2025-02-05 08:04:46'),
(17, 'Dijon', '21000', 'France', '2025-02-05 08:04:46', '2025-02-05 08:04:46'),
(18, 'Angers', '49000', 'France', '2025-02-05 08:04:46', '2025-02-05 08:04:46'),
(19, 'Nîmes', '30000', 'France', '2025-02-05 08:04:46', '2025-02-05 08:04:46'),
(20, 'Villeurbanne', '69100', 'France', '2025-02-05 08:04:46', '2025-02-05 08:04:46'),
(21, 'Clermont-Ferrand', '63000', 'France', '2025-02-05 08:04:46', '2025-02-05 08:04:46'),
(22, 'Le Mans', '72000', 'France', '2025-02-05 08:04:46', '2025-02-05 08:04:46'),
(23, 'Aix-en-Provence', '13090', 'France', '2025-02-05 08:04:46', '2025-02-05 08:04:46'),
(24, 'Brest', '29200', 'France', '2025-02-05 08:04:46', '2025-02-05 08:04:46'),
(25, 'Tours', '37000', 'France', '2025-02-05 08:04:46', '2025-02-05 08:04:46'),
(26, 'Amiens', '80000', 'France', '2025-02-05 08:04:46', '2025-02-05 08:04:46'),
(27, 'Limoges', '87000', 'France', '2025-02-05 08:04:46', '2025-02-05 08:04:46'),
(28, 'Annecy', '74000', 'France', '2025-02-05 08:04:46', '2025-02-05 08:04:46'),
(29, 'Perpignan', '66000', 'France', '2025-02-05 08:04:46', '2025-02-05 08:04:46'),
(30, 'Besançon', '25000', 'France', '2025-02-05 08:04:46', '2025-02-05 08:04:46'),
(31, 'Metz', '57000', 'France', '2025-02-05 08:04:46', '2025-02-05 08:04:46'),
(32, 'Orléans', '45000', 'France', '2025-02-05 08:04:46', '2025-02-05 08:04:46'),
(33, 'Boulogne-Billancourt', '92100', 'France', '2025-02-05 08:04:46', '2025-02-05 08:04:46'),
(34, 'Mulhouse', '68100', 'France', '2025-02-05 08:04:46', '2025-02-05 08:04:46'),
(35, 'Rouen', '76000', 'France', '2025-02-05 08:04:46', '2025-02-05 08:04:46'),
(36, 'Caen', '14000', 'France', '2025-02-05 08:04:46', '2025-02-05 08:04:46'),
(37, 'Nancy', '54000', 'France', '2025-02-05 08:04:46', '2025-02-05 08:04:46'),
(38, 'Argenteuil', '95100', 'France', '2025-02-05 08:04:46', '2025-02-05 08:04:46'),
(39, 'Saint-Denis', '93200', 'France', '2025-02-05 08:04:46', '2025-02-05 08:04:46'),
(40, 'Roubaix', '59100', 'France', '2025-02-05 08:04:46', '2025-02-05 08:04:46'),
(41, 'Avignon', '84000', 'France', '2025-02-05 08:04:46', '2025-02-05 08:04:46'),
(42, 'Nanterre', '92000', 'France', '2025-02-05 08:04:46', '2025-02-05 08:04:46'),
(43, 'Poitiers', '86000', 'France', '2025-02-05 08:04:46', '2025-02-05 08:04:46'),
(44, 'Créteil', '94000', 'France', '2025-02-05 08:04:46', '2025-02-05 08:04:46'),
(45, 'Dunkerque', '59140', 'France', '2025-02-05 08:04:46', '2025-02-05 08:04:46'),
(46, 'Versailles', '78000', 'France', '2025-02-05 08:04:46', '2025-02-05 08:04:46'),
(47, 'Pau', '64000', 'France', '2025-02-05 08:04:46', '2025-02-05 08:04:46'),
(48, 'Colombes', '92700', 'France', '2025-02-05 08:04:46', '2025-02-05 08:04:46'),
(49, 'La Rochelle', '17000', 'France', '2025-02-05 08:04:46', '2025-02-05 08:04:46'),
(50, 'Saint-Maur-des-Fossés', '94100', 'France', '2025-02-05 08:04:46', '2025-02-05 08:04:46'),
(51, 'Champigny-sur-Marne', '94500', 'France', '2025-02-05 08:05:10', '2025-02-05 08:05:10'),
(52, 'Aubervilliers', '93300', 'France', '2025-02-05 08:05:10', '2025-02-05 08:05:10'),
(53, 'Béziers', '34500', 'France', '2025-02-05 08:05:10', '2025-02-05 08:05:10'),
(54, 'La Seyne-sur-Mer', '83500', 'France', '2025-02-05 08:05:10', '2025-02-05 08:05:10'),
(55, 'Cannes', '06400', 'France', '2025-02-05 08:05:10', '2025-02-05 08:05:10'),
(56, 'Antibes', '06600', 'France', '2025-02-05 08:05:10', '2025-02-05 08:05:10'),
(57, 'Calais', '62100', 'France', '2025-02-05 08:05:10', '2025-02-05 08:05:10'),
(58, 'Saint-Nazaire', '44600', 'France', '2025-02-05 08:05:10', '2025-02-05 08:05:10'),
(59, 'Drancy', '93700', 'France', '2025-02-05 08:05:10', '2025-02-05 08:05:10'),
(60, 'Mérignac', '33700', 'France', '2025-02-05 08:05:10', '2025-02-05 08:05:10'),
(61, 'Colmar', '68000', 'France', '2025-02-05 08:05:10', '2025-02-05 08:05:10'),
(62, 'Ajaccio', '20000', 'France', '2025-02-05 08:05:10', '2025-02-05 08:05:10'),
(63, 'Bourges', '18000', 'France', '2025-02-05 08:05:10', '2025-02-05 08:05:10'),
(64, 'Issy-les-Moulineaux', '92130', 'France', '2025-02-05 08:05:10', '2025-02-05 08:05:10'),
(65, 'Levallois-Perret', '92300', 'France', '2025-02-05 08:05:10', '2025-02-05 08:05:10'),
(66, 'Valence', '26000', 'France', '2025-02-05 08:05:10', '2025-02-05 08:05:10'),
(67, 'Quimper', '29000', 'France', '2025-02-05 08:05:10', '2025-02-05 08:05:10'),
(68, 'Noisy-le-Grand', '93160', 'France', '2025-02-05 08:05:10', '2025-02-05 08:05:10'),
(69, 'Villeneuve-d’Ascq', '59650', 'France', '2025-02-05 08:05:10', '2025-02-05 08:05:10'),
(70, 'Vénissieux', '69200', 'France', '2025-02-05 08:05:10', '2025-02-05 08:05:10'),
(71, 'Cergy', '95000', 'France', '2025-02-05 08:05:10', '2025-02-05 08:05:10'),
(72, 'Pessac', '33600', 'France', '2025-02-05 08:05:10', '2025-02-05 08:05:10'),
(73, 'Troyes', '10000', 'France', '2025-02-05 08:05:10', '2025-02-05 08:05:10'),
(74, 'Rueil-Malmaison', '92500', 'France', '2025-02-05 08:05:10', '2025-02-05 08:05:10'),
(75, 'Antony', '92160', 'France', '2025-02-05 08:05:10', '2025-02-05 08:05:10'),
(76, 'La Roche-sur-Yon', '85000', 'France', '2025-02-05 08:05:10', '2025-02-05 08:05:10'),
(77, 'Lorient', '56100', 'France', '2025-02-05 08:05:10', '2025-02-05 08:05:10'),
(78, 'Chambéry', '73000', 'France', '2025-02-05 08:05:10', '2025-02-05 08:05:10'),
(79, 'Niort', '79000', 'France', '2025-02-05 08:05:10', '2025-02-05 08:05:10'),
(80, 'Sarcelles', '95200', 'France', '2025-02-05 08:05:10', '2025-02-05 08:05:10'),
(81, 'Évreux', '27000', 'France', '2025-02-05 08:05:10', '2025-02-05 08:05:10'),
(82, 'Saint-Quentin', '02100', 'France', '2025-02-05 08:05:10', '2025-02-05 08:05:10'),
(83, 'Vannes', '56000', 'France', '2025-02-05 08:05:10', '2025-02-05 08:05:10'),
(84, 'Cholet', '49300', 'France', '2025-02-05 08:05:10', '2025-02-05 08:05:10'),
(85, 'Bondy', '93140', 'France', '2025-02-05 08:05:10', '2025-02-05 08:05:10'),
(86, 'Saint-Ouen-sur-Seine', '93400', 'France', '2025-02-05 08:05:10', '2025-02-05 08:05:10'),
(87, 'Fréjus', '83600', 'France', '2025-02-05 08:05:10', '2025-02-05 08:05:10'),
(88, 'Clamart', '92140', 'France', '2025-02-05 08:05:10', '2025-02-05 08:05:10'),
(89, 'Meaux', '77100', 'France', '2025-02-05 08:05:10', '2025-02-05 08:05:10'),
(90, 'Narbonne', '11100', 'France', '2025-02-05 08:05:10', '2025-02-05 08:05:10'),
(91, 'Bastia', '20200', 'France', '2025-02-05 08:05:10', '2025-02-05 08:05:10'),
(92, 'Chelles', '77500', 'France', '2025-02-05 08:05:10', '2025-02-05 08:05:10'),
(93, 'Castres', '81100', 'France', '2025-02-05 08:05:10', '2025-02-05 08:05:10'),
(94, 'Montélimar', '26200', 'France', '2025-02-05 08:05:10', '2025-02-05 08:05:10'),
(95, 'Bagneux', '92220', 'France', '2025-02-05 08:05:10', '2025-02-05 08:05:10'),
(96, 'Suresnes', '92150', 'France', '2025-02-05 08:05:10', '2025-02-05 08:05:10'),
(97, 'Le Blanc-Mesnil', '93150', 'France', '2025-02-05 08:05:10', '2025-02-05 08:05:10'),
(98, 'Massy', '91300', 'France', '2025-02-05 08:05:10', '2025-02-05 08:05:10'),
(99, 'Albi', '81000', 'France', '2025-02-05 08:05:10', '2025-02-05 08:05:10'),
(100, 'Grasse', '06130', 'France', '2025-02-05 08:05:10', '2025-02-05 08:05:10');

-- --------------------------------------------------------

--
-- Structure de la table `comments`
--

CREATE TABLE `comments` (
  `id` int(11) NOT NULL,
  `report_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `content` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `data_exports`
--

CREATE TABLE `data_exports` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `file_path` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `deleted_reasons`
--

CREATE TABLE `deleted_reasons` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `slug` varchar(100) NOT NULL,
  `long_name` varchar(255) NOT NULL,
  `type` varchar(50) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `delete_requests`
--

CREATE TABLE `delete_requests` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `reason` text NOT NULL,
  `status` enum('pending','processed') DEFAULT 'pending',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `deleted_reason_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `evidence`
--

CREATE TABLE `evidence` (
  `id` int(11) NOT NULL,
  `report_id` int(11) NOT NULL,
  `file_path` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `invoices`
--

CREATE TABLE `invoices` (
  `id` int(11) NOT NULL,
  `payment_id` int(11) NOT NULL,
  `invoice_number` varchar(100) NOT NULL,
  `file_path` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `deleted_reason_id` int(11) DEFAULT NULL,
  `media_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `login_history`
--

CREATE TABLE `login_history` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `ip_address` varchar(50) NOT NULL,
  `user_agent` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `media`
--

CREATE TABLE `media` (
  `id` int(11) NOT NULL,
  `file_path` varchar(255) NOT NULL,
  `file_type` varchar(50) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `media`
--

INSERT INTO `media` (`id`, `file_path`, `file_type`, `created_at`, `updated_at`) VALUES
(23, 'http://localhost:3000/uploads/1738665131207-securite (1).png', 'image/png', '2025-02-04 10:32:11', '2025-02-04 10:32:11'),
(24, 'http://localhost:3000/uploads/1738665252773-world-wide-web.png', 'image/png', '2025-02-04 10:34:12', '2025-02-04 10:34:12'),
(25, 'http://localhost:3000/uploads/1738665501484-telephoner (1).png', 'image/png', '2025-02-04 10:38:21', '2025-02-04 10:38:21'),
(26, 'http://localhost:3000/uploads/1738665575253-mon-entreprise.png', 'image/png', '2025-02-04 10:39:35', '2025-02-04 10:39:35'),
(27, 'http://localhost:3000/uploads/1738665670875-carte-bancaire.png', 'image/png', '2025-02-04 10:41:10', '2025-02-04 10:41:10'),
(28, 'http://localhost:3000/uploads/1738665746228-reseaux-sociaux.png', 'image/png', '2025-02-04 10:42:26', '2025-02-04 10:42:26');

-- --------------------------------------------------------

--
-- Structure de la table `notifications`
--

CREATE TABLE `notifications` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `content` text NOT NULL,
  `is_read` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `notification_templates`
--

CREATE TABLE `notification_templates` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `content` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `payments`
--

CREATE TABLE `payments` (
  `id` int(11) NOT NULL,
  `subscription_id` int(11) NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `payment_method` enum('credit_card','paypal','bank_transfer') NOT NULL,
  `transaction_id` varchar(100) NOT NULL,
  `status` enum('success','failed','pending') DEFAULT 'pending',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `deleted_reason_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `permissions`
--

CREATE TABLE `permissions` (
  `id` int(11) NOT NULL,
  `role_id` int(11) NOT NULL,
  `module` varchar(100) NOT NULL,
  `can_view` tinyint(1) DEFAULT 0,
  `can_edit` tinyint(1) DEFAULT 0,
  `can_delete` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `plans`
--

CREATE TABLE `plans` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `reports`
--

CREATE TABLE `reports` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `category_id` int(11) NOT NULL,
  `city_id` int(11) NOT NULL,
  `status` enum('pending','validated','rejected') DEFAULT 'pending',
  `image_path` varchar(255) DEFAULT NULL,
  `allow_image_upload` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `media_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `report_statistics`
--

CREATE TABLE `report_statistics` (
  `id` int(11) NOT NULL,
  `total_reports` int(11) DEFAULT 0,
  `validated_reports` int(11) DEFAULT 0,
  `rejected_reports` int(11) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `reviews`
--

CREATE TABLE `reviews` (
  `id` int(11) NOT NULL,
  `report_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `rating` int(11) DEFAULT NULL CHECK (`rating` between 1 and 5),
  `comment` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `roles`
--

CREATE TABLE `roles` (
  `id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `slug` varchar(50) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `roles`
--

INSERT INTO `roles` (`id`, `name`, `slug`, `created_at`, `updated_at`) VALUES
(1, 'Super Admin', 'suadmin', '2025-02-03 16:13:21', '2025-02-03 16:13:21');

-- --------------------------------------------------------

--
-- Structure de la table `secondary_accounts`
--

CREATE TABLE `secondary_accounts` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `first_name` varchar(50) NOT NULL,
  `last_name` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `deleted_reason_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `subscriptions`
--

CREATE TABLE `subscriptions` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `plan_id` int(11) NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `status` enum('active','inactive','suspended') DEFAULT 'active',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `deleted_reason_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `suspicious_ips`
--

CREATE TABLE `suspicious_ips` (
  `id` int(11) NOT NULL,
  `ip_address` varchar(50) NOT NULL,
  `reason` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `uuid` varchar(50) NOT NULL,
  `username` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `first_name` varchar(50) NOT NULL,
  `last_name` varchar(50) NOT NULL,
  `phone_number` varchar(20) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `postal_code` varchar(10) DEFAULT NULL,
  `city` varchar(100) DEFAULT NULL,
  `role_id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `deleted_at` timestamp NULL DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `deleted_reason_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `users`
--

INSERT INTO `users` (`id`, `uuid`, `username`, `email`, `password`, `first_name`, `last_name`, `phone_number`, `address`, `postal_code`, `city`, `role_id`, `created_at`, `updated_at`, `deleted_at`, `is_active`, `deleted_reason_id`) VALUES
(3, 'afa6f074-e24a-11ef-9ee1-f854f664ad2e', 'testuser', 'testuser@example.com', '$2b$10$zq6Tnvwgr4ZSBxdbiEAH1uXzzXQlvyJXXV9.GsAONQPBd4iEEcKWO', 'Test', 'User', NULL, NULL, NULL, NULL, 1, '2025-02-03 16:19:47', '2025-02-03 16:19:47', NULL, 1, NULL),
(5, '7a2e77b1-e255-11ef-9ee1-f854f664ad2e', 'bmatryam@ept.sn', 'john.doe@example.com', '$2b$10$q.UD7xLRQd44EOqX.2FQyu/pbQC1k5BNGfq3ouIKk2144jNKhlO6a', 'Mariam', 'Bril', '0661327755', 'Marrakech', '4000', 'Marrakech', 1, '2025-02-03 17:37:02', '2025-02-03 17:37:02', NULL, 1, NULL);

-- --------------------------------------------------------

--
-- Structure de la table `user_statistics`
--

CREATE TABLE `user_statistics` (
  `id` int(11) NOT NULL,
  `total_users` int(11) DEFAULT 0,
  `active_users` int(11) DEFAULT 0,
  `inactive_users` int(11) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`),
  ADD KEY `media_id` (`media_id`);

--
-- Index pour la table `chatbot_messages`
--
ALTER TABLE `chatbot_messages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Index pour la table `cities`
--
ALTER TABLE `cities`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `comments`
--
ALTER TABLE `comments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `report_id` (`report_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Index pour la table `data_exports`
--
ALTER TABLE `data_exports`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Index pour la table `deleted_reasons`
--
ALTER TABLE `deleted_reasons`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `delete_requests`
--
ALTER TABLE `delete_requests`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `deleted_reason_id` (`deleted_reason_id`);

--
-- Index pour la table `evidence`
--
ALTER TABLE `evidence`
  ADD PRIMARY KEY (`id`),
  ADD KEY `report_id` (`report_id`);

--
-- Index pour la table `invoices`
--
ALTER TABLE `invoices`
  ADD PRIMARY KEY (`id`),
  ADD KEY `payment_id` (`payment_id`),
  ADD KEY `deleted_reason_id` (`deleted_reason_id`),
  ADD KEY `media_id` (`media_id`);

--
-- Index pour la table `login_history`
--
ALTER TABLE `login_history`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Index pour la table `media`
--
ALTER TABLE `media`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Index pour la table `notification_templates`
--
ALTER TABLE `notification_templates`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `payments`
--
ALTER TABLE `payments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `subscription_id` (`subscription_id`),
  ADD KEY `deleted_reason_id` (`deleted_reason_id`);

--
-- Index pour la table `permissions`
--
ALTER TABLE `permissions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `role_id` (`role_id`);

--
-- Index pour la table `plans`
--
ALTER TABLE `plans`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `reports`
--
ALTER TABLE `reports`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `category_id` (`category_id`),
  ADD KEY `city_id` (`city_id`),
  ADD KEY `media_id` (`media_id`);

--
-- Index pour la table `report_statistics`
--
ALTER TABLE `report_statistics`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `reviews`
--
ALTER TABLE `reviews`
  ADD PRIMARY KEY (`id`),
  ADD KEY `report_id` (`report_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Index pour la table `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `secondary_accounts`
--
ALTER TABLE `secondary_accounts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `deleted_reason_id` (`deleted_reason_id`);

--
-- Index pour la table `subscriptions`
--
ALTER TABLE `subscriptions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `plan_id` (`plan_id`),
  ADD KEY `deleted_reason_id` (`deleted_reason_id`);

--
-- Index pour la table `suspicious_ips`
--
ALTER TABLE `suspicious_ips`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uuid` (`uuid`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `role_id` (`role_id`),
  ADD KEY `deleted_reason_id` (`deleted_reason_id`);

--
-- Index pour la table `user_statistics`
--
ALTER TABLE `user_statistics`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=29;

--
-- AUTO_INCREMENT pour la table `chatbot_messages`
--
ALTER TABLE `chatbot_messages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `cities`
--
ALTER TABLE `cities`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=101;

--
-- AUTO_INCREMENT pour la table `comments`
--
ALTER TABLE `comments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `data_exports`
--
ALTER TABLE `data_exports`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `deleted_reasons`
--
ALTER TABLE `deleted_reasons`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `delete_requests`
--
ALTER TABLE `delete_requests`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `evidence`
--
ALTER TABLE `evidence`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `invoices`
--
ALTER TABLE `invoices`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `login_history`
--
ALTER TABLE `login_history`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `media`
--
ALTER TABLE `media`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=29;

--
-- AUTO_INCREMENT pour la table `notifications`
--
ALTER TABLE `notifications`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `notification_templates`
--
ALTER TABLE `notification_templates`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `payments`
--
ALTER TABLE `payments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `permissions`
--
ALTER TABLE `permissions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `plans`
--
ALTER TABLE `plans`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `reports`
--
ALTER TABLE `reports`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `report_statistics`
--
ALTER TABLE `report_statistics`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `reviews`
--
ALTER TABLE `reviews`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `roles`
--
ALTER TABLE `roles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT pour la table `secondary_accounts`
--
ALTER TABLE `secondary_accounts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `subscriptions`
--
ALTER TABLE `subscriptions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `suspicious_ips`
--
ALTER TABLE `suspicious_ips`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT pour la table `user_statistics`
--
ALTER TABLE `user_statistics`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `categories`
--
ALTER TABLE `categories`
  ADD CONSTRAINT `categories_ibfk_1` FOREIGN KEY (`media_id`) REFERENCES `media` (`id`);

--
-- Contraintes pour la table `chatbot_messages`
--
ALTER TABLE `chatbot_messages`
  ADD CONSTRAINT `chatbot_messages_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Contraintes pour la table `comments`
--
ALTER TABLE `comments`
  ADD CONSTRAINT `comments_ibfk_1` FOREIGN KEY (`report_id`) REFERENCES `reports` (`id`),
  ADD CONSTRAINT `comments_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Contraintes pour la table `data_exports`
--
ALTER TABLE `data_exports`
  ADD CONSTRAINT `data_exports_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Contraintes pour la table `delete_requests`
--
ALTER TABLE `delete_requests`
  ADD CONSTRAINT `delete_requests_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `delete_requests_ibfk_2` FOREIGN KEY (`deleted_reason_id`) REFERENCES `deleted_reasons` (`id`);

--
-- Contraintes pour la table `evidence`
--
ALTER TABLE `evidence`
  ADD CONSTRAINT `evidence_ibfk_1` FOREIGN KEY (`report_id`) REFERENCES `reports` (`id`);

--
-- Contraintes pour la table `invoices`
--
ALTER TABLE `invoices`
  ADD CONSTRAINT `invoices_ibfk_1` FOREIGN KEY (`payment_id`) REFERENCES `payments` (`id`),
  ADD CONSTRAINT `invoices_ibfk_2` FOREIGN KEY (`deleted_reason_id`) REFERENCES `deleted_reasons` (`id`),
  ADD CONSTRAINT `invoices_ibfk_3` FOREIGN KEY (`media_id`) REFERENCES `media` (`id`);

--
-- Contraintes pour la table `login_history`
--
ALTER TABLE `login_history`
  ADD CONSTRAINT `login_history_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Contraintes pour la table `notifications`
--
ALTER TABLE `notifications`
  ADD CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Contraintes pour la table `payments`
--
ALTER TABLE `payments`
  ADD CONSTRAINT `payments_ibfk_1` FOREIGN KEY (`subscription_id`) REFERENCES `subscriptions` (`id`),
  ADD CONSTRAINT `payments_ibfk_2` FOREIGN KEY (`deleted_reason_id`) REFERENCES `deleted_reasons` (`id`);

--
-- Contraintes pour la table `permissions`
--
ALTER TABLE `permissions`
  ADD CONSTRAINT `permissions_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`);

--
-- Contraintes pour la table `reports`
--
ALTER TABLE `reports`
  ADD CONSTRAINT `reports_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `reports_ibfk_2` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`),
  ADD CONSTRAINT `reports_ibfk_3` FOREIGN KEY (`city_id`) REFERENCES `cities` (`id`),
  ADD CONSTRAINT `reports_ibfk_4` FOREIGN KEY (`media_id`) REFERENCES `media` (`id`);

--
-- Contraintes pour la table `reviews`
--
ALTER TABLE `reviews`
  ADD CONSTRAINT `reviews_ibfk_1` FOREIGN KEY (`report_id`) REFERENCES `reports` (`id`),
  ADD CONSTRAINT `reviews_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Contraintes pour la table `secondary_accounts`
--
ALTER TABLE `secondary_accounts`
  ADD CONSTRAINT `secondary_accounts_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `secondary_accounts_ibfk_2` FOREIGN KEY (`deleted_reason_id`) REFERENCES `deleted_reasons` (`id`);

--
-- Contraintes pour la table `subscriptions`
--
ALTER TABLE `subscriptions`
  ADD CONSTRAINT `subscriptions_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `subscriptions_ibfk_2` FOREIGN KEY (`plan_id`) REFERENCES `plans` (`id`),
  ADD CONSTRAINT `subscriptions_ibfk_3` FOREIGN KEY (`deleted_reason_id`) REFERENCES `deleted_reasons` (`id`);

--
-- Contraintes pour la table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`),
  ADD CONSTRAINT `users_ibfk_2` FOREIGN KEY (`deleted_reason_id`) REFERENCES `deleted_reasons` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
