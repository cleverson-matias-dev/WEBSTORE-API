import express from 'express';
import categoryRoutes from '@modules/catalogo/infrastructure/http/routes';
import { AppDataSource } from '../db/data-source';

const app = express();
const PORT = process.env.PORT || 3000;


app.use(express.json());
app.use('/api', categoryRoutes);

AppDataSource.initialize().then(()=>{
    console.log("Banco de dados inicializado!");

    app.listen(PORT, (err) => {
        if(err) {
            console.error(err.message);
        }

        console.log(`App rodando na porta: ${PORT}`);
    })

}).catch(error => {
    console.log(`falha ao iniciar banco de dados, erro: ${error}`);
})