import mysql from "mysql2/promise";
import "dotenv/config";

const pool = mysql.createPool({
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT) || 33067,
    database: process.env.DB_NAME || "marsaifestival",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    waitForConnections: true,
    connectionLimit: 10,
});

export default pool;
