CREATE TABLE `auctionTeapots` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`artist` varchar(255),
	`auctionHouse` varchar(255),
	`auctionDate` timestamp,
	`estimatedPrice` varchar(100),
	`finalPrice` varchar(100),
	`description` text,
	`clayType` enum('purple','green','vermilion','duan','jiangpo'),
	`shapeType` varchar(100),
	`photos` json NOT NULL,
	`sourceUrl` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `auctionTeapots_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `classicTeapots` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`artist` varchar(255) NOT NULL,
	`dynasty` varchar(100),
	`description` text,
	`clayType` enum('purple','green','vermilion','duan','jiangpo'),
	`shapeType` varchar(100),
	`photos` json NOT NULL,
	`referenceUrl` text,
	`contourData` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `classicTeapots_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `collections` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`teapotId` int NOT NULL,
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `collections_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `comments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int,
	`authorName` varchar(255),
	`teapotId` int,
	`content` text NOT NULL,
	`photos` json,
	`status` enum('pending','approved','rejected') NOT NULL DEFAULT 'pending',
	`reviewedBy` int,
	`reviewedAt` timestamp,
	`reviewNote` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `comments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `teapots` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	`clayType` enum('purple','green','vermilion','duan','jiangpo') NOT NULL,
	`claySubtype` varchar(100),
	`craftType` enum('full_handmade','semi_handmade','slip_casting','wheel_thrown'),
	`shapeType` varchar(100),
	`shapeMatchScore` int,
	`aiAnalyzed` boolean DEFAULT false,
	`manualCorrected` boolean DEFAULT false,
	`photos` json NOT NULL,
	`status` enum('pending','approved','rejected') NOT NULL DEFAULT 'pending',
	`isPublic` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `teapots_id` PRIMARY KEY(`id`)
);
