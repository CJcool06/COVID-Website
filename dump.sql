-- MySQL dump 10.13  Distrib 8.0.25, for macos11.3 (x86_64)
--
-- Host: localhost    Database: covidw
-- ------------------------------------------------------
-- Server version	8.0.25

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `checkins`
--

DROP TABLE IF EXISTS `checkins`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `checkins` (
  `id` int DEFAULT NULL,
  `user` int DEFAULT NULL,
  `venue` varchar(30) DEFAULT NULL,
  `code` varchar(10) DEFAULT NULL,
  `time` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `checkins`
--

LOCK TABLES `checkins` WRITE;
/*!40000 ALTER TABLE `checkins` DISABLE KEYS */;
INSERT INTO `checkins` VALUES (0,0,'Starbucks','GVMkhjbd','2021-06-11 13:54:09'),(1,1,'Bunnings','KJNi676d','2021-06-11 13:57:33'),(2,0,'Adelaide University','87asgdyhD','2021-06-11 11:34:22'),(3,0,'Bunnings','KJNi676d','2021-06-11 13:57:33'),(4,0,'Starbucks','GVMkhjbd','2021-06-14 04:13:34'),(5,0,'Adelaide University','87asgdyhD','2021-06-14 04:13:58'),(6,0,'Bunnings','KJNi676d','2021-06-14 04:14:28'),(7,0,'Bunnings','KJNi676d','2021-06-14 04:14:31'),(8,0,'Bunnings','KJNi676d','2021-06-14 04:14:51'),(9,0,'Bunnings','KJNi676d','2021-06-14 04:15:06'),(10,0,'Bunnings','KJNi676d','2021-06-14 04:15:35'),(11,0,'Bunnings','KJNi676d','2021-06-14 04:15:52'),(12,0,'Bunnings','KJNi676d','2021-06-14 04:16:31'),(13,0,'Mars','vh54Jy65N0','2021-06-14 05:20:43'),(14,3,'angle house','RiJi2twLuN','2021-06-14 10:39:28'),(15,3,'angle house','RiJi2twLuN','2021-06-14 10:39:52'),(16,3,'angle house','RiJi2twLuN','2021-06-14 10:40:31'),(17,4,'My Venue','he7zWZ8fgj','2021-06-14 11:02:30'),(18,0,'Adelaide University','87asgdyhD','2021-06-14 11:05:52'),(19,0,'Adelaide University','87asgdyhD','2021-06-14 11:05:55'),(20,0,'Adelaide University','87asgdyhD','2021-06-14 11:06:00');
/*!40000 ALTER TABLE `checkins` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `hotspots`
--

DROP TABLE IF EXISTS `hotspots`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hotspots` (
  `id` int DEFAULT NULL,
  `venue` varchar(20) DEFAULT NULL,
  `since` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `hotspots`
--

LOCK TABLES `hotspots` WRITE;
/*!40000 ALTER TABLE `hotspots` DISABLE KEYS */;
INSERT INTO `hotspots` VALUES (0,'KJNi676d','2021-06-11 11:34:23'),(2,'DRf2VJ59k7','2021-06-14 08:34:55'),(3,'RiJi2twLuN','2021-06-14 11:04:59'),(4,'87asgdyhD','2021-06-14 11:05:29');
/*!40000 ALTER TABLE `hotspots` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int DEFAULT NULL,
  `fName` varchar(20) DEFAULT NULL,
  `lName` varchar(20) DEFAULT NULL,
  `email` varchar(30) DEFAULT NULL,
  `password` varchar(20) DEFAULT NULL,
  `accountType` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (0,'Chris','Fusco','chris@gmail.com','12345','official'),(1,'Angel','Allen','angel@gmail.com','54321','normal'),(3,'angle','angle','anglealen@gmail.com','supersecret','venueOwner'),(4,'Chris','Fusco','chrisfusco@gmail.com','321','venueOwner');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `venues`
--

DROP TABLE IF EXISTS `venues`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `venues` (
  `id` int DEFAULT NULL,
  `owner` int DEFAULT NULL,
  `name` varchar(30) DEFAULT NULL,
  `code` varchar(10) DEFAULT NULL,
  `latitude` decimal(10,3) DEFAULT NULL,
  `longitude` decimal(10,3) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `venues`
--

LOCK TABLES `venues` WRITE;
/*!40000 ALTER TABLE `venues` DISABLE KEYS */;
INSERT INTO `venues` VALUES (0,0,'Starbucks','GVMkhjbd',-34.928,138.601),(1,0,'Bunnings','KJNi676d',-34.922,138.611),(2,0,'Adelaide University','87asgdyhD',-34.923,138.617),(3,0,'My Bedroom','DRf2VJ59k7',-32.018,138.239),(8,3,'angle house','RiJi2twLuN',10.000,176.239),(9,4,'My Venue','he7zWZ8fgj',-31.300,123.385);
/*!40000 ALTER TABLE `venues` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2021-06-14 20:39:56
