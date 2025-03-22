import Contacto from '../models/contactos.model.js';
import mongoose from 'mongoose';

// Obtener todos los contactos
export const getContactos = async (req, res) => {
    try {
        const contactos = await Contacto.find().populate('user', 'name email');
        res.json(contactos);
    } catch (error) {
        return res.status(500).json({ message: "Hubo un fallo al obtener los contactos" });
    }
};

// Crear un contacto
export const createContacto = async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: "Acción no permitida. Solo para administradores." });
        }

        const { telefono, email } = req.body;

        // Verificar que el usuario que crea el contacto existe
        const existingUser = await mongoose.model('User').findById(req.user.id);
        if (!existingUser) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        const newContacto = new Contacto({
            telefono,
            email,
            user: existingUser._id,
            estado: true, // Contacto activo por defecto
        });

        const savedContacto = await newContacto.save();
        res.status(201).json(savedContacto);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Hubo un fallo al crear el contacto" });
    }
};

// Obtener un contacto por ID
export const getContacto = async (req, res) => {
    try {
        const contacto = await Contacto.findById(req.params.id).populate('user', 'name email');
        if (!contacto) return res.status(404).json({ message: 'Contacto no encontrado' });
        res.json(contacto);
    } catch (error) {
        return res.status(404).json({ message: "Contacto no encontrado" });
    }
};

// Eliminar un contacto
export const deleteContacto = async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: "Acción no permitida. Solo para administradores." });
        }

        const contacto = await Contacto.findByIdAndDelete(req.params.id);
        if (!contacto) return res.status(404).json({ message: 'Contacto no encontrado' });
        return res.sendStatus(204);
    } catch (error) {
        return res.status(401).json({ message: "Contacto no encontrado" });
    }
};

// Actualizar un contacto
export const updateContacto = async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: "Acción no permitida. Solo para administradores." });
        }

        const { id } = req.params;
        const { user, ...updateData } = req.body;

        // Validar si el nuevo usuario existe (si es que se quiere cambiar)
        if (user) {
            const existingUser = await mongoose.model('User').findById(user);
            if (!existingUser) {
                return res.status(404).json({ message: "Usuario no encontrado" });
            }
            updateData.user = existingUser._id;
        }

        const contacto = await Contacto.findByIdAndUpdate(id, updateData, { new: true })
            .populate('user', 'name email');

        if (!contacto) {
            return res.status(404).json({ message: 'Contacto no encontrado' });
        }

        res.json(contacto);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// Cambiar el estado del contacto (activar o desactivar)
export const updateEstadoContacto = async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: "Acción no permitida. Solo para administradores." });
        }

        const { id } = req.params;
        const { estado } = req.body; // true o false

        const contacto = await Contacto.findByIdAndUpdate(id, { estado }, { new: true });

        if (!contacto) {
            return res.status(404).json({ message: "Contacto no encontrado" });
        }

        res.json({ message: `Estado actualizado a ${estado ? 'activo' : 'inactivo'}`, contacto });
    } catch (error) {
        return res.status(500).json({ message: "Hubo un fallo al actualizar el estado" });
    }
};
