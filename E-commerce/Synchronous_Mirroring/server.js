const express = require('express');
const fs = require('fs');

const app = express();
const PORT = 3002;

const PRIMARY_DB = "primary_db.json";
const SECONDARY_DB = "secondary_db.json";

const loadDB = (file) => JSON.parse(fs.readFileSync(file, 'utf-8'));
let primaryDB = loadDB(PRIMARY_DB);
let secondaryDB = loadDB(SECONDARY_DB);

const saveDBs = () => {
    fs.writeFileSync(PRIMARY_DB, JSON.stringify(primaryDB, null, 2));
    fs.writeFileSync(SECONDARY_DB, JSON.stringify(secondaryDB, null, 2));
};

app.use(express.json());

app.post('/products', (req, res) => {
    const product = { id: primaryDB.products.length + 1, ...req.body };
    primaryDB.products.push(product);
    secondaryDB.products.push(product);
    saveDBs();
    res.status(201).json(product);
});

app.listen(PORT, () => console.log(`Synchronous Mirroring Server running at http://localhost:${PORT}`));