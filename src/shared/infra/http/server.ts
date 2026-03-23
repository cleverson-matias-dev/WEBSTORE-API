import express from 'express';
import catalogRoutes from '@modules/catalogo/infrastructure/http/routes/routes';
import { AppDataSource } from '../db/data-source';
import { errorHandler } from '@shared/middlewares/errorHandler';
import { correlationMiddleware } from '@shared/middlewares/correlation';

const app = express();
const PORT = process.env.PORT || 3000;


app.use(express.json());
app.use(correlationMiddleware);
app.use('/api', catalogRoutes);
app.use(errorHandler);

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