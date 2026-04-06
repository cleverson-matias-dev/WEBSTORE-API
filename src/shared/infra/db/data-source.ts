import { DataSource } from "typeorm";
import * as path from "path";
import * as dotenv from 'dotenv';
dotenv.config({override: true});

export const AppDataSource = new DataSource({
    type: 'mysql',
    host: 'mysql',
    port: 3306,
    username: 'root',
    password: 'root',
    database: 'webstore_catalogo',
    entities:[
        path.join(__dirname, "../../../modules/catalog/infrastructure/persistence/entities/**/*.{ts,js}"),
        path.join(__dirname, "../../../modules/identity/infrastructure/persistence/entities/**/*.{ts,js}"),
    ]
})