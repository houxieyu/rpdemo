CREATE DATABASE  IF NOT EXISTS `jfinal_demo` /*!40100 DEFAULT CHARACTER SET utf8 */;
USE `jfinal_demo`;
-- MySQL dump 10.13  Distrib 5.6.13, for Win32 (x86)
--
-- Host: localhost    Database: jfinal_demo
-- ------------------------------------------------------
-- Server version	5.7.3-m13

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `blog`
--

DROP TABLE IF EXISTS `blog`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `blog` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(200) NOT NULL,
  `content` mediumtext NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `blog`
--

LOCK TABLES `blog` WRITE;
/*!40000 ALTER TABLE `blog` DISABLE KEYS */;
INSERT INTO `blog` VALUES (1,'JFinal Demo Title here','JFinal Demo Content here'),(2,'test 1','test 1'),(3,'test 2','test 2'),(4,'test 3','test 3'),(5,'test 4','test 4');
/*!40000 ALTER TABLE `blog` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `renyuan`
--

DROP TABLE IF EXISTS `renyuan`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `renyuan` (
  `id` varchar(45) NOT NULL,
  `R1` varchar(45) DEFAULT NULL,
  `R2` varchar(45) DEFAULT NULL,
  `R3` varchar(45) DEFAULT NULL,
  `R4` varchar(45) DEFAULT NULL,
  `R5` varchar(45) DEFAULT NULL,
  `R6` varchar(45) DEFAULT NULL,
  `R7` varchar(45) DEFAULT NULL,
  `R8` varchar(45) DEFAULT NULL,
  `R9` varchar(45) DEFAULT NULL,
  `R10` varchar(45) DEFAULT NULL,
  `R11` varchar(45) DEFAULT NULL,
  `R12` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `renyuan`
--

LOCK TABLES `renyuan` WRITE;
/*!40000 ALTER TABLE `renyuan` DISABLE KEYS */;
/*!40000 ALTER TABLE `renyuan` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `zhuhu`
--

DROP TABLE IF EXISTS `zhuhu`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `zhuhu` (
  `id` varchar(45) NOT NULL,
  `H1` varchar(45) DEFAULT NULL,
  `H2` varchar(45) DEFAULT NULL,
  `H3_1` varchar(45) DEFAULT NULL,
  `H3_2` varchar(45) DEFAULT NULL,
  `H4_1` varchar(45) DEFAULT NULL,
  `H4_2` varchar(45) DEFAULT NULL,
  `H4_3` varchar(45) DEFAULT NULL,
  `H4_4` varchar(45) DEFAULT NULL,
  `H5` varchar(45) DEFAULT NULL,
  `H6` varchar(45) DEFAULT NULL,
  `bdcode` varchar(45) DEFAULT NULL,
  `fangwuhao` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `zhuhu`
--

LOCK TABLES `zhuhu` WRITE;
/*!40000 ALTER TABLE `zhuhu` DISABLE KEYS */;
INSERT INTO `zhuhu` VALUES ('370102008015000007001','001','1','1',NULL,'0','0','0','0','1','1','370102008015000007','2-1-301'),('370102008015000007002','002','1','1',NULL,'0','0','0','0','1','1','370102008015000007','2-1-302'),('370102008015000007003','003','1','1',NULL,'0','0','0','0','1','1','370102008015000007','2-1-401'),('370102008015000007004','004','1','1',NULL,'0','0','0','0','1','1','370102008015000007','2-1-402'),('370102008015000008001','001','1','2',NULL,'111','0','0','0','1','1','370102008015000008','111'),('370102008015000008002','002','1','1',NULL,'0','0','0','0','1','1','370102008015000008','4-201'),('370102008015000009001','001','1','1',NULL,'0','0','0','0','1','1','370102008015000009','1-3001'),('3701020080150000131','1','1','1',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),('370102008015000017001','001','1','1',NULL,'0','0','0','0','1','1','370102008015000017','1-1101'),('370102008015000043001','001','1','1',NULL,'0','0','0','0','1','1','370102008015000043','1-303'),('370102008015000052003','003','1','10',NULL,'1','1','1','1',NULL,NULL,NULL,NULL),('370102008015001005','005','1','1',NULL,'0','0','0','0','1','1','370102008015001',NULL),('3701020080150011','1','1','1',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),('37010200801500133','33','1','4',NULL,'1',NULL,NULL,NULL,'120','6',NULL,NULL),('370102008015002','002','1','1',NULL,'1',NULL,NULL,NULL,NULL,NULL,NULL,NULL),('3701020080154','4','1','4',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),('370102008015556','556','1','2',NULL,'1',NULL,NULL,NULL,NULL,NULL,NULL,NULL),('370102008015666','666','1','2',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),('370102008015777','777','1','2',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),('370102008015999','999','1','1',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),('370102008015null',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),('null001','001','1','1',NULL,'0','0','0','0','1','1','370102008015000040',NULL),('nullnull',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `zhuhu` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2018-06-28 23:55:50
