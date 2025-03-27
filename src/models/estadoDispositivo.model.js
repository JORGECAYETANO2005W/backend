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
            required:false,
        },
        cantidadAguaRecipiente: {
            type: Number,
            required: false,
        },
        platoComidaLleno: {
            type: Boolean,
            required:false,
        },
        platoAguaLleno: {
            type: Boolean,
            required: false
        }
    },
    {
        timestamps: true,
    }
);

export default mongoose.model("EstadoDispositivo", EstadoDispositivoSchema );