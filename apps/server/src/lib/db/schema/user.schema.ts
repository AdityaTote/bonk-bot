import {
	index,
	int,
	sqliteTable,
	text,
	uniqueIndex,
} from "drizzle-orm/sqlite-core";

export const users = sqliteTable(
	"users",
	{
		id: int().primaryKey({ autoIncrement: true }),
		email: text().notNull().unique(),
		password: text().notNull(),
		publicKey: text().unique(),
		privateKey: text().unique(),
	},
	(t) => [
		uniqueIndex("users_email_idx").on(t.email),
		index("users_public_key_idx").on(t.publicKey),
		index("users_private_key_idx").on(t.privateKey),
	]
);

export type IUser = typeof users.$inferSelect;
export type IPartialUser = Partial<typeof users.$inferInsert>;
export type INewUser = typeof users.$inferInsert;
