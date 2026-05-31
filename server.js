const express = require('express');
const cors = require('cors');
const path = require('path');

const db = require('./config/db');
const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');

const app = express();

app.use(cors());
app.use(express.json());

app.use(express.static('public'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api', authRoutes);
app.use('/api', taskRoutes);

app.listen(3000, () =>
  console.log('Servidor rodando em http://localhost:3000')
);