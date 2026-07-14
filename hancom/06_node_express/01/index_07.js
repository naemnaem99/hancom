// 꺼내기
const express = require("express");
// 만들기
const { log } = require("node:console");
const app = express();
app.use(express.json()); // 必 — 보낸 JSON을 req.body로 풀어줌 (없으면 undefined)
// 
let users = [
    {id: 1, name: "JINI"},
    {id: 2, name: "KIM"}
]
// 규칙 만들기
app.put("/api/users/:id", (req, res) => {
    const u = users.find(u => u.id === Number(req.params.id))
    if (!u) return res.status(404).json({ error: "User not found" })
        u.name = req.body.name
        res.json(u)
})

// 문 열기
app.listen(3000, async() => {
    const res = await fetch("http://localhost:3000/api/users/1", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: "한컴" })
    })
    console.log(await res.json()) // 바뀐 결과 확인
})