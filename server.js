const express = require('express');
const cors = require('cors');
const path = require('path');
const helmet = require("helmet");

const db = require('./config/db');
const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');

const app = express();

// segurança primeiro
app.use(helmet());
app.disable("x-powered-by");

// middlewares
app.use(cors({
  origin: "https://taskflow-kadn.onrender.com"
}));

app.use(express.json());

// arquivos estáticos
app.use(express.static('public'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// rotas
app.use('/api', authRoutes);
app.use('/api', taskRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () =>
  console.log(`Servidor rodando na porta ${PORT}`)
);