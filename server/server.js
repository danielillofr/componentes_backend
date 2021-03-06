require('./config/config');

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const mongoose = require('mongoose');

mongoose.connect(process.env.URLDB, (err) => {
    if (err) throw err;
    console.log('BASE DE DATOS ONLINE');
})

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json());



app.use(express.static(path.resolve(__dirname, '../public')));
// app.use(express.static(path.resolve(__dirname, './../../TodoList/dist/ftsock')));

app.use(require('./routes/homologaciones/usuarios'));
app.use(require('./routes/homologaciones/componentes'));
app.use(require('./routes/homologaciones/movimientos'));

app.use(require('./routes/prototipos/prcomponentes'));
app.use(require('./routes/prototipos/proyectos'));
app.use(require('./routes/prototipos/logcompro'));

app.get('*', function(req, res) {
    res.sendfile('./public/index.html')
})

app.listen(process.env.PORT, () => {
    console.log('Escuchando puerto: ', 3000);
});