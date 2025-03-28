import { z } from 'zod';

// Esquema para la creación de una política
export const createPoliticaSchema = z.object({
    title: z.string({
        required_error: 'El título es obligatorio',
        invalid_type_error: 'El título debe ser un texto',
    }).min(1, {
        message: 'El título no puede estar vacío',
    }),
    description: z.string({
        required_error: 'La descripción es obligatoria',
        invalid_type_error: 'La descripción debe ser un texto',
    }).min(1, {
        message: 'La descripción no puede estar vacía',
    }),
   
});

// Esquema para la actualización de una política
export const updatePoliticaSchema = z.object({
    title: z.string({
        invalid_type_error: 'El título debe ser un texto',
    }).min(1, {
        message: 'El título no puede estar vacío',
    }).optional(),
    description: z.string({
        invalid_type_error: 'La descripción debe ser un texto',
    }).min(1, {
        message: 'La descripción no puede estar vacía',
    }).optional(),
    user: z.string({
        invalid_type_error: 'El ID del usuario debe ser un texto',
    }).min(1, {
        message: 'El ID del usuario no puede estar vacío',
    }).optional(),
});
