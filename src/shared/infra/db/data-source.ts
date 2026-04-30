import { DataSource } from "typeorm";
import * as path from "path";
import * as dotenv from 'dotenv';
dotenv.config({override: true});

export const AppDataSource = new DataSource({
    type: 'mysql',
    host: process.env.DB_HOST,
    port: 3306,
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    extra: {
        connectionLimit: 5
    },
    migrations: [path.join(__dirname, "migrations/**/*.{ts,js}")],
    entities:[
        path.join(__dirname, "../../../modules/catalog/infrastructure/persistence/entities/**/*.{ts,js}"),
        path.join(__dirname, "../../../modules/identity/infrastructure/persistence/entities/**/*.{ts,js}"),
        path.join(__dirname, "../../../modules/stock/infrastructure/persistence/entities/**/*.{ts,js}"),
    ]
})