// 꺼내기
const express = require("express");
// 만들기
const app = express();
// 삭제할 데이터 목록
let users = [
    { id: 1, name: "LEE" },
    { id: 2, name: "KIMf" },
    { id: 3, name: "KIMh" },
    { id: 4, name: "KIMj" },
    { id: 5, name: "KIMi" }
]

// 규칙 만들기
app.delete("/api/users/:id", (req, res) => {
    users = users.filter(u => u.id !== Number(req.params.id)) // 삭제
    res.json({ ok: true, 남은: users }) // 삭제 확인
})

// 문 열기
app.listen(3000, async() => { 
    const res = await fetch("http://localhost:3000/api/users/2", { method: "DELETE" })
    console.log(await res.json()) // 삭제 후 남은 목록 확인
})
