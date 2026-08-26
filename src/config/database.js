const fs = require('fs').promises; // Import the promises API of the fs module (Esto de arriba es para que no se rompa el código, ya que no se puede usar fs.readFileSync en un entorno asincrónico)
const path = require('path');

const dbFilePath = path.join(__dirname, '../../data/database.json'); // Ruta al archivo de base de datos JSON

async function readDatabase() {
    try {
        const data = await fs.readFile(dbFilePath, 'utf8'); // Leer el contenido del archivo de base de datos
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading database:', error);
        return [];
    }
}

async function writeDatabase(data) {
    try {
        await fs.writeFile(dbFilePath, JSON.stringify(data, null, 2), 'utf8'); // Escribir los datos en el archivo de base de datos
    } catch (error) {
        console.error('Error writing to database:', error);
    }
}

module.exports = {
    readDatabase,
    writeDatabase
};