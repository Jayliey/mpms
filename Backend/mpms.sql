-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 05, 2025 at 09:44 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

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
-- Table structure for table `appointments`
--

CREATE TABLE `appointments` (
  `appointment_id` int(11) NOT NULL,
  `patient_id` int(11) DEFAULT NULL,
  `staff_id` int(11) DEFAULT NULL,
  `description` varchar(200) DEFAULT NULL,
  `appointment_category` varchar(30) DEFAULT NULL,
  `appointment_state` varchar(20) DEFAULT NULL,
  `payment_status` varchar(20) DEFAULT NULL,
  `status` varchar(20) DEFAULT NULL,
  `date` date DEFAULT NULL,
  `date_created` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `appointments`
--

INSERT INTO `appointments` (`appointment_id`, `patient_id`, `staff_id`, `description`, `appointment_category`, `appointment_state`, `payment_status`, `status`, `date`, `date_created`) VALUES
(1, 2, 1, 'Anatal test', 'maternity', 'normal', 'Pending', 'Scheduled', '2025-06-11', '2025-06-03 08:58:00'),
(2, 2, 1, 'Postnatal test', 'maternity', 'normal', 'Pending', 'Scheduled', '2025-06-05', '2025-06-03 08:58:00');

-- --------------------------------------------------------

--
-- Table structure for table `medication`
--

CREATE TABLE `medication` (
  `medication_id` int(11) NOT NULL,
  `patient_id` int(11) NOT NULL,
  `assigned_by` varchar(50) NOT NULL,
  `description` varchar(150) NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `consumption_description` varchar(200) NOT NULL,
  `consumption_status` enum('inprogress','finished','pending') DEFAULT 'pending',
  `time_prescribed` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
  `time_signed` timestamp NOT NULL DEFAULT current_timestamp(),
  `status` varchar(12) DEFAULT 'Inactive'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `patient`
--

INSERT INTO `patient` (`patient_id`, `name`, `surname`, `age`, `dob`, `gender`, `id_number`, `phone`, `address1`, `address2`, `email`, `nok_name`, `nok_surname`, `nok_phone`, `marital_status`, `spouse_name`, `spouse_surname`, `spouse_phone`, `spouse_email`, `time_signed`, `status`) VALUES
(1, 'Juliet', 'admin', 22, '2003-05-25', '', '63-987654Z75', 2147483647, '123 Main Street', 'Apt 4B, Avondale', 'juliet@example.com', 'Jonah', 'Makanza', 2147483647, 'Single', '', '', 0, '', '2025-05-25 17:49:03', 'Active'),
(2, 'Juliet', 'chiri', 22, '2003-05-25', '', '63-987654Z75', 2147483647, '123 Main Street', 'Apt 4B, Avondale', 'juliet@example.com', 'Jonah', 'Makanza', 2147483647, 'Single', '', '', 0, '', '2025-01-13 17:49:14', 'Inactive'),
(4, 'Mike', 'John', 22, '2003-05-25', 'f', '63-987654Z75', 2147483647, '122 Main Street', 'Apt 4B, Avondale', 'juliet@example.com', 'Johns', 'Makanza', 2147483647, 'Single', '', '', 0, '', '2025-02-04 17:49:03', 'Active'),
(5, 'Timely', 'Arrow', 22, '2003-05-25', 'f', '63-987654Z75', 2147483647, '1234 Main Street', 'Apt 4B, Avondale', 'juliet@example.com', 'Jonah', 'Makanza', 2147483647, 'Single', '', '', 0, '', '2025-06-05 17:49:14', 'Inactive'),
(6, 'Sean\r\n', 'admin', 22, '2003-05-25', 'f', '63-987654Z75', 2147483647, '123 Main Street', 'Apt 4B, Avondale', 'juliet@example.com', 'Jonah', 'Makanza', 2147483647, 'Single', '', '', 0, '', '2025-05-25 17:49:03', 'Active'),
(7, 'Zuse\r\n', 'Arrow', 22, '2003-05-25', 'f', '63-987654Z75', 2147483647, '1234 Main Street', 'Apt 4B, Avondale', 'juliet@example.com', 'Jonah', 'Makanza', 2147483647, 'Single', '', '', 0, '', '2025-06-04 17:49:14', 'Active'),
(8, 'Mike', 'John', 22, '2003-05-25', 'f', '63-987654Z75', 2147483647, '122 Main Street', 'Apt 4B, Avondale', 'juliet@example.com', 'Johns', 'Makanza', 2147483647, 'Single', '', '', 0, '', '2025-02-06 17:49:03', 'Active'),
(9, 'Timely', 'Arrow', 22, '2003-05-25', 'f', '60-987654Z75', 2147483647, '1234 Main Street', 'Apt 4B, Avondale', 'juliet@example.com', 'Jonah', 'Makanza', 2147483647, 'Single', '', '', 0, '', '2025-06-06 17:49:14', 'Inactive');

-- --------------------------------------------------------

--
-- Table structure for table `payments`
--

CREATE TABLE `payments` (
  `payment_id` int(11) NOT NULL,
  `patient_id` int(11) NOT NULL,
  `appointmentid` int(11) DEFAULT NULL,
  `medicationid` int(11) DEFAULT NULL,
  `paymenttype` varchar(50) NOT NULL,
  `description` text DEFAULT NULL,
  `date_paid` datetime DEFAULT current_timestamp(),
  `receiptnumber` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
  `time_signed` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `status` varchar(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `staff`
--

INSERT INTO `staff` (`staff_id`, `role`, `name`, `surname`, `age`, `dob`, `gender`, `id_number`, `phone`, `address1`, `address2`, `email`, `nok_name`, `nok_surname`, `nok_phone`, `marital_status`, `spouse_name`, `spouse_surname`, `spouse_phone`, `spouse_email`, `time_signed`, `status`) VALUES
(2, 'doctor', 'Juliet', 'Chirimumimba', 22, '2003-05-25', 'm', '63-987654Z75', 2147483647, '123 Main Street', 'Apt 4B, Avondale', 'juliet@example.com', 'Jonah', 'Makanza', 2147483647, 'Single', '', '', 0, '', '2025-06-05 19:09:54', '0'),
(3, 'nurse', 'Juliet', 'Chirimumimba', 22, '2003-05-25', 'f', '63-987654Z75', 2147483647, '123 Main Street', 'Apt 4B, Avondale', 'juliet@example.com', 'Jonah', 'Makanza', 2147483647, 'Single', '', '', 0, '', '2025-05-25 17:44:12', '0');

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
-- Indexes for table `appointments`
--
ALTER TABLE `appointments`
  ADD PRIMARY KEY (`appointment_id`);

--
-- Indexes for table `medication`
--
ALTER TABLE `medication`
  ADD PRIMARY KEY (`medication_id`);

--
-- Indexes for table `patient`
--
ALTER TABLE `patient`
  ADD PRIMARY KEY (`patient_id`);

--
-- Indexes for table `payments`
--
ALTER TABLE `payments`
  ADD PRIMARY KEY (`payment_id`);

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
-- AUTO_INCREMENT for table `appointments`
--
ALTER TABLE `appointments`
  MODIFY `appointment_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `medication`
--
ALTER TABLE `medication`
  MODIFY `medication_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `patient`
--
ALTER TABLE `patient`
  MODIFY `patient_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `payments`
--
ALTER TABLE `payments`
  MODIFY `payment_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `roles`
--
ALTER TABLE `roles`
  MODIFY `role_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `staff`
--
ALTER TABLE `staff`
  MODIFY `staff_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
