import { z } from 'zod';

export const createCitaSchema = z.object({
    fecha: z.string({
        required_error: 'La fecha es obligatoria',
        invalid_type_error: 'La fecha debe ser una cadena de texto',
    }).min(1, {
        message: 'La fecha no puede estar vacía',
    }),
    horario: z.string({
        required_error: 'El horario es obligatorio',
        invalid_type_error: 'El horario debe ser una cadena de texto',
    }).min(1, {
        message: 'El horario no puede estar vacío',
    }),
});

