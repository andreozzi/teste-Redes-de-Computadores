
const express = require('express');
const router = require('./routes/userRoutes');
const cors = require('cors');
const app = express();
const PORT = 6262;

app.use(cors());
app.use(express.json());
app.use(router)


app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`)
});
