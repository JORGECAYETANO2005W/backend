import { z } from 'zod';

export const createContactoSchema = z.object({
    telefono: z.string()
        .min(10, { message: "El teléfono debe tener al menos 10 caracteres" })
        .max(15, { message: "El teléfono no puede tener más de 15 caracteres" })
        .regex(/^\d+$/, { message: "El teléfono solo debe contener números" }),

    email: z.string()
        .email({ message: "Por favor ingrese un correo válido" })
        .max(255, { message: "El correo no puede superar los 255 caracteres" }),

    user: z.string()
        .regex(/^[0-9a-fA-F]{24}$/, { message: "ID de usuario no válido" }),

    estado: z.boolean().optional() // Es opcional, por defecto es `true` en el modelo
});

// Esquema para actualizar un contacto (permite actualizar solo algunos campos)
export const updateContactoSchema = createContactoSchema.partial();
