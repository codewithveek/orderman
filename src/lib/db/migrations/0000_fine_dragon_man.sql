CREATE TABLE `menu_items` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text NOT NULL,
	`price` decimal(10,2) NOT NULL,
	`image_url` varchar(500) NOT NULL,
	`category` varchar(100) NOT NULL,
	`available` int NOT NULL DEFAULT 1,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `menu_items_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `order_items` (
	`id` int AUTO_INCREMENT NOT NULL,
	`order_id` int NOT NULL,
	`menu_item_id` int NOT NULL,
	`quantity` int NOT NULL,
	`price_at_order` decimal(10,2) NOT NULL,
	`item_name` varchar(255) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `order_items_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `orders` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` varchar(255) NOT NULL,
	`status` enum('pending','confirmed','preparing','out_for_delivery','delivered','cancelled') NOT NULL DEFAULT 'pending',
	`total_amount` decimal(10,2) NOT NULL,
	`delivery_address` text NOT NULL,
	`delivery_phone` varchar(20) NOT NULL,
	`delivery_name` varchar(255) NOT NULL,
	`notes` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `orders_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` varchar(255) NOT NULL,
	`name` varchar(255) NOT NULL,
	`email` varchar(255) NOT NULL,
	`email_verified` timestamp,
	`image` varchar(255),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_email_unique` UNIQUE(`email`)
);
