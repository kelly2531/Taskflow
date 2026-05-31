const express = require('express');
const multer = require('multer');
const path = require('path');
const db = require('../config/db');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Configuração do multer para upload de imagens
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Define a pasta onde as fotos serão salvas
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

// Rota para criar tarefas
router.post('/tasks', authMiddleware, upload.single('image'), (req, res) => {
    const { title } = req.body;
    const image = req.file ? '/uploads/' + req.file.filename : null;

    db.run('INSERT INTO tasks (user_id, title, image) VALUES (?, ?, ?)',
        [req.user.id, title, image],
        function(err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ id: this.lastID });
        }
    );
});

// Rota para listar tarefas
router.get('/tasks', authMiddleware, (req, res) => {
    db.all('SELECT * FROM tasks WHERE user_id = ? ORDER BY created_at DESC', [req.user.id], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// Rota para deletar tarefas
router.delete('/tasks/:id', authMiddleware, (req, res) => {
    db.run('DELETE FROM tasks WHERE id = ? AND user_id = ?', [req.params.id, req.user.id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Deletado' });
    });
});

// Rota para atualizar status da tarefa
router.patch('/tasks/:id', authMiddleware, (req, res) => {
    const { status } = req.body;
    db.run('UPDATE tasks SET status = ? WHERE id = ? AND user_id = ?',
        [status, req.params.id, req.user.id],
        function(err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: 'Tarefa atualizada' });
        }
    );
});

module.exports = router;