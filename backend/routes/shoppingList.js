const express = require("express");
const router = express.Router();

let shoppingList = [];
let idCounter = 1;

// GET: Retorna a lista de compras
router.get("/", (req, res) => {
  res.json(shoppingList);
});

// POST: Adiciona um item
router.post("/", (req, res) => {
  const exists = shoppingList.some(item => item.name === req.body.name);
  if(exists) {
    return res.status(400).json({ error: "o item já existe na lista."});
  }

  const precoAleatorio = parseFloat((Math.random() * 20 + 5).toFixed(2));
  const newItem = { id: idCounter++, name: req.body.name, price: precoAleatorio, quantity: 1};
  shoppingList.push(newItem);
  res.json(newItem);
});

// DELETE: Remove um item pelo ID
router.delete("/:id", (req, res) => {
  const id = parseInt(req.params.id);
  shoppingList = shoppingList.filter(item => item.id !== id);
  res.sendStatus(200);
});

module.exports = router;
