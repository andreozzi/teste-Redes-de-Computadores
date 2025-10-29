
const express = require('express');
const router = require('./routes/userRoutes');
const app = express();
const PORT = 6262;
app.use(express.json());
app.use(router)


app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`)
});
