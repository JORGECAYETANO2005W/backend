// Este archivo configura la aplicación principal de Express para el backend. 
// Aquí se incluyen middlewares como morgan, cors y cookie-parser, y se montan las rutas de autenticación y tareas.
// Esto actúa como el núcleo del servidor, manejando la configuración global y la integración de rutas.

// Importar módulos principales
import mongoose from "mongoose"; 
import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import cors from "cors";
import session from "express-session";
import MongoStore from "connect-mongo";
import { connectDB } from "./db.js"; 
import authRoutes from "./routes/auth.routes.js";
import productRoutes from "./routes/products.routes.js";
import categoryRoutes from "./routes/category.routes.js";
import marcaRoutes from "./routes/marca.routes.js"
import visionRoutes from "./routes/vision.routes.js";
import misionRoutes from "./routes/mision.routes.js";
import politicasRoutes from "./routes/politicas.routes.js";
import preguntasFre from "./routes/preguntas.routes.js";
import ubicacion from "./routes/ubicacion.routes.js";
import redesSociales from "./routes/redes.sociales.routes.js";
import dispositivo from "./routes/dispositivos.routes.js";
import estadoDispositivoo from "./routes/estadoDispositivo.routes.js"
import contacto from "./routes/contacto.routes.js"
import citas from "./routes/citas.routes.js"

// Cargar las variables de entorno
dotenv.config();

const app = express();

// Configuración de CORS
const allowedOrigins = ["http://localhost:8081", "http://localhost:5173","https://lovely-caramel-3aa9ae.netlify.app","https://huellitasa.netlify.app"];
app.use(cors({
    origin: function(origin, callback) {
        // Allow requests with no origin (like mobile apps, curl requests)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            return callback(new Error('The CORS policy for this site does not allow access from the specified origin.'), false);
        }
        return callback(null, true);
    },
    credentials: true
}));

app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());


connectDB();

// Configuración de la sesión
app.use(session({
    secret: process.env.SESSION_SECRET || "super_secret_key",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        client: mongoose.connection.getClient(), // Usar la conexión existente de mongoose
        collectionName: "sessions",
        ttl: 10 * 60, // 10 minutos
        autoRemove: 'native'
    }),
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 10 * 60 * 1000 // 10 minutos
    }
}));

// Montar las rutas
app.use("/api", authRoutes);
app.use("/api", productRoutes);
app.use("/api", categoryRoutes);
app.use("/api", marcaRoutes);
app.use("/api", visionRoutes);
app.use("/api", misionRoutes);
app.use("/api", politicasRoutes);
app.use("/api", preguntasFre);
app.use("/api", ubicacion);
app.use("/api", redesSociales);
app.use("/api", dispositivo);
app.use("/api",estadoDispositivoo);
app.use("/api",contacto)
app.use("/api",citas)


export default app;

