CREATE TABLE `users` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`email` text NOT NULL,
	`password` text NOT NULL,
	`publicKey` text,
	`privateKey` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_publicKey_unique` ON `users` (`publicKey`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_privateKey_unique` ON `users` (`privateKey`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_idx` ON `users` (`email`);--> statement-breakpoint
CREATE INDEX `users_public_key_idx` ON `users` (`publicKey`);--> statement-breakpoint
CREATE INDEX `users_private_key_idx` ON `users` (`privateKey`);