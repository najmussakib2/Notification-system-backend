/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { Application, Request, Response } from 'express';
import config from './app/config';
import globalErrorHandler from './app/middlewares/globalErrorhandler';
import notFound from './app/middlewares/notFound';
import router from './app/routes';
import http from 'http';
import { initSocket } from './socket io/socket.io';
import helmet from 'helmet';
import morgan from 'morgan';
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./app/config/swagger";

const app: Application = express();
const httpServer = http.createServer(app);
app.set("trust proxy", 1);
initSocket(httpServer);
//parsers
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: [config.origin_link as string], credentials: true }));
app.use(helmet());
app.use(morgan("dev"));

app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customSiteTitle: "NotifyHub API Docs",
  customCss: ".swagger-ui .topbar { display: none }",
}));
// application routes
app.use('/api/v1', router);

app.get('/', (req: Request, res: Response) => {
  const date = new Date(Date.now());
  res.send(`<h1 style="text-align:center; color:#173616; font-family:Verdana;">Beep-beep! The server is alive and kicking.</h1>
    <p style="text-align:center; color:#173616; font-family:Verdana;">${date}</p>
    `);
});

app.use(globalErrorHandler);

//Not Found
app.use(notFound);

export default app;
