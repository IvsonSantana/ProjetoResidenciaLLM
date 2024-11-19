const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const dotenv = require('dotenv');
const multer = require('multer');  // Importando o multer para upload de arquivos
const path = require('path');
const connectDB = require('./config/database');
const contextoRoutes = require('./routes/contextoMelhoriaRoutes');  // Corrigido para o arquivo de rotas

dotenv.config();

// Conectando ao banco de dados
connectDB();

const app = express();

// Usando Helmet para segurança
app.use(helmet());

// Usando CORS para permitir requisições de outros domínios
app.use(cors());

// Usando Morgan para logs HTTP
app.use(morgan('dev'));

// Configuração para aceitar dados no formato JSON
app.use(express.json());

// Configuração para aceitar dados no formato x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// Configuração de upload de arquivos PDF usando multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Pasta de destino para os uploads
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Usando timestamp para garantir nomes únicos
  }
});

const upload = multer({ storage: storage }); // Inicializando o multer com a configuração de armazenamento

// Usando as rotas para processamento de PDFs
// Aqui, adicionamos o middleware de upload para tratar o arquivo PDF
app.use('/api', contextoRoutes);

// Rota para upload de PDF e processamento
app.post('/api/contexto', upload.single('pdf'), contextoRoutes.getContextoMelhoria);  // Processando o arquivo PDF após o upload

// Configuração da porta
const PORT = process.env.PORT || 3000;

// Iniciando o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta: ${PORT}`);
});
