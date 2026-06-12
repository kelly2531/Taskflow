const express = require('express');
const cors = require('cors');
const path = require('path');
const helmet = require('helmet');

const db = require('./config/db');
const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');

const app = express();

// Segurança
app.use(helmet());


app.disable('x-powered-by');

app.use((req, res, next) => {
  res.setHeader(
    'Permissions-Policy',
    'geolocation=(), camera=(), microphone=()'
  );
  next();
});

app.use(cors());

app.use(express.json());

// Arquivos estáticos
app.use(express.static('public'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Rotas
app.use('/api', authRoutes);
app.use('/api', taskRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () =>
  console.log(`Servidor rodando na porta ${PORT}`)
);