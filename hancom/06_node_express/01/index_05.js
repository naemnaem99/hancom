const express = require("express");
const app = express();

const users = [{ id: 1, name: '지니' }, { id: 2, name: '철수' }, { id: 3, name: '영희' }]

app.get('/api/users/:id', (req, res) => {
    const user = users.find(u => u.id === Number(req.params.id))
    if(!user) return res.status(404).json({error: '없는 유저'})
    res.json(user)
})

    app.listen(3000, () => console.log("http://localhost:3000"));