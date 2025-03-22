import Cita from '../models/citas.model.js';
import mongoose from 'mongoose';

// Obtener todas las citas activas
export const getCitas = async (req, res) => {
    try {
        const citas = await Cita.find().populate('user', 'name email');
        res.json(citas);
    } catch (error) {
        return res.status(500).json({ message: "Hubo un fallo al obtener las citas" });
    }
};

// Crear una cita
export const createCita = async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: "Acción no permitida. Solo para administradores." });
        }

        const { fecha, horario } = req.body;

        // Verificar que el usuario que crea la cita existe
        const existingUser = await mongoose.model('User').findById(req.user.id);
        if (!existingUser) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        const newCita = new Cita({
            fecha,
            horario,
            user: existingUser._id,
            estado: true, // La cita se crea activa por defecto
        });

        const savedCita = await newCita.save();
        res.status(201).json(savedCita);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Hubo un fallo al crear la cita" });
    }
};

// Obtener una cita por ID
export const getCita = async (req, res) => {
    try {
        const cita = await Cita.findById(req.params.id).populate('user', 'name email');
        if (!cita) return res.status(404).json({ message: 'Cita no encontrada' });
        res.json(cita);
    } catch (error) {
        return res.status(404).json({ message: "Cita no encontrada" });
    }
};

// Eliminar una cita
export const deleteCita = async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: "Acción no permitida. Solo para administradores." });
        }

        const cita = await Cita.findByIdAndDelete(req.params.id);
        if (!cita) return res.status(404).json({ message: 'Cita no encontrada' });
        return res.sendStatus(204);
    } catch (error) {
        return res.status(401).json({ message: "Cita no encontrada" });
    }
};

// Actualizar una cita (incluyendo el estado)
export const updateCita = async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: "Acción no permitida. Solo para administradores." });
        }

        const { id } = req.params;
        const { user, ...updateData } = req.body;

        // Validar si el usuario existe
        if (user) {
            const existingUser = await mongoose.model('User').findById(user);
            if (!existingUser) {
                return res.status(404).json({ message: "Usuario no encontrado" });
            }
            updateData.user = existingUser._id;
        }

        const cita = await Cita.findByIdAndUpdate(id, updateData, { new: true })
            .populate('user', 'name email');

        if (!cita) {
            return res.status(404).json({ message: 'Cita no encontrada' });
        }

        res.json(cita);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// Obtener todas las citas creadas por un usuario específico
export const getCitasByUser = async (req, res) => {
    try {
      const userId = req.user.id; // Obtener el ID del usuario autenticado desde el token
  
      // Buscar las citas donde el campo user coincida con el ID del usuario
      const citas = await Cita.find({ user: userId }).populate('user', 'name email');
  
      res.json(citas);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Hubo un fallo al obtener las citas del usuario" });
    }
  };