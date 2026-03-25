import { DataSource } from "typeorm";
import * as path from "path";
import * as dotenv from 'dotenv';
dotenv.config({override: true});

export const AppDataSource = new DataSource({
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: '',
    //database: 'webstore_catalogo',
    entities:[
        path.join(__dirname, "../../../modules/catalogo/infrastructure/persistence/entities/**/*.{ts,js}")
    ]
})