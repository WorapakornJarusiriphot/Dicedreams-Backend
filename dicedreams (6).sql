-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jul 04, 2024 at 01:34 AM
-- Server version: 10.4.25-MariaDB
-- PHP Version: 8.1.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `dicedreams`
--

-- --------------------------------------------------------

--
-- Table structure for table `chat`
--

CREATE TABLE `chat` (
  `chat_id` bigint(20) NOT NULL,
  `message` varchar(255) NOT NULL,
  `datetime_chat` varchar(20) NOT NULL,
  `user_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `post_games_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `chat`
--

INSERT INTO `chat` (`chat_id`, `message`, `datetime_chat`, `user_id`, `post_games_id`, `createdAt`, `updatedAt`) VALUES
(0, 'req.body.message555555', '01/04/2567 02:50:00', 'a4fa154b-a15a-45fe-b04f-2f9c61a8f2fa', '1f287c54-f8ea-4b62-b143-60cb7361faf6', '2024-03-16 18:21:41', '2024-03-16 18:58:41'),
(56, 'req.body.message33', '01/04/2567 02:50:00', 'a4fa154b-a15a-45fe-b04f-2f9c61a8f2fa', '1f287c54-f8ea-4b62-b143-60cb7361faf6', '2024-03-16 18:27:45', '2024-03-16 18:27:45');

-- --------------------------------------------------------

--
-- Table structure for table `notification`
--

CREATE TABLE `notification` (
  `notification_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `type` varchar(50) NOT NULL,
  `read` tinyint(1) NOT NULL,
  `time` datetime NOT NULL,
  `user_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `entity_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `notification`
--

INSERT INTO `notification` (`notification_id`, `type`, `read`, `time`, `user_id`, `entity_id`, `createdAt`, `updatedAt`) VALUES
('1d110178-2993-415b-947f-1e4678a91939', 'participate', 0, '2024-06-24 09:27:10', '48b0a732-b292-4cf8-bdd2-52156f177587', '787ff400-f05b-4fde-b196-ccc3d6aadbaa', '2024-06-24 09:27:10', '2024-06-24 09:27:10'),
('2bb8104e-ddda-4cde-928f-a87b4ee77b48', 'participate', 1, '2024-03-16 18:08:32', 'a4fa154b-a15a-45fe-b04f-2f9c61a8f2fa', '5ce4c905-53f7-4441-a234-c52810f06f0b', '2024-03-16 18:08:32', '2024-05-24 01:28:42'),
('4048e81b-126e-4226-a640-748dc232612e', 'chat', 0, '2024-03-16 18:21:41', 'a4fa154b-a15a-45fe-b04f-2f9c61a8f2fa', 'c5b2587f4c1b4cdc9a75a57bba768f54', '2024-03-16 18:21:41', '2024-03-16 18:21:41'),
('4b5c7fd5-f4a1-4f7e-886f-1d36ca173250', 'chat', 0, '2024-03-16 18:58:41', 'a4fa154b-a15a-45fe-b04f-2f9c61a8f2fa', '0', '2024-03-16 18:58:41', '2024-03-16 18:58:41'),
('4df16245-9471-409d-929a-fbfd3d14efd7', 'participate', 1, '2024-05-21 01:10:42', '48b0a732-b292-4cf8-bdd2-52156f177587', 'af26bae0-00cf-47f7-8776-d032adf67624', '2024-05-21 01:10:42', '2024-05-27 03:42:43'),
('640d66be-740a-4482-9df4-360973145a01', 'participate', 0, '2024-06-13 00:57:43', '48b0a732-b292-4cf8-bdd2-52156f177587', 'f2a26f9f-f8c9-4e00-869d-f43c3c350285', '2024-06-13 00:57:43', '2024-06-13 00:57:43'),
('7335e351-e8f8-479e-a256-025612c89959', 'participate', 1, '2024-05-13 02:25:14', '48b0a732-b292-4cf8-bdd2-52156f177587', 'e8960fa3-04ea-48bb-82d4-f3054f4352cd', '2024-05-13 02:25:14', '2024-05-27 03:42:43'),
('7621f749-717a-485f-97f6-4a8aee5cd01a', 'chat', 0, '2024-03-16 18:27:46', 'a4fa154b-a15a-45fe-b04f-2f9c61a8f2fa', '56d3bae0da0543838af428ff29510f5a', '2024-03-16 18:27:46', '2024-03-16 18:27:46'),
('8ab1a16c-c72e-4016-bce5-87fdcf6a8212', 'participate', 1, '2024-05-21 04:24:40', '48b0a732-b292-4cf8-bdd2-52156f177587', '20a90f99-b87d-4940-bef3-fdbf0c034a89', '2024-05-21 04:24:40', '2024-05-27 03:42:43'),
('a70e8688-f594-4c66-a029-f341acfd4d94', 'participate', 1, '2024-05-21 01:36:19', '48b0a732-b292-4cf8-bdd2-52156f177587', '7030a17d-4f24-4ba4-8a1c-d0d074d8326e', '2024-05-21 01:36:19', '2024-05-27 03:42:43'),
('b5efbb56-f421-4df3-8feb-c18f75578b02', 'participate', 1, '2024-05-27 03:42:14', '48b0a732-b292-4cf8-bdd2-52156f177587', '00a9d2b7-1ef2-4203-bf4b-7e9b206871ba', '2024-05-27 03:42:14', '2024-05-27 03:42:43'),
('b6d739ae-dd89-4a21-a0cd-d3af16b65884', 'participate', 1, '2024-03-16 18:12:53', 'a4fa154b-a15a-45fe-b04f-2f9c61a8f2fa', '5ce4c905-53f7-4441-a234-c52810f06f0b', '2024-03-16 18:12:53', '2024-05-27 01:54:41'),
('c1a142c9-cb3f-42b5-9948-0592687e27c5', 'participate', 0, '2024-06-12 22:13:30', '48b0a732-b292-4cf8-bdd2-52156f177587', '62c818c6-2e1e-491f-b118-f152bd10deeb', '2024-06-12 22:13:30', '2024-06-12 22:13:30'),
('c863d3fd-8e9c-49aa-9a1c-58bf3ea1ffbb', 'participate', 0, '2024-06-13 00:55:15', '48b0a732-b292-4cf8-bdd2-52156f177587', '1e84a5d4-57a2-40aa-bb8b-211deb4cc50d', '2024-06-13 00:55:15', '2024-06-13 00:55:15'),
('c99f7bba-8e5f-4481-aaad-ace179f27ab2', 'participate', 0, '2024-06-05 09:40:49', '48b0a732-b292-4cf8-bdd2-52156f177587', '883e73d0-382f-4808-a79c-61d145c75c93', '2024-06-05 09:40:49', '2024-06-05 09:40:49'),
('da684b9f-9a95-451c-893b-68d129ba294f', 'participate', 1, '2024-05-27 03:41:17', '48b0a732-b292-4cf8-bdd2-52156f177587', 'fecd1ea6-df1f-40c2-a718-6a5fe0f17489', '2024-05-27 03:41:17', '2024-05-27 03:42:43'),
('dcb736a7-f5f0-48d3-a5dd-8e271b9475a0', 'participate', 0, '2024-06-12 22:38:46', '48b0a732-b292-4cf8-bdd2-52156f177587', '7e1401c2-3dac-4f88-8fee-afffa548dc39', '2024-06-12 22:38:46', '2024-06-12 22:38:46'),
('edd36fc0-d3d0-4ce1-a645-edf03aba4af2', 'participate', 1, '2024-05-23 02:58:03', '48b0a732-b292-4cf8-bdd2-52156f177587', 'd8009c46-a1c4-46ae-99f8-2841bb2f4dca', '2024-05-23 02:58:03', '2024-05-27 03:42:43'),
('ef10dc9b-8d65-4e62-b041-851e21ff5e3c', 'participate', 1, '2024-05-21 01:34:14', '48b0a732-b292-4cf8-bdd2-52156f177587', '42ed08d8-ee91-41f8-b572-d2b02f60f854', '2024-05-21 01:34:14', '2024-05-27 03:42:43'),
('f1c0fe64-162e-429b-a56d-401de19a6a25', 'participate', 1, '2024-05-21 01:23:08', '48b0a732-b292-4cf8-bdd2-52156f177587', '7ed6f777-bdc5-49cf-ad73-2ad776068aad', '2024-05-21 01:23:08', '2024-05-27 03:42:43');

-- --------------------------------------------------------

--
-- Table structure for table `participate`
--

CREATE TABLE `participate` (
  `part_Id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `participant_apply_datetime` datetime NOT NULL,
  `participant_status` varchar(20) NOT NULL,
  `user_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `post_games_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `participate`
--

INSERT INTO `participate` (`part_Id`, `participant_apply_datetime`, `participant_status`, `user_id`, `post_games_id`, `createdAt`, `updatedAt`) VALUES
('00a9d2b7-1ef2-4203-bf4b-7e9b206871ba', '0000-00-00 00:00:00', 'active', '217affca-a63a-429d-abed-c3c34498a1a8', 'acbe805d-62df-46fd-ba02-96b57c52e40e', '2024-05-27 03:42:14', '2024-05-27 03:42:14'),
('20a90f99-b87d-4940-bef3-fdbf0c034a89', '0000-00-00 00:00:00', 'active', 'c574677a-f7ea-411d-93c4-da54ac227628', '0799009b-7e03-4f44-9a6b-e96ce4028166', '2024-05-21 04:24:40', '2024-05-21 04:24:40'),
('42ed08d8-ee91-41f8-b572-d2b02f60f854', '0000-00-00 00:00:00', 'active', '217affca-a63a-429d-abed-c3c34498a1a8', '1f3586a9-073b-4e6d-8d56-638f9e55f021', '2024-05-21 01:34:14', '2024-05-21 01:34:14'),
('5ce4c905-53f7-4441-a234-c52810f06f0b', '2567-01-03 19:50:00', 'unActive', 'a4fa154b-a15a-45fe-b04f-2f9c61a8f2fa', '1f287c54-f8ea-4b62-b143-60cb7361faf6', '2024-03-16 18:08:32', '2024-03-16 18:12:53'),
('7030a17d-4f24-4ba4-8a1c-d0d074d8326e', '0000-00-00 00:00:00', 'active', '217affca-a63a-429d-abed-c3c34498a1a8', '09cb699f-6daf-4c37-8aec-d02eb7296870', '2024-05-21 01:36:19', '2024-05-21 01:36:19'),
('787ff400-f05b-4fde-b196-ccc3d6aadbaa', '0000-00-00 00:00:00', 'active', 'fdbb2c65-631c-4ab4-9546-3b4f40de7fe6', '8c2ff04c-4cc6-42b4-aae4-262891b9d970', '2024-06-24 09:27:10', '2024-06-24 09:27:10'),
('7ed6f777-bdc5-49cf-ad73-2ad776068aad', '0000-00-00 00:00:00', 'active', '217affca-a63a-429d-abed-c3c34498a1a8', '1087a586-16c5-44c2-b3ad-75a969380c0f', '2024-05-21 01:23:08', '2024-05-21 01:23:08'),
('883e73d0-382f-4808-a79c-61d145c75c93', '2567-05-06 09:40:49', 'active', '217affca-a63a-429d-abed-c3c34498a1a8', '8c2ff04c-4cc6-42b4-aae4-262891b9d970', '2024-06-05 09:40:49', '2024-06-05 09:40:49'),
('af26bae0-00cf-47f7-8776-d032adf67624', '0000-00-00 00:00:00', 'active', '217affca-a63a-429d-abed-c3c34498a1a8', '0799009b-7e03-4f44-9a6b-e96ce4028166', '2024-05-21 01:10:42', '2024-05-21 01:10:42'),
('d8009c46-a1c4-46ae-99f8-2841bb2f4dca', '0000-00-00 00:00:00', 'active', 'c574677a-f7ea-411d-93c4-da54ac227628', '1087a586-16c5-44c2-b3ad-75a969380c0f', '2024-05-23 02:58:03', '2024-05-23 02:58:03'),
('e8960fa3-04ea-48bb-82d4-f3054f4352cd', '2567-01-03 19:50:00', 'active', '217affca-a63a-429d-abed-c3c34498a1a8', '1f76e56c-4794-4d67-9069-c658c7fefa39', '2024-05-13 02:25:14', '2024-05-13 02:25:14'),
('fecd1ea6-df1f-40c2-a718-6a5fe0f17489', '0000-00-00 00:00:00', 'active', '217affca-a63a-429d-abed-c3c34498a1a8', '84c5bbef-5d9f-4701-af39-261ab71fb9af', '2024-05-27 03:41:17', '2024-05-27 03:41:17');

-- --------------------------------------------------------

--
-- Table structure for table `post_activity`
--

CREATE TABLE `post_activity` (
  `post_activity_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `name_activity` varchar(50) NOT NULL,
  `status_post` varchar(20) NOT NULL,
  `creation_date` datetime NOT NULL,
  `detail_post` varchar(255) NOT NULL,
  `date_activity` date NOT NULL,
  `time_activity` time NOT NULL,
  `post_activity_image` varchar(255) DEFAULT NULL,
  `store_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `post_activity`
--

INSERT INTO `post_activity` (`post_activity_id`, `name_activity`, `status_post`, `creation_date`, `detail_post`, `date_activity`, `time_activity`, `post_activity_image`, `store_id`) VALUES
('1f3781cc-6e9e-489b-9cd7-5708aaf694ac', 'worapakorn', 'unActive', '0000-00-00 00:00:00', 'worapakorn', '0000-00-00', '06:01:08', '073268fd-f68e-4408-9e73-26491feb62cb.jpeg', '3594f82f-e3bf-11ee-9efc-30d0422f59c9'),
('296bcf4f-0c62-4cbd-9070-4698ab629f83', 'Magic The Gathering Commander 1st friendly match8', 'active', '2024-05-29 23:06:25', 'Magic The Gathering Commander 1st friendly match8', '2024-05-31', '06:09:45', 'ae0646c2-77ae-45bb-9f97-b258195540e6.jpeg', '3594f82f-e3bf-11ee-9efc-30d0422f59c9'),
('2bae55f5-a418-4380-96a3-821e3f771425', 'Magic The Gathering Commander 1st friendly match3', 'active', '2024-09-05 00:30:03', 'Magic The Gathering Commander 1st friendly match3', '2024-09-05', '07:30:03', '13d6b903-7e22-40f2-a081-a1ee7db8da70.jpeg', '3594f82f-e3bf-11ee-9efc-30d0422f59c9'),
('4a4ca645-618e-45ff-9a60-c247fea20a9b', '', 'active', '2024-05-27 01:55:50', '', '2024-05-27', '08:55:46', '', '3594f82f-e3bf-11ee-9efc-30d0422f59c9'),
('52951e92-2409-4b4c-990a-a9111bd03cbc', 'test name activity', 'unActive', '2567-09-02 23:07:00', 'detail_post activity', '2567-09-03', '06:07:00', 'e68ca845-d6bd-4212-867a-f00ddcb8c631.jpeg', '3594f82f-e3bf-11ee-9efc-30d0422f59c9'),
('5450f50d-ed71-4549-8134-57de0f3e329d', 'Magic The Gathering Commander 1st friendly match', 'unActive', '2024-05-17 00:04:04', 'Magic The Gathering Commander 1st friendly match', '2024-05-20', '12:30:44', '', '3594f82f-e3bf-11ee-9efc-30d0422f59c9'),
('63b607bd-6f71-46dd-88d5-6c6e0768325e', 'Magic The Gathering Commander 1st friendly match8', 'active', '2024-06-27 17:33:12', 'Magic The Gathering Commander 1st friendly match8', '2024-06-30', '00:37:04', 'a898bdc9-3724-438f-a4d9-2103cc10bcaa.jpeg', '3594f82f-e3bf-11ee-9efc-30d0422f59c9'),
('723ff956-7327-46af-90d4-db340afe2e98', 'Magic The Gathering Commander 1st friendly match3', 'active', '2024-05-28 22:18:36', 'Magic The Gathering Commander 1st friendly match3', '2024-05-31', '05:18:09', '85a9357c-90c3-4a55-9faf-51b87dec156c.jpeg', '3594f82f-e3bf-11ee-9efc-30d0422f59c9'),
('8282fd80-1cd5-4e6f-818d-8004b8f23bc0', 'Magic The Gathering Commander 1st friendly match2', 'active', '2024-09-05 00:27:05', 'Magic The Gathering Commander 1st friendly match2', '2024-09-05', '07:27:05', '35f5c5d1-c199-428a-9424-c8f235443092.jpeg', '3594f82f-e3bf-11ee-9efc-30d0422f59c9'),
('85657615-c01c-4c88-af1e-2380c986dfb5', 'test name activity', 'unActive', '2567-09-02 23:07:00', 'detail_post activity', '2567-09-03', '06:07:00', 'f4aa7b7f-d716-48d1-ae86-e7f5e5a44e27.jpeg', '3594f82f-e3bf-11ee-9efc-30d0422f59c9'),
('85c117f0-c001-4544-93e9-aec94c22b484', 'Magic The Gathering Commander 1st friendly match4', 'active', '2024-11-04 20:06:24', 'Magic The Gathering Commander 1st friendly match4', '2024-11-05', '03:06:24', 'c0efa842-60ad-41b9-843a-790b59117e15.jpeg', '3594f82f-e3bf-11ee-9efc-30d0422f59c9'),
('8dda953c-5b55-45e1-9572-85413fc0d023', 'Magic The Gathering Commander 1st friendly match6', 'active', '2024-05-28 22:19:49', 'Magic The Gathering Commander 1st friendly match6', '2024-05-31', '05:19:02', 'd30c7513-cf82-4c9e-83c4-93fdbbf11d00.jpeg', '3594f82f-e3bf-11ee-9efc-30d0422f59c9'),
('abcefec9-f6cd-484c-aec3-a2528b8d13fd', 'Magic The Gathering Commander 1st friendly match5', 'active', '2024-05-29 22:37:48', 'Magic The Gathering Commander 1st friendly match5', '2024-05-30', '05:40:56', '80e9d2ce-a099-4290-9ff3-a7406d2ce699.jpeg', '3594f82f-e3bf-11ee-9efc-30d0422f59c9'),
('afd1cff1-896b-41b7-b9b9-343b54b75787', 'worapakorn3', 'unActive', '2024-05-16 23:21:46', 'worapakorn3', '0000-00-00', '00:30:15', '3993650b-a077-4f10-8d0f-118610cf4088.jpeg', '3594f82f-e3bf-11ee-9efc-30d0422f59c9'),
('bb01e568-a767-47d2-993c-f5407bffd3e3', 'Magic The Gathering Commander 1st friendly match', 'active', '2024-09-05 00:24:39', 'Magic The Gathering Commander 1st friendly match', '2024-09-05', '07:24:39', '130bc090-c1d8-42f9-a1a0-f89b850c8fbb.jpeg', '3594f82f-e3bf-11ee-9efc-30d0422f59c9'),
('cb8d87cf-6d4d-4c40-a7d4-eea8e9b778e9', 'worapakorn4', 'active', '2024-05-16 23:49:07', 'worapakorn4', '2024-05-19', '00:30:37', '68b8896f-77f4-4a35-b83d-3399b5259ef1.jpeg', '3594f82f-e3bf-11ee-9efc-30d0422f59c9'),
('d04b9811-8c62-4317-a2e9-cf245940d0d3', 'worapakorn5', 'active', '2024-05-16 23:51:23', 'worapakorn5', '2024-05-20', '12:30:07', 'd59d580b-78c7-4f84-9f9e-0ee72e2c8b49.jpeg', '3594f82f-e3bf-11ee-9efc-30d0422f59c9'),
('da2739e7-5b98-4dc0-84c4-ae385e76e5e7', 'test name activity', 'unActive', '2567-09-02 23:07:00', 'detail_post activity', '2567-09-03', '06:07:00', '84a92030-0801-43fa-abe3-e4410210b701.png', '3594f82f-e3bf-11ee-9efc-30d0422f59c9'),
('dd63911d-4a18-4725-bb35-5c5d1427dbf8', 'Magic The Gathering Commander 1st friendly match', 'active', '2024-05-17 00:05:26', 'Magic The Gathering Commander 1st friendly match', '2024-05-20', '12:30:32', 'f69847ca-f30e-4c47-aff8-8aee11d9214c.jpeg', '3594f82f-e3bf-11ee-9efc-30d0422f59c9'),
('e6753193-ba8b-4940-91af-c6b5a4542fb7', 'Magic The Gathering Commander 1st friendly match5', 'active', '2024-05-28 01:13:45', 'Magic The Gathering Commander 1st friendly match5', '2024-05-30', '08:11:52', '2c3319b6-271b-4db9-a1fd-1d79377b0970.jpeg', '3594f82f-e3bf-11ee-9efc-30d0422f59c9'),
('e8d0efc0-fb82-4ce0-8f8e-039e33db00a3', 'Magic The Gathering Commander 1st friendly match7', 'active', '2024-05-29 22:41:04', 'Magic The Gathering Commander 1st friendly match7', '2024-06-01', '05:45:29', '7bb0d027-f49a-4f8d-8fda-6c95815ea2c0.jpeg', '3594f82f-e3bf-11ee-9efc-30d0422f59c9'),
('ec7cd51d-2795-434b-8ae2-cb4af529e751', 'Magic The Gathering Commander 1st friendly match6', 'active', '2024-05-29 22:39:00', 'Magic The Gathering Commander 1st friendly match6', '2024-05-30', '06:43:33', '43e2b6bb-36ae-4925-9521-cd6514125bf3.jpeg', '3594f82f-e3bf-11ee-9efc-30d0422f59c9'),
('efdb8554-98f9-4dc7-96ac-10e402191682', '', 'active', '2024-05-27 03:54:28', '', '2024-05-27', '10:52:17', '', '3594f82f-e3bf-11ee-9efc-30d0422f59c9'),
('feac70f1-465c-40c8-bc1f-3e4377532ace', 'worapakorn2', 'unActive', '0000-00-00 00:00:00', 'worapakorn2', '0000-00-00', '00:30:53', 'ee9eb2a3-4d25-421a-afb3-e88fbf1768b9.jpeg', '3594f82f-e3bf-11ee-9efc-30d0422f59c9');

-- --------------------------------------------------------

--
-- Table structure for table `post_games`
--

CREATE TABLE `post_games` (
  `post_games_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `name_games` varchar(50) NOT NULL,
  `detail_post` varchar(255) NOT NULL,
  `num_people` int(11) NOT NULL,
  `date_meet` date NOT NULL,
  `time_meet` time NOT NULL,
  `games_image` varchar(255) DEFAULT NULL,
  `creation_date` datetime NOT NULL,
  `status_post` varchar(20) NOT NULL,
  `users_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `post_games`
--

INSERT INTO `post_games` (`post_games_id`, `name_games`, `detail_post`, `num_people`, `date_meet`, `time_meet`, `games_image`, `creation_date`, `status_post`, `users_id`) VALUES
('0799009b-7e03-4f44-9a6b-e96ce4028166', 'Magic The Gathering Commander 1st friendly match', 'Magic The Gathering Commander 1st friendly match', 75, '2024-05-30', '07:45:35', 'f2c3bc30-5016-4c89-b530-496b158015e1.jpeg', '2024-05-20 00:46:03', 'active', '48b0a732-b292-4cf8-bdd2-52156f177587'),
('09cb699f-6daf-4c37-8aec-d02eb7296870', 'Werewolf', 'เอา Werewolf ตัวเสริมมาด้วยก็ดีนะ เพราะเรามีแค่ตัวหลัก', 10, '2024-05-31', '13:30:47', '6b4096e3-7ede-4d78-bfbf-cdc50e6934cc.jpeg', '2024-05-18 00:06:00', 'active', '48b0a732-b292-4cf8-bdd2-52156f177587'),
('1087a586-16c5-44c2-b3ad-75a969380c0f', 'worapakorn', 'worapakorn', 10, '2024-05-31', '10:17:09', 'e74035ec-b731-43d2-a72c-4a7c3782763f.jpeg', '2024-05-18 03:17:31', 'active', '48b0a732-b292-4cf8-bdd2-52156f177587'),
('1f287c54-f8ea-4b62-b143-60cb7361faf6', 'test name_games activity5', 'detail_post', 2, '2567-09-03', '06:07:00', 'de87361b-2a8a-4b2f-9ed4-e4980ead602d.png', '2567-09-02 23:07:00', 'unActive', 'a4fa154b-a15a-45fe-b04f-2f9c61a8f2fa'),
('1f3586a9-073b-4e6d-8d56-638f9e55f021', 'Werewolf', 'เอา Werewolf ตัวเสริมมาด้วยก็ดีนะ เพราะเรามีแค่ตัวหลัก', 10, '2024-05-31', '13:30:10', 'ad9b1ebe-0253-4959-a172-fdfdc35040a0.jpeg', '2024-05-18 00:07:40', 'active', '48b0a732-b292-4cf8-bdd2-52156f177587'),
('1f76e56c-4794-4d67-9069-c658c7fefa39', 'Werewolf2', 'เอา Werewolf ตัวเสริมมาด้วยก็ดีนะ เพราะเรามีแค่ตัวหลัก 2', 2, '2024-05-11', '03:04:11', '80a37db0-1cc2-49d1-841e-81dfbddcb547.jpeg', '2024-05-10 20:05:27', 'active', '48b0a732-b292-4cf8-bdd2-52156f177587'),
('2238ed96-8b67-4197-93c4-c0955bc86e55', 'worapakorn2', 'worapakorn2', 5, '2024-05-14', '05:05:33', '137c5375-6708-4dd4-8a22-d243090a93b5.jpeg', '2024-05-13 22:06:43', 'active', '217affca-a63a-429d-abed-c3c34498a1a8'),
('2249c1cf-ba11-4626-8bdf-c7da771d96f2', 'worapakorn', 'worapakorn888', 2, '2024-05-07', '10:08:21', 'e059729f-da9a-47c2-a25d-3666f1d64353.jpeg', '2024-05-07 03:08:42', 'active', '48b0a732-b292-4cf8-bdd2-52156f177587'),
('3e880cb6-4a0a-41bf-9bcd-71428395565e', 'worapakorn', 'worapakorn999', 2, '2024-05-07', '10:11:41', '5f8a011f-e217-4cce-9f64-bd1c012a581e.jpeg', '2024-05-07 03:13:18', 'active', '48b0a732-b292-4cf8-bdd2-52156f177587'),
('4254123c-e971-4c53-b2de-7a6efc1fd29a', 'worapakorn', 'worapakorn131313', 2, '2024-05-07', '10:31:30', '03a85a72-8cc2-44a9-a1b0-fc0090ff8a83.jpeg', '2024-05-07 03:32:15', 'active', '48b0a732-b292-4cf8-bdd2-52156f177587'),
('4c52f3c5-353d-4532-8de0-80fc7864b781', 'worapakorn', 'worapakorn', 10, '2024-05-18', '05:40:39', 'e6fd69e3-cd34-40bb-b7a4-30d3c41d719a.jpeg', '2024-05-16 22:41:04', 'active', '48b0a732-b292-4cf8-bdd2-52156f177587'),
('56703a58-07cf-43fe-aaad-244fcadad693', 'Werewolf', 'เอา Werewolf ตัวเสริมมาด้วยก็ดีนะ เพราะเรามีแค่ตัวหลัก', 5, '2024-05-11', '08:09:57', '46fb8266-adef-4731-b678-5fee35256081.jpeg', '2024-05-08 01:10:53', 'active', '48b0a732-b292-4cf8-bdd2-52156f177587'),
('5b1075dd-7ee3-4ff8-b856-0dc0769eee2e', 'worapakorn', 'worapakorn101010', 2, '2024-05-07', '10:14:42', 'b219f702-7a28-4016-9637-bcebb3e5d495.jpeg', '2024-05-07 03:15:22', 'active', '48b0a732-b292-4cf8-bdd2-52156f177587'),
('6f5adef4-f18d-4281-b965-9082978fce71', 'test name_games activity5', 'detail_post', 2, '2567-09-03', '06:07:00', '32ba221e-ece7-4ea0-b3a8-e9b3b1740021.jpeg', '2567-09-02 23:07:00', 'unActive', '48b0a732-b292-4cf8-bdd2-52156f177587'),
('84c5bbef-5d9f-4701-af39-261ab71fb9af', 'Werewolf', 'เอา Werewolf ตัวเสริมมาด้วยก็ดีนะ เพราะเรามีแค่ตัวหลัก', 75, '2024-05-31', '10:38:22', '6d1ec406-2ed9-4fe3-bc5e-1b92501fdd30.jpeg', '2024-05-27 03:39:37', 'active', '48b0a732-b292-4cf8-bdd2-52156f177587'),
('86e067f1-99b9-41a7-9ca2-6e6f123fb06a', 'ohyo', 'ohyo', 12, '2024-06-25', '16:28:55', '4bcdd5df-8936-4169-9a2a-7b2598bca117.png', '2024-06-24 09:25:28', 'active', 'fdbb2c65-631c-4ab4-9546-3b4f40de7fe6'),
('87b525f0-7cb3-4a98-bcbe-9a29907235f6', 'worapakorn', 'worapakorn5555', 2, '2024-05-07', '07:57:04', '5e51f8fc-82a7-4065-83d7-eeb2c276897f.jpeg', '2024-05-07 01:03:54', 'active', '48b0a732-b292-4cf8-bdd2-52156f177587'),
('8a2842d0-89ab-433c-9aeb-67724ceb4290', 'test name_games activity5', 'detail_post', 2, '2567-09-03', '06:07:00', '10ee30b4-c806-4857-8c1b-f0e5ec6a15f0.jpeg', '2567-09-02 23:07:00', 'unActive', '48b0a732-b292-4cf8-bdd2-52156f177587'),
('8a461915-6198-4b1a-99bb-65a14687a0fa', 'worapakorn', 'worapakorn', 2, '2024-05-13', '07:23:09', '430fa2d8-134b-4289-9e18-bef9dc5df27a.jpeg', '2024-05-13 00:23:42', 'active', '217affca-a63a-429d-abed-c3c34498a1a8'),
('8c2ff04c-4cc6-42b4-aae4-262891b9d970', 'Werewolf5', 'เอา Werewolf5 ตัวเสริมมาด้วยก็ดีนะ เพราะเรามีแค่ตัวหลัก', 75, '2024-06-30', '08:14:39', '15470ce5-bbfe-4551-8319-3a5000ae9e62.jpeg', '2024-06-01 01:11:52', 'active', '48b0a732-b292-4cf8-bdd2-52156f177587'),
('9481abb8-0aa5-4ab6-a2b6-a65998110010', 'Werewolf3', 'เอา Werewolf ตัวเสริมมาด้วยก็ดีนะ เพราะเรามีแค่ตัวหลัก', 74, '2024-05-30', '06:30:18', '2e0c0d0a-b71c-486b-a57f-7d85b6f7d558.jpeg', '2024-05-29 22:18:54', 'active', '48b0a732-b292-4cf8-bdd2-52156f177587'),
('966ede8d-1cd0-455d-a00c-c2bd84d5665a', 'Werewolf2', 'เอา Werewolf2 ตัวเสริมมาด้วยก็ดีนะ เพราะเรามีแค่ตัวหลัก', 75, '2024-05-31', '04:43:12', '9934fb79-65c0-4e18-a80f-97422873fa6c.jpeg', '2024-05-28 21:45:34', 'active', '48b0a732-b292-4cf8-bdd2-52156f177587'),
('9b299d0e-9ac9-4f90-a391-edb656b02715', 'test name_games activity5', 'detail_post', 2, '2567-09-03', '06:07:00', '4d9b0d70-118f-4778-bd59-4c1c6580856a.jpeg', '2567-09-02 23:07:00', 'unActive', '48b0a732-b292-4cf8-bdd2-52156f177587'),
('9fbf2424-dfa0-45cd-a4fc-4cde2fff67cb', 'worapakorn', 'worapakorn6666', 2, '2024-05-07', '08:04:36', 'c98266f5-c9ec-4880-a11c-d76052512198.jpeg', '2024-05-07 01:05:02', 'active', '48b0a732-b292-4cf8-bdd2-52156f177587'),
('acbe805d-62df-46fd-ba02-96b57c52e40e', 'Werewolf', 'เอา Werewolf ตัวเสริมมาด้วยก็ดีนะ เพราะเรามีแค่ตัวหลัก', 75, '2024-05-31', '11:23:43', 'ca461861-e5c2-4cd7-94bf-2234fca4846e.jpeg', '2024-05-27 03:29:04', 'active', '48b0a732-b292-4cf8-bdd2-52156f177587'),
('c156bc8b-948a-4de2-8d50-d6b153f47a95', 'worapakorn', 'worapakorn1111', 2, '2024-05-07', '10:21:31', 'b6d3721e-546c-48bd-b1d7-cd155b589285.jpeg', '2024-05-07 03:21:59', 'active', '48b0a732-b292-4cf8-bdd2-52156f177587'),
('e2743413-ac96-4884-b645-9ee77b43d571', 'Werewolf4', 'เอา Werewolf4 ตัวเสริมมาด้วยก็ดีนะ เพราะเรามีแค่ตัวหลัก', 2, '2024-05-30', '05:31:16', '670594ee-4931-4e88-b142-f418ea8a399c.jpeg', '2024-05-29 22:27:33', 'active', '48b0a732-b292-4cf8-bdd2-52156f177587'),
('f863268c-eade-4e43-9ac4-11b35bb536a4', 'worapakorn', 'worapakorn121212', 2, '2024-05-07', '10:28:35', 'ce214037-df75-4dfd-8908-3983e1b73f62.jpeg', '2024-05-07 03:29:43', 'active', '48b0a732-b292-4cf8-bdd2-52156f177587'),
('fefda2f7-d581-414e-b6c3-2abe223dfffc', 'worapakorn', 'worapakorn77777', 2, '2024-05-07', '08:10:24', 'dea8c352-653c-4b89-8eed-b5c8407321e7.jpeg', '2024-05-07 01:11:30', 'active', '48b0a732-b292-4cf8-bdd2-52156f177587');

-- --------------------------------------------------------

--
-- Table structure for table `store`
--

CREATE TABLE `store` (
  `store_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `name_store` varchar(50) NOT NULL,
  `phone_number` varchar(20) DEFAULT NULL,
  `house_number` varchar(10) DEFAULT NULL,
  `alley` varchar(10) DEFAULT NULL,
  `road` varchar(100) DEFAULT NULL,
  `district` varchar(100) DEFAULT NULL,
  `sub_district` varchar(100) DEFAULT NULL,
  `province` varchar(100) DEFAULT NULL,
  `store_image` varchar(255) DEFAULT NULL,
  `users_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `store`
--

INSERT INTO `store` (`store_id`, `name_store`, `phone_number`, `house_number`, `alley`, `road`, `district`, `sub_district`, `province`, `store_image`, `users_id`, `createdAt`, `updatedAt`) VALUES
('3594f82f-e3bf-11ee-9efc-30d0422f59c9', 'Outcast Gaming', '0623844415', '43/5', 'เทศบาล', 'ถนนราชดำเนิน (ถนนต้นสน)', 'เทศบาลนคร', 'ประตูองค์พระปฐมเจดีย์ฝั่งตลาดโต้รุ่ง ', 'นครปฐม', 'b3afd629-c2cb-4dfe-8657-157f9a567fb8.jpeg', 'a4fa154b-a15a-45fe-b04f-2f9c61a8f2fa', '2024-03-16 18:55:12', '2024-03-16 18:55:12');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `users_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `role` enum('user','admin','store') NOT NULL DEFAULT 'user',
  `first_name` varchar(50) NOT NULL,
  `last_name` varchar(50) NOT NULL,
  `birthday` date DEFAULT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone_number` varchar(20) DEFAULT NULL,
  `gender` varchar(10) DEFAULT NULL,
  `user_image` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`users_id`, `role`, `first_name`, `last_name`, `birthday`, `username`, `password`, `email`, `phone_number`, `gender`, `user_image`, `createdAt`, `updatedAt`) VALUES
('08c3ee6b-cc21-48e2-861f-e445e135f4c1', 'user', 'Worapakorn41', 'Jarusiriphot41', '2003-03-17', 'WOJA41', '$2a$05$5qZtKGJNpdX47j/f7ZlqC.BWJFbiOaYF2tJNUfalINsLQHK0EfsiS', 'Worapakorn41@gmail.com', '0623844415', 'male', '8aa07fb8-0b73-4a63-ad39-33c93e961f08.jpeg', '2024-06-27 18:27:36', '2024-06-27 18:27:36'),
('0d0841f2-8602-44fe-98ce-39f9060d8989', 'user', 'วรปกร', 'จารุศิริพจน์', '2024-05-13', 'worapakorn20', '$2a$05$5cXHYoDVV9lzlSOTEK3.x.QVsWGjjMp6A3febp3vONcI4vUGvm2pO', 'worapakorn20@gmail.com', '0623844415', 'male', NULL, '2024-05-13 16:05:45', '2024-05-13 16:05:45'),
('1d743394-2297-4043-acad-5cf5da8bf3aa', 'user', 'Worapakorn5', 'Jarusiriphot5', '2003-03-17', 'WOJA5', '$2a$05$aoNV4TgyGzG9vrIysDtZBuYDlIVJZwP8UX7ZD6UETqqRsI/eB29O.', 'Worapakorn5@gmail.com', '0623844415', 'male', '9d728566-624b-4b27-bbb5-6d88b0a06d08.jpeg', '2024-05-02 07:20:18', '2024-05-02 07:20:18'),
('217affca-a63a-429d-abed-c3c34498a1a8', 'user', 'Worapakorn', 'Jarusiriphot', '1899-11-30', 'worapakorn13', '$2a$05$QtKSG5t7FN/OPhg4P5ZNaus6ZU5Qe9eHwNG7QJ8bYLrhqWHbGSB02', 'worapakorn13@gmail.com', '0623844415', 'ชาย', '4535cf0e-c467-4253-b62e-64917dcbcb52.png', '2024-05-02 08:05:58', '2024-06-03 22:55:50'),
('31139189-d3a7-4686-9b6f-1b3facc0c71b', 'user', 'Worapakornan', 'Jarusiriphot', '1997-06-10', 'worapakorn66', '$2a$05$hPli0.wWegnPxPVyiURDIO1e/rWH0L9RAjEDQuJJBKfBy9pw6yK2e', 'test2@test.com', '0623844415', 'ชาย', 'null', '2024-06-10 07:35:34', '2024-06-10 07:37:57'),
('39fb4df4-05c4-4be4-8777-351a9bce42e5', 'user', 'Worapakorn', 'Jarusiriphot', '2003-05-27', 'worapakorn40', '$2a$05$xyC2ZUM/qEP3jJEkOptbIOvYwVLsl9TGINoyjh18xaVg.rW7tk1IW', 'worapakorn40@gmail.com', '0623844415', 'ชาย', NULL, '2024-05-27 01:29:19', '2024-05-27 01:29:19'),
('3cb8cba9-874c-482e-bb5e-c5d523d77b7a', 'user', 'Worapakorn4', 'Jarusiriphot4', '2003-03-17', 'WOJA4', '$2a$05$utEVv0.UwHxyf4W7.dclk.xuet/gYs5tBXKg7RErPYkrM40Nza1ce', 'Worapakorn4@gmail.com', '0623844415', 'male', '4500b662-e071-40d8-946b-eb31ed2dcf4f.jpeg', '2024-05-01 23:51:51', '2024-05-01 23:51:51'),
('43d2d283-2ed8-45be-a03a-ebf70bc73e9e', 'user', 'Worapakorn16', 'Jarusiriphot16', '2024-05-02', 'worapakorn16', '$2a$05$uxXWaertuvbSvaPMfjniQOjANcqhJRy.DuoBKb8qyud1N4zW9n2GW', 'worapakorn16@gmail.com', '0623844415', 'male', NULL, '2024-05-02 08:12:38', '2024-05-02 08:12:38'),
('48b0a732-b292-4cf8-bdd2-52156f177587', 'user', 'Worapakorn2', 'Jarusiriphot2', '0000-00-00', 'WOJA2', '$2a$05$QBaCeUAZSpMIiIUj0d.Vl.Sdo/upREsHQUftbGrhtjWkjkFtvnkju', 'Worapakorn2@gmail.com', '0623844415', 'ชาย', 'a84f9cd9-3c1d-4cb2-ba88-a188c298d119.jpeg', '2024-03-18 21:10:12', '2024-05-15 23:43:09'),
('4a15adb6-114e-4f62-b9a9-e24e67033b40', 'user', 'Worapakorn', 'Jarusiriphot', '2003-05-14', 'worapakorn33', '$2a$05$BtgQ/ua9zRTo3qv34sO.dOpr1UANoL0UTgPV1KfMTojgTXWROcEyy', 'worapakorn33@gmail.com', '0623844415', 'male', NULL, '2024-05-13 19:40:51', '2024-05-13 19:40:51'),
('5524d38c-ec43-4287-a8a6-f4e369720759', 'user', 'Worapakorn', 'Jarusiriphot', '2024-05-02', 'worapakorn11', '$2a$05$sLT4vNddWbeMLsi0r.ny4Ox2PjxkN.VatY45iZcR8kFj.QAtmDbQK', 'worapakorn11@gmail.com', '0623844415', NULL, NULL, '2024-05-02 07:56:38', '2024-05-02 07:56:38'),
('55bc7bd5-221d-4362-b459-151f08b63d33', 'user', 'Worapakorn17', 'Jarusiriphot17', '2024-05-02', 'worapakorn17', '$2a$05$Scjb3JhCeS1r6vWWCuA4FOafBGCnyy/mbWjZDLtbvOW1uCOxL4YKK', 'worapakorn17@gmail.com', '0623844415', 'female', NULL, '2024-05-02 09:33:01', '2024-05-02 09:33:01'),
('6924fe17-11b5-4742-a762-d57fb8872799', 'user', 'Worapakorn', 'Jarusiriphot', '2003-05-14', 'worapakorn31', '$2a$05$AVm/VDu2EiHM9D5KXJ8N1OeQCPYA1NfgHXQKgFSLz1Bx8a1b8ynnu', 'worapakorn31@gmail.com', '0623844415', 'male', NULL, '2024-05-13 19:07:07', '2024-05-13 19:07:07'),
('6db42122-a96e-41d6-ac43-d49d371e5c4e', 'user', 'Worapakorn', 'Jarusiriphot', '1998-06-20', 'worapakorn55', '$2a$05$6ev1a78q//pggMj7UtvDvuqwGIfa7QodcTLuK7YkXFYbgXy6XGSO2', 'test@test.com', '+6610255458', 'ชาย', NULL, '2024-06-10 07:31:10', '2024-06-10 07:31:10'),
('772a42ab-1494-48f6-95aa-aa8419a1b710', 'user', 'Worapakorn15', 'Jarusiriphot15', '2024-05-02', 'worapakorn15', '$2a$05$yLPuTsbMt7mXniYmERxgTe88YRlpDqE31Ub3G4h71YNJHRGwPJkNi', 'worapakorn15@gmail.com', '0623844415', 'male', NULL, '2024-05-02 08:12:11', '2024-05-02 08:12:11'),
('773c90ac-2954-4d93-9f1d-bec08dd0032d', 'user', 'วรปกร', 'จารุศิริพจน์', '1990-01-01', 'worapakorn123', '$2a$05$RZIeTomwyP.U3c1KS6DL1eyJus/VFAO/SpQ6DPnQoBQwQoxAiFyia', 'worapakorn123@gmail.com', '0623844415', 'ชาย', NULL, '2024-06-25 20:28:29', '2024-06-25 20:28:29'),
('7849a767-b58b-4731-9f32-28cd9bcd87b0', 'user', 'Worapakorn6', 'Jarusiriphot6', '2003-03-17', 'WOJA6', '$2a$05$huYC9TbeaiHkLjC.pm7NkukDMoFnZI/hWM9S1SpRmcsMbC7JzoCqy', 'Worapakorn6@gmail.com', '0623844415', 'male', '56e79869-4dcb-4648-9b25-e2c05a22064f.jpeg', '2024-05-04 01:20:33', '2024-05-04 01:20:33'),
('99d0a968-6831-4735-9b34-fdbc6c3f0232', 'user', 'Worapakorn3', 'Jarusiriphot3', '2003-03-17', 'WOJA3', '$2a$05$eEhT3Fk6CPEos0iLbV4BQenKml07D3cpGzxUy5K3d2CCIeZ6EMIoW', 'Worapakorn3@gmail.com', '0623844415', 'male', '74d88d25-58df-4367-a016-b914c68eb594.jpeg', '2024-05-01 23:11:24', '2024-05-01 23:11:24'),
('9df694f5-e120-4932-8913-061fe62d9429', 'user', 'Worapakorn', 'Jarusiriphot', '2003-05-14', 'worapakorn36', '$2a$05$jwje2yh9HZLcKJfryQdJ/OtumnXM3SzkTVzbPdmQaLy.VezRZN7Uy', 'worapakorn36@gmail.com', '0623844415', 'male', NULL, '2024-05-13 19:57:57', '2024-05-13 19:57:57'),
('9f144286-330f-44c5-aaa3-0230b2e4f345', 'store', 'Worapakorn55555', 'Jarusiriphot55555', '2006-04-13', 'WOJA42', '$2a$05$ngnadpLV/fvvysGEq7hYGuLcYcXaOdInGn9IqIEogIRcnGVf94KPO', 'Worapakorn42@gmail.com', '0818144499', 'หญิง', '530cf75d-eeba-41ec-b7d8-403cceb8f268.jpeg', '2024-06-27 18:28:37', '2024-06-27 18:48:46'),
('a4fa154b-a15a-45fe-b04f-2f9c61a8f2fa', 'store', 'Outcast', 'Gaming', '0000-00-00', 'Outcast', '$2a$05$5thpelPigab8mxvVrMfYB.pCUqURd/vgBJDm3oiFDBp9CwQXwGpfG', 'Outcast@gmail.com', '0989269328', 'male', 'b3afd629-c2cb-4dfe-8657-157f9a567fb8.jpeg', '2024-03-16 16:01:58', '2024-05-16 02:01:10'),
('a6cfde21-8ca6-4670-8bb7-870f2efe0634', 'user', 'Worapakorn', 'Jarusiriphot', '2003-05-26', 'worapakorn39', '$2a$05$HHcwxJL7niH0qOZlK/KvFeU6kAvfzcwDgXOvfLBSYL/jOPFNaM2F6', 'worapakorn39@gmail.com', '0623844415', 'ชาย', NULL, '2024-05-26 05:15:20', '2024-05-26 05:15:20'),
('a7d63ad8-1a67-423f-8a0b-bdd1fadb1e27', 'user', 'Worapakorn', 'Jarusiriphot', '2003-05-14', 'worapakorn37', '$2a$05$DQohUmK1WzU/OFZH3FG/SevWXqegR1sDtjwKC/9kQnooZNlEhCcfO', 'worapakorn37@gmail.com', '0623844415', NULL, NULL, '2024-05-13 20:19:54', '2024-05-13 20:19:54'),
('a9f76e03-0fb7-48bd-b513-2fb5b91f25fb', 'user', 'Worapakorn', 'Jarusiriphot', '2024-05-02', 'worapakorn12', '$2a$05$S/szU0UxlM5S94qsGgOL4OWfkua4KBWMakHz3qoAxZAp3Zrqy77HS', 'worapakorn12@gmail.com', '0623844415', NULL, NULL, '2024-05-02 08:02:43', '2024-05-02 08:02:43'),
('b208cf0b-b429-42ab-9e92-b464a87068be', 'user', 'Worapakorn', 'Jarusiriphot', '2003-05-26', 'worapakorn38', '$2a$05$h7JXlmSS0cRpiFURMmBQSeuCKwds9VInwP7a7vUTpYma4MeHQAivO', 'worapakorn38@gmail.com', '0623844415', 'ชาย', NULL, '2024-05-26 05:12:34', '2024-05-26 05:12:34'),
('b365a311-4b59-4924-a34a-cc9a4d870aed', 'user', 'Worapakorn', 'Jarusiriphot', '2003-05-14', 'worapakorn34', '$2a$05$3M7bXAgvhrhuwtVRqNI9hOPLEss52/6ZegJLPNQtOZEHF9tWHpVBC', 'worapakorn34@gmail.com', '0623844415', 'male', NULL, '2024-05-13 19:42:41', '2024-05-13 19:42:41'),
('b805acd8-f410-41ca-9961-5a25e8db7ccf', 'user', 'Worapakorn', 'Jarusiriphot', '2024-05-02', 'worapakorn10', '$2a$05$iH3TaMlD5YZqYJY7zr0y8.nMRtOSQJnboirTLrCSPUlxF57s4w4B2', 'worapakorn10@gmail.com', '0623844415', NULL, NULL, '2024-05-02 07:51:26', '2024-05-02 07:51:26'),
('c574677a-f7ea-411d-93c4-da54ac227628', 'user', 'Worapakorn18', 'Jarusiriphot18', '0000-00-00', 'worapakorn18', '$2a$05$2c9xPYKz9RZX18UKQViGueQtT9oOa5tUsr/s4zn/Lp8q9zcMo8.YS', 'worapakorn18@gmail.com', '0623844415', 'male', 'ae1601d9-2262-40a7-a76b-6371e16cb973.png', '2024-05-02 19:21:27', '2024-05-21 04:40:36'),
('c993c21e-45fe-4285-b985-e2bb84d147be', 'user', 'Worapakorn', 'Jarusiriphot', '2024-05-13', 'worapakorn22', '$2a$05$ecMfM2ZH3dGKUmgDTiHdyOjADQRKZMh/nz/kgd50qwc2HFhLE0iQS', 'worapakorn22@gmail.com', '0623844415', 'male', NULL, '2024-05-13 16:42:41', '2024-05-13 16:42:41'),
('d1a4ace1-596c-41af-bc75-419465123a94', 'user', 'Worapakorn19', 'Jarusiriphot91', '2024-05-03', 'worapakorn19', '$2a$05$GkoXAcTqfl4o6JEs7X9O7eA71kfYTvGFs00nNrmoS8cQELerkfQiu', 'worapakorn19@gmail.com', '0623844415', 'male', NULL, '2024-05-02 19:36:33', '2024-05-02 19:36:33'),
('d6506eee-7f7b-4aeb-a514-57776263bed0', 'user', 'Worapakorn', 'Jarusiriphot', '2003-05-14', 'worapakorn', '$2a$05$RGoyCCv6qiDg5F4wHzxaQOQkajSGIYIVveIhVb72W/QREh4vRsEZm', 'worapakorn28@gmail.com', '0623844415', 'male', NULL, '2024-05-13 18:47:31', '2024-05-13 18:47:31'),
('d80ebc57-5504-48af-acfa-30ef6321f1e1', 'user', 'Worapakorn', 'Jarusiriphot', '2003-05-14', 'worapakorn35', '$2a$05$XStQDPlKrpLSSsLD5c81Yud7Cb.kY3tv2WKlkAuXpHYYPFOhi6QCy', 'worapakorn35@gmail.com', '0623844415', 'male', NULL, '2024-05-13 19:51:05', '2024-05-13 19:51:05'),
('e297c638-60cb-449a-bbcf-77315f1c00df', 'user', 'Worapakorn', 'Jarusiriphot', '2024-05-02', 'worapakorn14', '$2a$05$Qrdzmk0cbn0lD2B0ZncOhu3urbFfZ3vBFa50VXkwT/5liwWeHugye', 'worapakorn14@gmail.com', '0623844415', 'male', NULL, '2024-05-02 08:07:01', '2024-05-02 08:07:01'),
('e94e5cc3-5305-46ef-a900-6d53386c3cb7', 'user', 'Worapakorn27', 'Jarusiriphot27', '2003-05-14', 'worapakorn27', '$2a$05$211kCdvp831aUu/Z0GIPb.9iCs2R44fBcN9kRW5F5KDLoV88Db2Ri', 'worapakorn27@gmail.com', '0623844415', 'male', NULL, '2024-05-13 18:46:31', '2024-05-13 18:46:31'),
('eba8cae4-5892-4f3e-a01e-7c9af80e4a10', 'user', 'Worapakorn', 'Jarusiriphot', '2003-05-14', 'worapakorn30', '$2a$05$ludypv4u05H.4aDbjnR5s.UhB1ZjPodWG2PytsotwUzflxF.hAyfu', 'worapakorn32@gmail.com', '0623844415', 'male', NULL, '2024-05-13 19:38:08', '2024-05-13 19:38:08'),
('eef3e313-05a0-4915-9dfb-94dfbaf0c64d', 'user', 'Worapakorn', 'Jarusiriphot', '1545-02-02', 'WOJA', '$2a$05$be3nKAaBmoS2YFamZoatTezl7tn8Pgj2BjKCU/2bOS8JeYXsmmKAe', 'Worapakorn@gmail.com', '0623844415', 'male', '4f549478-0715-45b7-8aea-04d4f349b6ee.png', '2024-03-16 18:07:13', '2024-03-16 18:07:13'),
('fdbb2c65-631c-4ab4-9546-3b4f40de7fe6', 'user', 'ohm', 'muy', '1985-06-18', 'ohmmuy6969', '$2a$05$RsDeBvD/FiSQtBEaDRjkeOSotNUStolcDkL4cZkOs55TfXEN6AxHq', 'ohmmuy@muy.com', '01232131312', 'ชาย', NULL, '2024-06-24 09:22:56', '2024-06-24 09:22:56');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `chat`
--
ALTER TABLE `chat`
  ADD PRIMARY KEY (`chat_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `post_games_id` (`post_games_id`);

--
-- Indexes for table `notification`
--
ALTER TABLE `notification`
  ADD PRIMARY KEY (`notification_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `participate`
--
ALTER TABLE `participate`
  ADD PRIMARY KEY (`part_Id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `post_games_id` (`post_games_id`);

--
-- Indexes for table `post_activity`
--
ALTER TABLE `post_activity`
  ADD PRIMARY KEY (`post_activity_id`),
  ADD KEY `store_id` (`store_id`);

--
-- Indexes for table `post_games`
--
ALTER TABLE `post_games`
  ADD PRIMARY KEY (`post_games_id`),
  ADD KEY `users_id` (`users_id`);

--
-- Indexes for table `store`
--
ALTER TABLE `store`
  ADD PRIMARY KEY (`store_id`),
  ADD KEY `users_id` (`users_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`users_id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `chat`
--
ALTER TABLE `chat`
  ADD CONSTRAINT `chat_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`users_id`),
  ADD CONSTRAINT `chat_ibfk_2` FOREIGN KEY (`post_games_id`) REFERENCES `post_games` (`post_games_id`);

--
-- Constraints for table `notification`
--
ALTER TABLE `notification`
  ADD CONSTRAINT `notification_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`users_id`);

--
-- Constraints for table `participate`
--
ALTER TABLE `participate`
  ADD CONSTRAINT `participate_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`users_id`),
  ADD CONSTRAINT `participate_ibfk_2` FOREIGN KEY (`post_games_id`) REFERENCES `post_games` (`post_games_id`);

--
-- Constraints for table `post_activity`
--
ALTER TABLE `post_activity`
  ADD CONSTRAINT `post_activity_ibfk_1` FOREIGN KEY (`store_id`) REFERENCES `store` (`store_id`);

--
-- Constraints for table `post_games`
--
ALTER TABLE `post_games`
  ADD CONSTRAINT `post_games_ibfk_1` FOREIGN KEY (`users_id`) REFERENCES `users` (`users_id`);

--
-- Constraints for table `store`
--
ALTER TABLE `store`
  ADD CONSTRAINT `store_ibfk_1` FOREIGN KEY (`users_id`) REFERENCES `users` (`users_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
