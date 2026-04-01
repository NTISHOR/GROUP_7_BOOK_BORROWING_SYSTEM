/*M!999999\- enable the sandbox mode */ 
-- MariaDB dump 10.19  Distrib 10.11.14-MariaDB, for debian-linux-gnu (x86_64)
--
-- Host: localhost    Database: g7_bbs
-- ------------------------------------------------------
-- Server version	10.11.14-MariaDB-0+deb12u2

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `books`
--

DROP TABLE IF EXISTS `books`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `books` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `author` varchar(100) DEFAULT NULL,
  `isbn` varchar(20) DEFAULT NULL,
  `category` varchar(50) DEFAULT 'General',
  `status` enum('available','borrowed') DEFAULT 'available',
  `image_name` varchar(255) DEFAULT 'default_cover.jpg',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `books`
--

LOCK TABLES `books` WRITE;
/*!40000 ALTER TABLE `books` DISABLE KEYS */;
INSERT INTO `books` VALUES
(1,'Introduction to PHP','Ulasi Marvellous','PHP001','Programming','available','php.png'),
(2,'Mastering MariaDB','Group 7 Developers','DB002','Database','available','mariadb.jpg'),
(3,'Web Design Basics','Chimdindu','WD003','Design','available','web_design.jpg'),
(4,'AgriPredict AI Guide','Ulasi Marvellous','AGRI04','Agriculture','available','agripredict.jpg'),
(5,'Route Optimization 101','GeoProj v2','GEO05','Logistics','available','route.jpg'),
(6,'Dijkstra Algorithm Deep Dive','Pathfinder','ALGO06','Mathematics','available','dijkstra.jpg'),
(7,'Modern CSS Frameworks','Style Guru','CSS07','Design','available','css.png'),
(8,'JavaScript Essentials','Code Master','JS08','Programming','available','javascript.jpg'),
(9,'Database Normalization','Data Architect','DB09','Database','available','db_norm.jpg'),
(10,'OpenWeatherMap API Guide','Climate Tech','API10','Programming','available','weather_api.jpg'),
(11,'Linux for Chromebooks','Penguin User','OS11','System','available','linux.jpg'),
(12,'Network Security Fundamentals','Cyber Shield','SEC12','Security','available','security.jpg'),
(13,'UI/UX Principles','Creative Mind','UI13','Design','available','uiux.png'),
(14,'Python Data Analysis','Data Scientist','PY14','Programming','available','python_data.jpg'),
(15,'Cloud Computing Basics','Sky High','CC15','System','available','cloud.jpg'),
(16,'Machine Learning Intro','AI Expert','ML16','Programming','available','ml.jpg'),
(17,'Version Control with Git','Repo King','GIT17','System','available','git.jpg'),
(18,'Responsive Web Design','Mobile First','WD18','Design','available','responsive.jpg'),
(19,'SQL Performance Tuning','Query Pro','SQL19','Database','available','sql_tune.jpg'),
(20,'The Art of Debugging','Bug Hunter','DEB20','Programming','available','debugging.jpg'),
(21,'Discrete Mathematics','Logic Prof','MATH21','Mathematics','available','math.jpg'),
(22,'Transportation Simulation','Logistics Pro','SIM22','Logistics','available','transport.jpg'),
(23,'Climate Resilience Tech','Eco Developer','ECO23','Agriculture','available','climate.jpg'),
(24,'Frontend Frameworks','React Fan','FE24','Design','available','frontend.jpg'),
(25,'Backend Logic 102','Server Side','BE25','Programming','available','backend.jpg'),
(26,'Mobile App Development','Droid Dev','APP26','Programming','available','mobile.jpg'),
(27,'Cybersecurity Ethics','White Hat','SEC27','Security','available','ethics.jpg'),
(28,'Advanced SQLAlchemy','Python Pro','SQA28','Database','available','sqlalchemy.jpg'),
(29,'Game Emulation Secrets','Dolphin Dev','EMU29','System','available','emulation.jpg'),
(30,'The Developer Roadmap','Ulasi Marvellous','MAP30','General','available','roadmap.jpg');
/*!40000 ALTER TABLE `books` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `borrow_records`
--

DROP TABLE IF EXISTS `borrow_records`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `borrow_records` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL,
  `book_id` int(11) DEFAULT NULL,
  `borrow_date` timestamp NULL DEFAULT current_timestamp(),
  `return_date` date DEFAULT NULL,
  `total_fee` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `book_id` (`book_id`),
  CONSTRAINT `borrow_records_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `borrow_records_ibfk_2` FOREIGN KEY (`book_id`) REFERENCES `books` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `borrow_records`
--

LOCK TABLES `borrow_records` WRITE;
/*!40000 ALTER TABLE `borrow_records` DISABLE KEYS */;
/*!40000 ALTER TABLE `borrow_records` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `fullname` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `student_id` varchar(50) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES
(1,'ULASI MARVELLOUS CHIMDINDU','test@example.com','munachi123',NULL,'2026-03-31 11:23:53');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-03-31 14:24:37
