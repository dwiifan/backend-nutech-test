/*
 Navicat Premium Data Transfer

 Source Server         : localhost
 Source Server Type    : MySQL
 Source Server Version : 100432
 Source Host           : localhost:3306
 Source Schema         : ppob

 Target Server Type    : MySQL
 Target Server Version : 100432
 File Encoding         : 65001

 Date: 22/08/2024 22:31:29
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for banner
-- ----------------------------
DROP TABLE IF EXISTS `banner`;
CREATE TABLE `banner`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `banner_name` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `banner_image` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `description` text CHARACTER SET utf8 COLLATE utf8_general_ci NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 7 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of banner
-- ----------------------------
INSERT INTO `banner` VALUES (1, 'Banner 1', 'https://nutech-integrasi.app/dummy.jpg', 'Lerem Ipsum Dolor sit amet');
INSERT INTO `banner` VALUES (2, 'Banner 2', 'https://nutech-integrasi.app/dummy.jpg', 'Lerem Ipsum Dolor sit amet');
INSERT INTO `banner` VALUES (3, 'Banner 3', 'https://nutech-integrasi.app/dummy.jpg', 'Lerem Ipsum Dolor sit amet');
INSERT INTO `banner` VALUES (4, 'Banner 4', 'https://nutech-integrasi.app/dummy.jpg', 'Lerem Ipsum Dolor sit amet');
INSERT INTO `banner` VALUES (5, 'Banner 5', 'https://nutech-integrasi.app/dummy.jpg', 'Lerem Ipsum Dolor sit amet');
INSERT INTO `banner` VALUES (6, 'Banner 6', 'https://nutech-integrasi.app/dummy.jpg', 'Lerem Ipsum Dolor sit amet');

-- ----------------------------
-- Table structure for profiles
-- ----------------------------
DROP TABLE IF EXISTS `profiles`;
CREATE TABLE `profiles`  (
  `profile_id` int NOT NULL,
  `name` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  PRIMARY KEY (`profile_id`) USING BTREE,
  CONSTRAINT `profiles_ibfk_1` FOREIGN KEY (`profile_id`) REFERENCES `user` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of profiles
-- ----------------------------
INSERT INTO `profiles` VALUES (1, 'ADMIN');
INSERT INTO `profiles` VALUES (2, 'CLIENT');

-- ----------------------------
-- Table structure for services
-- ----------------------------
DROP TABLE IF EXISTS `services`;
CREATE TABLE `services`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `service_code` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `service_name` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `service_icon` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `service_tariff` decimal(10, 2) NOT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 13 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of services
-- ----------------------------
INSERT INTO `services` VALUES (1, 'PAJAK', 'Pajak PBB', 'https://nutech-integrasi.app/dummy.jpg', 40000.00);
INSERT INTO `services` VALUES (2, 'PLN', 'Listrik', 'https://nutech-integrasi.app/dummy.jpg', 10000.00);
INSERT INTO `services` VALUES (3, 'PDAM', 'PDAM Berlangganan', 'https://nutech-integrasi.app/dummy.jpg', 40000.00);
INSERT INTO `services` VALUES (4, 'PULSA', 'Pulsa', 'https://nutech-integrasi.app/dummy.jpg', 40000.00);
INSERT INTO `services` VALUES (5, 'PGN', 'PGN Berlangganan', 'https://nutech-integrasi.app/dummy.jpg', 50000.00);
INSERT INTO `services` VALUES (6, 'MUSIK', 'Musik Berlangganan', 'https://nutech-integrasi.app/dummy.jpg', 50000.00);
INSERT INTO `services` VALUES (7, 'TV', 'TV Berlangganan', 'https://nutech-integrasi.app/dummy.jpg', 50000.00);
INSERT INTO `services` VALUES (8, 'PAKET_DATA', 'Paket data', 'https://nutech-integrasi.app/dummy.jpg', 50000.00);
INSERT INTO `services` VALUES (9, 'VOUCHER_GAME', 'Voucher Game', 'https://nutech-integrasi.app/dummy.jpg', 100000.00);
INSERT INTO `services` VALUES (10, 'VOUCHER_MAKANAN', 'Voucher Makanan', 'https://nutech-integrasi.app/dummy.jpg', 100000.00);
INSERT INTO `services` VALUES (11, 'QURBAN', 'Qurban', 'https://nutech-integrasi.app/dummy.jpg', 200000.00);
INSERT INTO `services` VALUES (12, 'ZAKAT', 'Zakat', 'https://nutech-integrasi.app/dummy.jpg', 300000.00);

-- ----------------------------
-- Table structure for user
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `first_name` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `last_name` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `password` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `profile_image` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `email`(`email`) USING BTREE,
  CONSTRAINT `user_ibfk_1` FOREIGN KEY (`id`) REFERENCES `services` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 5 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of user
-- ----------------------------
INSERT INTO `user` VALUES (1, 'user@nutech-integrasi.com', 'Nutech', 'User', '$2b$10$eXEfslUo13DP0fy/vYoU..e9/k/zi9hzIeLZJ14vedR6tUf3Bu4RC', '');
INSERT INTO `user` VALUES (2, 'difanrmd@gmail.com', 'Dwi Ifan', 'Ramadhan', '$2a$10$NAUzsSgOZSUGXfxt4VvJZ.LFSilfPMt26gIwh47duHkE3WOa2amBK', '');
INSERT INTO `user` VALUES (3, 'ocado@gmail.com', 'Ocad', 'Oconer', '$2b$10$VNd3XnpvZbMYZhm.f7xDg.QUUtidE2rpn3jv5o9UxigEgb1FE915G', 'https://yoururlapi.com/profile-updated.jpeg');
INSERT INTO `user` VALUES (4, 'usertest@gmail.com', 'braga', 'test', '$2b$10$XMnZW5wHt2w0tsBPr6PUteNIzUC7aRyRvREYAeGpzOUDgRDz/c47.', '');

SET FOREIGN_KEY_CHECKS = 1;
