'use strict';

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { dbConnection } from './mongo.js';
import limiter from '../src/middlewares/validar-cant-peticiones.js';
import publicationRoutes from '../src/publications/publication.routes.js'
import commentRoutes from '../src/comments/comment.routes.js'

const middlewares = (app) => {
    app.use(express.urlencoded({ extended: false }));
    app.use(cors({
        origin: 'https://fronted-blog-pi.vercel.app',
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        credentials: true
    }));
    app.use(express.json());
    app.use(helmet());
    app.use(morgan('dev'));
    app.use(limiter);
}

const routes = (app) => {
    app.use("/blogAprendizaje/v1/publications", publicationRoutes);
    app.use("/blogAprendizaje/v1/comments", commentRoutes);
}

const conectarDB = async () => {
    try {
        await dbConnection();
        console.log("Conexión a la base de datos exitosa");
    } catch (error) {
        console.error('Error conectando a la base de datos', error);
        process.exit(1);
    }
}

export const initServer = async () => {
    const app = express();
    const port = process.env.PORT || 3000;

    try {
        middlewares(app);
        conectarDB();
        routes(app);
        app.listen(port);
        console.log(`Server running on port: ${port}`);
    } catch (err) {
        console.log(`Server init failed: ${err}`);
    }
}