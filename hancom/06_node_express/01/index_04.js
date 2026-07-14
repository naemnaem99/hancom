const express = require("express");
const app = express();

app.get('/api/users', (req, res) => {
    res.json([
        { id: 1, name: "LEE" },
        { id: 2, name: "KIM" },
        { id: 3, name: "CHOI" }
    ]);
});


app.listen(3000, () => console.log("http://localhost:3000"));

