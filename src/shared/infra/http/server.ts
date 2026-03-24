import express from 'express';
import catalogRoutes from '@modules/catalogo/infrastructure/http/routes/routes';
import { AppDataSource } from '../db/data-source';
import { errorHandler } from '@shared/middlewares/errorHandler';
import { loggerMiddleware } from '@shared/middlewares/loggerMiddleware';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(loggerMiddleware)
app.use(express.json());
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