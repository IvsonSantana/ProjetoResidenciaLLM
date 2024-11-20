// app.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const analysisRoutes = require('./routes/analysisRoutes');  // Importando as rotas

const app = express();
const PORT = process.env.PORT || 10000;

// Configurar o CORS para permitir acesso de qualquer origem
app.use(cors());

// Conectar ao MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Conectado ao MongoDB'))
  .catch((error) => console.error('Erro ao conectar ao MongoDB:', error));

// Middleware para receber dados JSON e arquivos
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Usar as rotas definidas no arquivo analysisRoutes
app.use('/', analysisRoutes);

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
