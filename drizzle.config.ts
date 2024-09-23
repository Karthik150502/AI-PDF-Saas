
import type { Config } from "drizzle-kit";


export default {
    dialect: "postgresql",
    schema: './src/lib/db/schema.ts',
    dbCredentials: {
        url: process.env.DATABASE_URL!,
        // deprecated
        // connectionString: process.env.DATABASE_URL!,
    },

} satisfies Config