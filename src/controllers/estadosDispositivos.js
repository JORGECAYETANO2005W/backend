import EstadoDispositivo from '../models/estadoDispositivo.model.js';
import Dispositivo from '../models/dispositivo.model.js';

// Guardar estado del dispositivo enviado desde ESP32
export const saveEstadoDispositivo = async (req, res) => {
    try {
        const { 
            macAddress, 
            bombaAgua,
            ultimaComida,
            cantidadComidaRecipiente,
            cantidadAguaRecipiente,
            platoComidaLleno,
            platoAguaLleno
        } = req.body;

        // Validación de campos requeridos
        if (!macAddress || bombaAgua === undefined || ultimaComida === undefined) {
            return res.status(400).json({ 
                message: "Faltan campos requeridos: macAddress, bombaAgua, ultimaComida" 
            });
        }

        // Buscar y actualizar el estado del dispositivo
        const estadoActualizado = await EstadoDispositivo.findOneAndUpdate(
            { macAddress }, // Criterio de búsqueda
            {
                bombaAgua,
                ultimaComida,
                cantidadComidaRecipiente: cantidadComidaRecipiente || 0, // Valor por defecto si no viene
                cantidadAguaRecipiente: cantidadAguaRecipiente || 0,      // Valor por defecto si no viene
                platoComidaLleno: platoComidaLleno || false,              // Valor por defecto si no viene
                platoAguaLleno: platoAguaLleno || false,                 // Valor por defecto si no viene
                updatedAt: new Date()
            },
            { 
                upsert: true, // Crear nuevo documento si no existe
                new: true // Devuelve el documento actualizado
            }
        );

        res.status(201).json({ 
            success: true,
            message: "Estado del alimentador actualizado correctamente",
            data: estadoActualizado
        });
        
    } catch (error) {
        console.error('Error al guardar estado del alimentador:', error);
        res.status(500).json({ 
            success: false,
            message: "Error interno al guardar el estado del dispositivo",
            error: error.message 
        });
    }
};

// Obtener historial de estados de un dispositivo por MAC
export const getEstadosByMac = async (req, res) => {
    try {
        const { macAddress } = req.params;
        
        // Buscar estados del dispositivo
        const estados = await EstadoDispositivo.find({ macAddress })
            .sort({ createdAt: -1 }) // Ordenar por fecha, más reciente primero
            .limit(100); // Limitar a 100 registros
        
        if (estados.length === 0) {
            return res.status(404).json({ message: "No se encontraron datos para este dispositivo" });
        }
        
        res.json(estados);
    } catch (error) {
        console.error('Error al obtener estados del dispositivo:', error);
        res.status(500).json({ message: "Error al obtener los estados del dispositivo", error: error.message });
    }
};

// Obtener último estado de un dispositivo por MAC
export const getUltimoEstadoByMac = async (req, res) => {
    try {
        const { macAddress } = req.params;
        
        // Buscar el último estado del dispositivo
        const ultimoEstado = await EstadoDispositivo.findOne({ macAddress })
            .sort({ createdAt: -1 }); // Ordenar por fecha, más reciente primero
        
        if (!ultimoEstado) {
            return res.status(404).json({ message: "No se encontraron datos para este dispositivo" });
        }
        
        res.json(ultimoEstado);
    } catch (error) {
        console.error('Error al obtener último estado del dispositivo:', error);
        res.status(500).json({ message: "Error al obtener el último estado del dispositivo", error: error.message });
    }
};

// Obtener estadísticas de un dispositivo por MAC (promedios diarios)
export const getEstadisticasByMac = async (req, res) => {
    try {
        const { macAddress } = req.params;
        
        // Obtener promedio de temperatura, humedad y humedad del suelo por día
        const estadisticas = await EstadoDispositivo.aggregate([
            { $match: { macAddress } },
            {
                $group: {
                    _id: {
                        year: { $year: "$createdAt" },
                        month: { $month: "$createdAt" },
                        day: { $dayOfMonth: "$createdAt" }
                    },
                    fecha: { $first: "$createdAt" },
                    avgTemperatura: { $avg: "$temperatura" },
                    avgHumedad: { $avg: "$humedad" },
                    avgHumedadSuelo: { $avg: "$humedadSuelo" },
                    avgLuz: { $avg: "$luz" },
                    registros: { $sum: 1 }
                }
            },
            { $sort: { fecha: -1 } },
            { $limit: 30 } // Últimos 30 días
        ]);
        
        if (estadisticas.length === 0) {
            return res.status(404).json({ message: "No se encontraron suficientes datos para generar estadísticas" });
        }
        
        res.json(estadisticas);
    } catch (error) {
        console.error('Error al obtener estadísticas del dispositivo:', error);
        res.status(500).json({ message: "Error al obtener estadísticas del dispositivo", error: error.message });
    }
};

