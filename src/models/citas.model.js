import mongoose from 'mongoose';

const citaSchema = new mongoose.Schema(
  {
    fecha: {
      type: Date,
      required: true,
      trim: true,
    },
    horario: {
      type: String,
      required: true,
      trim: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    estado: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true, // Crea automáticamente los campos `createdAt` y `updatedAt`
  }
);

export default mongoose.model('Cita', citaSchema);

