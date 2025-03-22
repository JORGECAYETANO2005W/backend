// Importar dependencias
import app from './app.js';
import { connectDB } from './db.js'; 

// Conectar a la base de datos
connectDB();

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

