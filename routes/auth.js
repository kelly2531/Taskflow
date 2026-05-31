const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db'); 

const router = express.Router();
const SECRET = 'taskflow_secret';

// Registrar usuário
router.post('/register', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Verifica se os campos foram preenchidos
        if (!username || !password) {
            return res.status(400).json({ error: 'Preencha todos os campos' });
        }

        // Gera o hash da senha (esconde a senha)
        const hash = await bcrypt.hash(password, 10);

        // Salva o hash no banco de dados
        db.run('INSERT INTO users (username, password) VALUES (?, ?)', 
            [username, hash], function(err) {
                if (err) return res.status(400).json({ error: 'Usuário já existe' });
                res.json({ message: 'Usuário criado com sucesso' });
            });
    } catch (err) {
        res.status(500).json({ error: 'Erro ao processar o registro' });
    }
});

// Login de usuário
router.post('/login', (req, res) => {
    const { username, password } = req.body;

    db.get('SELECT * FROM users WHERE username = ?', [username], async (err, user) => {
        if (err) return res.status(500).json({ error: 'Erro no banco de dados' });
        
        if (!user) {
            return res.status(400).json({ error: 'Usuário não encontrado' });
        }

        try {
            // Compara a senha digitada com o hash guardado no banco
            const valid = await bcrypt.compare(password, user.password);
            
            if (!valid) {
                return res.status(400).json({ error: 'Senha incorreta' });
            }

            // Gera o token de acesso
            const token = jwt.sign(
                { id: user.id, username: user.username }, 
                SECRET, 
                { expiresIn: '1h' }
            );

            res.json({ token });
        } catch (error) {
            res.status(500).json({ error: 'Erro ao validar login' });
        }
    });
});

module.exports = router;