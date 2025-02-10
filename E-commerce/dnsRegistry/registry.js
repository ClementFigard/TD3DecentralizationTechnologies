const express = require('express');
const app = express();
const PORT = 4000;

app.get('/getServer', (req, res) => {
    res.json({ code: 200, server: 'localhost:3001' });
});

app.listen(PORT, () => {
    console.log(`DNS Registry running at http://localhost:${PORT}`);
});