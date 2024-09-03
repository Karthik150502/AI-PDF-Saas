
import type { Config } from "drizzle-kit";
import * as dotenv from "dotenv"

dotenv.config({ path: ".env" });

export default {
    dialect: "postgresql",
    schema: './src/lib/db/schema.ts',
    dbCredentials: {
        url: "postgresql://neondb_owner:lv4iVrsB6xbd@ep-wispy-paper-a1ir8kbe.ap-southeast-1.aws.neon.tech/neondb?sslmode=require",
        // connectionString: "postgresql://neondb_owner:lv4iVrsB6xbd@ep-wispy-paper-a1ir8kbe.ap-southeast-1.aws.neon.tech/neondb?sslmode=require"
    },

} satisfies Config