import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/lib/db";
import { users, accounts, sessions, verifications } from "@/lib/db/schema";

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "mysql",
        schema: {
            user: users,
            account: accounts,
            session: sessions,
            verificationToken: verifications,
        }
    }),
    emailAndPassword: {
        enabled: true,
        requireEmailVerification: false,
    },
});
