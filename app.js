const express = require("express");
const app = express();
const port = 8000;

app.use(express.json());

let videojuegos = [
    {id: 1, titulo: "Example 1", precio: 20},
    {id: 2, titulo: "Example 2", precio: 27},
    {id: 3, titulo: "Example 3", precio: 10},
    {id: 4, titulo: "Example 4", precio: 30},
    {id: 5, titulo: "Example 5", precio: 120}
];

app.get("/", (req, res) => {
    return res.send("HOLA QUE TAL");
});

app.get("/mis-videojuegos", (req, res) => {
    return res.json([
        videojuegos[0],
        videojuegos[3]
    ]);
})

app.post("/guardar-juego", (req, res) => {
    let nuevoJuego = {
        id: videojuegos.length + 1,
        titulo: req.body.titulo,
        precio: req.body.precio
    }
    videojuegos.push(nuevoJuego);

    return res.status(200).json(nuevoJuego);
})

app.listen(port, () => {
    console.log("Servidor activo en http://localhost:"+port);
});