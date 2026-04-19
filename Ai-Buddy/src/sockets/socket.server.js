import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import cookie from "cookie"; // correct parser

async function initSocketServer(httpServer) {
    const io = new Server(httpServer, {});

    io.use((socket, next) => {
        try {
            const cookies = socket.handshake.headers.cookie
                ? cookie.parse(socket.handshake.headers.cookie)
                : {};

            const token = cookies.token; // assuming cookie name = token

            if (!token) {
                return next(new Error("Authentication error"));
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            socket.user = decoded;

            next();
        } catch (err) {
            return next(new Error("Authentication error"));
        }
    });

    io.on("connection", (socket) => {
        console.log("User connected 💓", socket.user);
    });

    return io; // optional but useful
}

export default initSocketServer;