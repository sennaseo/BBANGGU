-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema bbanggu
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `bbanggu` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci ;
USE `bbanggu` ;

-- -----------------------------------------------------
-- Table `bbanggu`.`user`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `bbanggu`.`user` (
  `user_id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `email` VARCHAR(255) NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `phone` VARCHAR(20) NULL DEFAULT NULL,
  `profile_image_url` VARCHAR(255) NULL DEFAULT NULL,
  `user_type` VARCHAR(255) NOT NULL,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `deleted_at` TIMESTAMP NULL DEFAULT NULL,
  `kakao_id` VARCHAR(50) NULL DEFAULT NULL,
  `refresh_token` VARCHAR(512) NULL DEFAULT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE INDEX `email` (`email` ASC) VISIBLE,
  UNIQUE INDEX `phone` (`phone` ASC) VISIBLE,
  UNIQUE INDEX `UK4tp32nb01jmfcirpipti37lfs` (`kakao_id` ASC) VISIBLE)
ENGINE = InnoDB
AUTO_INCREMENT = 4
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `bbanggu`.`bakery`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `bbanggu`.`bakery` (
  `bakery_id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` INT UNSIGNED NOT NULL,
  `name` VARCHAR(100) NOT NULL,
  `description` VARCHAR(1500) NULL DEFAULT NULL,
  `business_registration_number` VARCHAR(50) NOT NULL,
  `bakery_image_url` VARCHAR(255) NULL DEFAULT NULL,
  `address_road` VARCHAR(255) NOT NULL,
  `address_detail` VARCHAR(150) NOT NULL,
  `latitude` DOUBLE NOT NULL,
  `longitude` DOUBLE NOT NULL,
  `star` DOUBLE NOT NULL DEFAULT 0,
  `rating_1_cnt` INT NOT NULL DEFAULT 0,
  `rating_2_cnt` INT NOT NULL DEFAULT 0,
  `rating_3_cnt` INT NOT NULL DEFAULT 0,
  `rating_4_cnt` INT NOT NULL DEFAULT 0,
  `rating_5_cnt` INT NOT NULL DEFAULT 0,
  `review_cnt` INT NOT NULL DEFAULT 0,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `deleted_at` TIMESTAMP NULL DEFAULT NULL,
  `updated_at` TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (`bakery_id`),
  UNIQUE INDEX `business_registration_number` (`business_registration_number` ASC) VISIBLE,
  INDEX `user_id` (`user_id` ASC) VISIBLE,
  CONSTRAINT `bakery_ibfk_1`
    FOREIGN KEY (`user_id`)
    REFERENCES `bbanggu`.`user` (`user_id`)
    ON DELETE CASCADE)
ENGINE = InnoDB
AUTO_INCREMENT = 7
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `bbanggu`.`bakery_pickup_timetable`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `bbanggu`.`bakery_pickup_timetable` (
  `bakery_pickup_timetable_id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `bakery_id` INT UNSIGNED NOT NULL,
  `day_of_week` ENUM('Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday') NOT NULL,
  `start_time` TIME NOT NULL,
  `end_time` TIME NOT NULL,
  PRIMARY KEY (`bakery_pickup_timetable_id`),
  INDEX `bakery_id` (`bakery_id` ASC) VISIBLE,
  CONSTRAINT `pickup_time_ibfk_1`
    FOREIGN KEY (`bakery_id`)
    REFERENCES `bbanggu`.`bakery` (`bakery_id`)
    ON DELETE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `bbanggu`.`bread_category`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `bbanggu`.`bread_category` (
  `bread_category_id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL,
  `weight` INT NOT NULL,
  PRIMARY KEY (`bread_category_id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `bbanggu`.`bread`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `bbanggu`.`bread` (
  `bread_id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `bakery_id` INT UNSIGNED NOT NULL,
  `bread_category_id` INT UNSIGNED NOT NULL,
  `name` VARCHAR(100) NOT NULL,
  `price` INT NOT NULL,
  `bread_image_url` VARCHAR(255) NULL DEFAULT NULL,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `deleted_at` TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (`bread_id`),
  INDEX `bakery_id` (`bakery_id` ASC) VISIBLE,
  INDEX `bread_ibfk_2_idx` (`bread_category_id` ASC) VISIBLE,
  CONSTRAINT `bread_ibfk_1`
    FOREIGN KEY (`bakery_id`)
    REFERENCES `bbanggu`.`bakery` (`bakery_id`)
    ON DELETE CASCADE,
  CONSTRAINT `bread_ibfk_2`
    FOREIGN KEY (`bread_category_id`)
    REFERENCES `bbanggu`.`bread_category` (`bread_category_id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `bbanggu`.`bread_package`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `bbanggu`.`bread_package` (
  `bread_package_id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `bakery_id` INT UNSIGNED NOT NULL,
  `name` VARCHAR(100) NULL DEFAULT NULL,
  `price` INT UNSIGNED NOT NULL,
  `discount_rate` FLOAT NOT NULL,
  `quantity` INT UNSIGNED NOT NULL,
  `description` VARCHAR(500) NULL DEFAULT NULL,
  `pending` INT NOT NULL DEFAULT 0,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `deleted_at` TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (`bread_package_id`),
  INDEX `package_ibfk_1` (`bakery_id` ASC) VISIBLE,
  CONSTRAINT `package_ibfk_1`
    FOREIGN KEY (`bakery_id`)
    REFERENCES `bbanggu`.`bakery` (`bakery_id`)
    ON DELETE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `bbanggu`.`echo_saving`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `bbanggu`.`echo_saving` (
  `echo_saving_id` BIGINT NOT NULL AUTO_INCREMENT,
  `user_id` INT UNSIGNED NOT NULL,
  `saved_money` INT NOT NULL DEFAULT '0',
  `reduced_co2e` INT NULL DEFAULT '0',
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (`echo_saving_id`),
  INDEX `echo_saving_fk1_idx` (`user_id` ASC) VISIBLE,
  CONSTRAINT `echo_saving_fk1`
    FOREIGN KEY (`user_id`)
    REFERENCES `bbanggu`.`user` (`user_id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `bbanggu`.`favorite`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `bbanggu`.`favorite` (
  `favorite_id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` INT UNSIGNED NOT NULL,
  `bakery_id` INT UNSIGNED NOT NULL,
  `is_liked` TINYINT(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`favorite_id`),
  INDEX `bakery_id` (`bakery_id` ASC) VISIBLE,
  INDEX `favorite_ibfk_1` (`user_id` ASC) VISIBLE,
  CONSTRAINT `favorite_ibfk_1`
    FOREIGN KEY (`user_id`)
    REFERENCES `bbanggu`.`user` (`user_id`)
    ON DELETE CASCADE,
  CONSTRAINT `favorite_ibfk_2`
    FOREIGN KEY (`bakery_id`)
    REFERENCES `bbanggu`.`bakery` (`bakery_id`)
    ON DELETE CASCADE)
ENGINE = InnoDB
AUTO_INCREMENT = 4
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `bbanggu`.`reservation`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `bbanggu`.`reservation` (
  `reservation_id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` INT UNSIGNED NOT NULL,
  `bakery_id` INT UNSIGNED NOT NULL,
  `bread_package_id` INT UNSIGNED NOT NULL,
  `quantity` INT NOT NULL,
  `total_price` INT NOT NULL,
  `reserved_pickup_time` TIMESTAMP NOT NULL,
  `pickup_at` TIMESTAMP NULL DEFAULT NULL,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `cancelled_at` TIMESTAMP NULL DEFAULT NULL,
  `status` VARCHAR(45) NOT NULL,
  `payment_key` VARCHAR(50) NOT NULL,
  PRIMARY KEY (`reservation_id`),
  INDEX `user_id` (`user_id` ASC) VISIBLE,
  INDEX `bakery_id` (`bakery_id` ASC) VISIBLE,
  INDEX `reservation_ibfk_3_idx` (`bread_package_id` ASC) VISIBLE,
  CONSTRAINT `reservation_ibfk_1`
    FOREIGN KEY (`user_id`)
    REFERENCES `bbanggu`.`user` (`user_id`)
    ON DELETE CASCADE,
  CONSTRAINT `reservation_ibfk_2`
    FOREIGN KEY (`bakery_id`)
    REFERENCES `bbanggu`.`bakery` (`bakery_id`)
    ON DELETE CASCADE,
  CONSTRAINT `reservation_ibfk_3`
    FOREIGN KEY (`bread_package_id`)
    REFERENCES `bbanggu`.`bread_package` (`bread_package_id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `bbanggu`.`review`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `bbanggu`.`review` (
  `review_id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` INT UNSIGNED NOT NULL,
  `bakery_id` INT UNSIGNED NOT NULL,
  `rating` INT UNSIGNED NOT NULL,
  `content` VARCHAR(1500) NULL DEFAULT NULL,
  `review_image_url` VARCHAR(255) NULL DEFAULT NULL,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `deleted_at` TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (`review_id`),
  INDEX `user_id` (`user_id` ASC) VISIBLE,
  INDEX `bakery_id` (`bakery_id` ASC) VISIBLE,
  CONSTRAINT `review_ibfk_1`
    FOREIGN KEY (`user_id`)
    REFERENCES `bbanggu`.`user` (`user_id`)
    ON DELETE CASCADE,
  CONSTRAINT `review_ibfk_2`
    FOREIGN KEY (`bakery_id`)
    REFERENCES `bbanggu`.`bakery` (`bakery_id`)
    ON DELETE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `bbanggu`.`settlement`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `bbanggu`.`settlement` (
  `settlement_id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` INT UNSIGNED NOT NULL,
  `bank_name` VARCHAR(100) NOT NULL,
  `account_holder_name` VARCHAR(100) NOT NULL,
  `account_number` VARCHAR(50) NOT NULL,
  `email_for_tax_invoice` VARCHAR(255) NOT NULL,
  `business_license_file_url` VARCHAR(255) NULL DEFAULT NULL,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `deleted_at` TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (`settlement_id`),
  INDEX `user_id` (`user_id` ASC) VISIBLE,
  CONSTRAINT `settlement_ibfk_1`
    FOREIGN KEY (`user_id`)
    REFERENCES `bbanggu`.`user` (`user_id`)
    ON DELETE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `bbanggu`.`stock`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `bbanggu`.`stock` (
  `stock_id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `bakery_id` INT UNSIGNED NOT NULL,
  `bread_id` INT UNSIGNED NOT NULL,
  `quantity` INT NOT NULL,
  `date` DATE NOT NULL DEFAULT (CURRENT_DATE),
  PRIMARY KEY (`stock_id`),
  INDEX `bakery_id` (`bakery_id` ASC) VISIBLE,
  INDEX `bread_id` (`bread_id` ASC) VISIBLE,
  CONSTRAINT `stock_ibfk_1`
    FOREIGN KEY (`bakery_id`)
    REFERENCES `bbanggu`.`bakery` (`bakery_id`)
    ON DELETE CASCADE,
  CONSTRAINT `stock_ibfk_2`
    FOREIGN KEY (`bread_id`)
    REFERENCES `bbanggu`.`bread` (`bread_id`)
    ON DELETE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
