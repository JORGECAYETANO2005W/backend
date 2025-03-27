import mongoose from "mongoose";

const EstadoDispositivoSchema = new mongoose.Schema(
    {
        macAddress: {
            type: String,
            required: true,
            unique: true,
        },
        bombaAgua: {
            type: Boolean,
            required: true,
        },
        ultimaComida: {
            type: Number,
            required: true,
        },
        cantidadComidaRecipiente: {
            type: Number,
            required: true,
        },
        cantidadAguaRecipiente: {
            type: Number,
            required: true,
        },
        platoComidaLleno: {
            type: Boolean,
            required: true,
        },
        platoAguaLleno: {
            type: Boolean,
            required: true,
        }
    },
    {
        timestamps: true,
    }
);

export default mongoose.model("EstadoDispositivo", EstadoDispositivoSchema );