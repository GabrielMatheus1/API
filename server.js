const express = require('express');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const PORT = 3000;

// Middleware para autorização (disponível para todos)
const cors = require('cors');
app.use(cors());




app.use(express.json());

// Conectar ao banco de dados SQLite
const db = new sqlite3.Database('./usuarios.db', (err) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err.message);
    } else {
        console.log('Conectado ao banco de dados SQLite.');
    }
});

// Criar tabela se não existir
db.run(`
    CREATE TABLE IF NOT EXISTS usuarios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT NOT NULL UNIQUE,
        senha TEXT NOT NULL,
        nome TEXT NOT NULL,
        celular TEXT NOT NULL,
        cpf TEXT NOT NULL UNIQUE,
        cep TEXT NOT NULL,
        endereco TEXT NOT NULL,
        numero TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        tip TEXT NOT NULL DEFAULT 'USER',
        update_at DATETIME CURRENT_TIMESTAMP NOT NULL
    );
`);


// Rota para verificar se o servidor está funcionando
app.get('/', (req, res) => {
    res.send('Servidor funcionando!');
});



// Rota para adicionar um novo usuário ok //
app.post('/v1/usuarios', (req, res) => {
    const { email, senha, nome, celular, cpf, cep, endereco, numero } = req.body;

    const query = `
        INSERT INTO usuarios (email, senha, nome, celular, cpf, cep, endereco, numero, created_at, tip, update_at) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), 'USER', datetime('now'));
    `;
    // console.log('Dados recebidos:', { email, senha, nome, celular, cpf, cep, endereco, numero }); // Debugging log

    db.run(query, [email, senha, nome, celular, cpf, cep, endereco, numero], function (err) {
        if (err) {
            return res.status(500).send('Erro ao adicionar usuário.');
        }

        const lastId = this.lastID; // Obter o último ID inserido
        res.json({ id: lastId, message: 'Usuário cadastrado com sucesso!' });
    });
    
});



// Rota para listar todos os usuários ok //
app.get('/v1/usuarios', (req, res) => {
    const query = `SELECT * FROM usuarios`;

    db.all(query, [], (err, rows) => {
        if (err) {
            return res.status(500).send('Erro ao buscar usuários.');
        }

        res.json(rows);
    });
});



// Rota para buscar um usuário específico (login)
app.post('/v1/login', (req, res) => {
    const { email, senha } = req.body;

    if (!email || !senha) {
        return res.status(400).send('Os campos "email" e "senha" são obrigatórios.');
    }

    const query = `SELECT * FROM usuarios WHERE email = ? AND senha = ?`;

    db.get(query, [email, senha], (err, row) => {
        if (err) {
            return res.status(500).send('Erro ao buscar usuário.');
        }

        if (!row) {
            return res.status(401).send('Email ou senha inválidos.');
        }

        res.json({ 
            message: 'Login realizado com sucesso!', 
            usuario: {
                id: row.id,
                email: row.email,
                nome: row.nome,
                celular: row.celular,
                cpf: row.cpf,
                cep: row.cep,
                endereco: row.endereco,
                numero: row.numero,
                created_at: row.created_at,
                tip: row.tip,
                update_at: row.update_at
            }
        });
    });
});




// // Rota para atualizar um usuário
// app.put('/api/usuarios/:id', (req, res) => {
//     const { id } = req.params;
//     const { nome } = req.body;

//     if (!nome) {
//         return res.status(400).send('O campo "nome" é obrigatório.');
//     }

//     const query = `UPDATE usuarios SET nome = ? WHERE id = ?`;
//     db.run(query, [nome, id], function (err) {
//         if (err) {
//             return res.status(500).send('Erro ao atualizar usuário.');
//         }

//         if (this.changes === 0) {
//             return res.status(404).send('Usuário não encontrado.');
//         }

//         res.json({ id: parseInt(id), nome });
//     });
// });






// // Rota para deletar um usuário
// app.delete('/api/usuarios/:id', (req, res) => {
//     const { id } = req.params;

//     const query = `DELETE FROM usuarios WHERE id = ?`;
//     db.run(query, [id], function (err) {
//         if (err) {
//             return res.status(500).send('Erro ao deletar usuário.');
//         }

//         if (this.changes === 0) {
//             return res.status(404).send('Usuário não encontrado.');
//         }

//         res.json({ id: parseInt(id) });
//     });
// });

// Iniciar o servidor
app.listen(PORT, () => {
    console.log(`Teste no servidor on https://serve-teste.onrender.com/api/usuarios`);
    console.log(`Teste local http://localhost:${PORT}/v1/`);
});
