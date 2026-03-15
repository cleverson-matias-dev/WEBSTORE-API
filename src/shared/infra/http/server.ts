import express from 'express';
import { AppDataSource } from '@shared/infra/db/data-source';
import categoryRoutes from '@modules/catalogo/infra/http/routes';

const app = express();
const PORT = process.env.PORT || 3000;


app.use(express.json());
app.use('/categorias', categoryRoutes);

AppDataSource.initialize().then(()=>{
    console.log("Banco de dados inicializado!");

    app.listen(PORT, (err) => {
        if(err) {
            console.error(err.message);
        }

        console.log(`App rodando na porta: ${PORT}`);
    })

}).catch(error => {
    console.log(`falha ao iniciar banco de dados, erro: ${error.code}`);
})