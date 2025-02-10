const express = require('express');
const fs = require('fs');

const app = express();
const PORT = 3003;

const PRIMARY_DB = "primary_db.json";
const SECONDARY_DB = "secondary_db.json";

const loadDB = (file) => JSON.parse(fs.readFileSync(file, 'utf-8'));
let primaryDB = loadDB(PRIMARY_DB);
let secondaryDB = loadDB(SECONDARY_DB);

const savePrimaryDB = () => fs.writeFileSync(PRIMARY_DB, JSON.stringify(primaryDB, null, 2));
const saveSecondaryDB = () => fs.writeFileSync(SECONDARY_DB, JSON.stringify(secondaryDB, null, 2));

let replicationQueue = [];

setInterval(() => {
    while (replicationQueue.length > 0) {
        const task = replicationQueue.shift();
        secondaryDB.products.push(task);
        saveSecondaryDB();
    }
}, 5000);

app.use(express.json());

app.post('/products', (req, res) => {
    const product = { id: primaryDB.products.length + 1, ...req.body };
    primaryDB.products.push(product);
    savePrimaryDB();
    replicationQueue.push(product);
    res.status(201).json(product);
});

app.listen(PORT, () => console.log(`Asynchronous Replication Server running at http://localhost:${PORT}`));