/* eslint-disable @typescript-eslint/no-explicit-any */
import { Server, Socket } from 'socket.io';
import { Server as HttpServer } from "http";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from '../app/config';
let io: Server;

export const initSocket = (httpServer: HttpServer) => {
    io = new Server(httpServer, {
        path: '/socket.io',
        pingTimeout: 60000,
        cors: {
            origin: config.origin_link as string,
            methods: ['GET', 'POST'],
            credentials: true,
            allowedHeaders: ['Content-Type', 'Authorization'],
        },
    });

    io.use((socket: Socket, next) => {
        const token = socket.handshake.auth.token;
        if (!token) return next(new Error("Unauthorized"));
        try {
            const decoded = jwt.verify(token, config.jwt_access_secret as string) as { id: string };
            (socket as any).tenantId = decoded.id;
            next();
        } catch {
            next(new Error("Invalid token"));
        }
    });

    io.on("connection", (socket: Socket) => {
        const token = socket.handshake.auth.token;
        const decoded = jwt.verify(token, config.jwt_access_secret as string) as JwtPayload;
        const tenantId = decoded.userId;
        socket.join(`tenant:${tenantId}`);
        console.log(`Client connected: ${tenantId}`);
        socket.on("disconnect", () => console.log(`Client disconnected: ${tenantId}`));
    });

    return io;
};

export const getIO = () => {
    if (!io) throw new Error("Socket.io not initialized");
    return io;
};