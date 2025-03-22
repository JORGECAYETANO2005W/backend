import { Router } from 'express';
import { authRequired } from '../middlewares/validateToken.js'; // Middleware para verificar autenticación
import {
    getCitas,       // Controlador para obtener todas las citas
    getCita,         // Controlador para obtener una cita específica
    createCita,      // Controlador para crear una nueva cita
    updateCita,      // Controlador para actualizar una cita existente
    deleteCita,
    getCitasByUser       // Controlador para eliminar una cita
} from '../controllers/citas.controller.js';
import { validateSchema } from '../middlewares/validator.middlewar.js'; // Middleware para validar los datos según un esquema
import { createCitaSchema } from '../schemas/citas.schema.js'; // Esquema de validación para la creación de citas

const router = Router();

// Ruta para obtener todas las citas (pública)
router.get('/citas', getCitas);

// Ruta para obtener una cita específica por su ID (pública)
router.get('/citas/:id', getCita);

// Ruta para crear una nueva cita (requiere autenticación)
router.post('/citas', authRequired, validateSchema(createCitaSchema), createCita);

// Ruta para eliminar una cita por su ID (requiere autenticación)
router.delete('/citas/:id', authRequired, deleteCita);

// Ruta para actualizar una cita por su ID (requiere autenticación)
router.put('/citas/:id', authRequired, updateCita);
router.get('/citas/mis-citas', authRequired, getCitasByUser);

export default router;

