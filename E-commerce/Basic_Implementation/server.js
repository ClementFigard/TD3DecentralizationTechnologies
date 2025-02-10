const express = require('express');
const fs = require('fs');

const app = express();
const PORT = 3001;

app.use(express.json());

let db = {
    products: [
        { id: 1, name: "Notebook", description: "A5 ruled notebook", price: 5, category: "Stationery", inStock: true }
    ],
    orders: [],
    carts: {}
};

// Save database to file
const saveDB = () => fs.writeFileSync("db.json", JSON.stringify(db, null, 2));

app.get('/products', (req, res) => res.json(db.products));
app.get('/products/:id', (req, res) => {
    const product = db.products.find(p => p.id === parseInt(req.params.id));
    product ? res.json(product) : res.status(404).json({ error: "Product not found" });
});
app.post('/products', (req, res) => {
    const product = { id: db.products.length + 1, ...req.body };
    db.products.push(product);
    saveDB();
    res.status(201).json(product);
});
app.delete('/products/:id', (req, res) => {
    db.products = db.products.filter(p => p.id !== parseInt(req.params.id));
    saveDB();
    res.json({ message: "Product deleted" });
});

app.listen(PORT, () => console.log(`E-commerce API running on http://localhost:${PORT}`));