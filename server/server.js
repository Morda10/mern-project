const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));

app.use('/', (req, res, next) => {
    console.log("server is liveeee!!!");
    res.send("<h1>godlsnghdf</h1>");
    next();
});

app.listen(8080);
