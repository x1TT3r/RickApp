var express = require('express');
var router = express.Router();

var produtos = [
    {id:1, nome: "Arroz", preco: 10.99 },
    {id:2, nome: "Feijão", preco: 8.99 },
    {id:3, nome: "Macarrão", preco: 5.99 },
];

router.get('/', (req, res) => {
    res.json(produtos);
});

module.exports= router;