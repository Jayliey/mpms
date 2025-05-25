-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 25, 2025 at 07:58 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `mpms`
--

-- --------------------------------------------------------

--
-- Table structure for table `patient`
--

CREATE TABLE `patient` (
  `patient_id` int(11) NOT NULL,
  `name` text NOT NULL,
  `surname` text NOT NULL,
  `age` int(3) NOT NULL,
  `dob` varchar(50) NOT NULL,
  `gender` enum('m','f') NOT NULL DEFAULT 'f',
  `id_number` varchar(12) NOT NULL,
  `phone` int(12) NOT NULL,
  `address1` varchar(150) NOT NULL,
  `address2` varchar(150) DEFAULT NULL,
  `email` varchar(30) DEFAULT NULL,
  `nok_name` text NOT NULL,
  `nok_surname` text NOT NULL,
  `nok_phone` int(12) NOT NULL,
  `marital_status` text DEFAULT NULL,
  `spouse_name` text DEFAULT NULL,
  `spouse_surname` text DEFAULT NULL,
  `spouse_phone` int(12) DEFAULT NULL,
  `spouse_email` varchar(30) DEFAULT NULL,
  `time_signed` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `patient`
--

INSERT INTO `patient` (`patient_id`, `name`, `surname`, `age`, `dob`, `gender`, `id_number`, `phone`, `address1`, `address2`, `email`, `nok_name`, `nok_surname`, `nok_phone`, `marital_status`, `spouse_name`, `spouse_surname`, `spouse_phone`, `spouse_email`, `time_signed`) VALUES
(1, 'Juliet', 'admin', 22, '2003-05-25', '', '63-987654Z75', 2147483647, '123 Main Street', 'Apt 4B, Avondale', 'juliet@example.com', 'Jonah', 'Makanza', 2147483647, 'Single', '', '', 0, '', '2025-05-25 17:49:03'),
(2, 'Juliet', 'chiri', 22, '2003-05-25', '', '63-987654Z75', 2147483647, '123 Main Street', 'Apt 4B, Avondale', 'juliet@example.com', 'Jonah', 'Makanza', 2147483647, 'Single', '', '', 0, '', '2025-05-25 17:49:14');

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

CREATE TABLE `roles` (
  `role_id` int(11) NOT NULL,
  `value` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `roles`
--

INSERT INTO `roles` (`role_id`, `value`) VALUES
(1, 'Admin'),
(2, 'HIO'),
(3, 'doctor'),
(4, 'nurse');

-- --------------------------------------------------------

--
-- Table structure for table `staff`
--

CREATE TABLE `staff` (
  `staff_id` int(11) NOT NULL,
  `role` varchar(12) NOT NULL,
  `name` text NOT NULL,
  `surname` text NOT NULL,
  `age` int(3) NOT NULL,
  `dob` varchar(50) NOT NULL,
  `gender` enum('m','f') NOT NULL DEFAULT 'f',
  `id_number` varchar(12) NOT NULL,
  `phone` int(12) NOT NULL,
  `address1` varchar(150) NOT NULL,
  `address2` varchar(150) DEFAULT NULL,
  `email` varchar(30) DEFAULT NULL,
  `nok_name` text NOT NULL,
  `nok_surname` text NOT NULL,
  `nok_phone` int(12) NOT NULL,
  `marital_status` text DEFAULT NULL,
  `spouse_name` text DEFAULT NULL,
  `spouse_surname` text DEFAULT NULL,
  `spouse_phone` int(12) DEFAULT NULL,
  `spouse_email` varchar(30) DEFAULT NULL,
  `time_signed` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `staff`
--

INSERT INTO `staff` (`staff_id`, `role`, `name`, `surname`, `age`, `dob`, `gender`, `id_number`, `phone`, `address1`, `address2`, `email`, `nok_name`, `nok_surname`, `nok_phone`, `marital_status`, `spouse_name`, `spouse_surname`, `spouse_phone`, `spouse_email`, `time_signed`) VALUES
(2, 'doctor', 'Juliet', 'Chirimumimba', 22, '2003-05-25', '', '63-987654Z75', 2147483647, '123 Main Street', 'Apt 4B, Avondale', 'juliet@example.com', 'Jonah', 'Makanza', 2147483647, 'Single', '', '', 0, '', '2025-05-25 17:44:12');

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `user_id` int(11) NOT NULL,
  `staff_id` int(11) DEFAULT NULL,
  `email` varchar(30) NOT NULL,
  `password` varchar(100) NOT NULL,
  `role` varchar(12) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`user_id`, `staff_id`, `email`, `password`, `role`) VALUES
(1, 1, 'admin001@mpms.com', 'admin', 'Adminstrator');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `patient`
--
ALTER TABLE `patient`
  ADD PRIMARY KEY (`patient_id`);

--
-- Indexes for table `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`role_id`);

--
-- Indexes for table `staff`
--
ALTER TABLE `staff`
  ADD PRIMARY KEY (`staff_id`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`user_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `patient`
--
ALTER TABLE `patient`
  MODIFY `patient_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `roles`
--
ALTER TABLE `roles`
  MODIFY `role_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `staff`
--
ALTER TABLE `staff`
  MODIFY `staff_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
