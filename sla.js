const express = require('express');

const app = express();

const PORT = 3000;

app.use(express.json());

let usuarios = [
        { id: 1, nome: 'gabriel'},
        { id: 2, nome: 'pedro'}
];

app.post('/api/usuarios', (req, res) => {

    const novoUser = { id: usuarios.length + 1, nome: req.body.nome };

    usuarios.push(novoUser);
    
    res.status(201).json(novoUser);

});


app.get('/api/usuarios', (req, res) => {

    res.json(usuarios);

});



app.put('/api/usuarios/:id', (req, res) => {

    const usuario = usuarios.find(u => u.id === parseInt(req.params.id));

    if (!usuario) return res.status(404).send('Usuario não encontrado');

    usuario.nome = req.body.nome;

    res.json(usuario);
});



app.delete('/api/usuarios/:id', (req, res) => {

    const usuarioIndex = usuarios.findIndex(u => u.id === parseInt(req.params.id));

    if(usuarioIndex === -1) return res.status(404).send('user n encontrado');

    const usuarioDeletado = usuarios.splice(usuarioIndex, 1);

    res.json(usuarioDeletado);

});


app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
});