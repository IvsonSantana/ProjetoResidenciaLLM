const express = require('express');
const morgan = require('morgan');
const cors = require('cors')
const helmet = require('helmet');
const dotenv = require('dotenv');
const connectDB = require('./config/database');
const contextoRoutes = require ('./routes/contextoMelhoriaRoutes')

dotenv.config();

connectDB();

const app = express();

app.use(helmet());

app.use(cors());

app.use(morgan('dev'));

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use('/api', contextoRoutes);


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta: ${PORT}`);
});
