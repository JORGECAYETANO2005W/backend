import { Router } from 'express';
import { authRequired } from '../middlewares/validateToken.js';
import {
    getContactos,     // Obtener todos los contactos
    getContacto,      // Obtener un contacto específico por ID
    createContacto,   // Crear un nuevo contacto
    updateContacto,   // Actualizar un contacto existente
    deleteContacto    // Eliminar un contacto
} from '../controllers/contacto.controller.js';
import { validateSchema } from '../middlewares/validator.middlewar.js';
import { createContactoSchema } from '../schemas/contacto.schema.js'; // El esquema de validación que deberías crear

const router = Router();

// Obtener todos los contactos (requiere autenticación)
router.get('/contactos', authRequired, getContactos);

// Obtener un contacto específico (requiere autenticación)
router.get('/contactos/:id', authRequired, getContacto);

// Crear un nuevo contacto (requiere autenticación y validación)
router.post('/contactos', authRequired, validateSchema(createContactoSchema), createContacto);

// Eliminar un contacto (requiere autenticación)
router.delete('/contactos/:id', authRequired, deleteContacto);

// Actualizar un contacto (requiere autenticación)
router.put('/contactos/:id', authRequired, updateContacto);

export default router;

