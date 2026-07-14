// 꺼내기
const express = require("express");
// 미들웨어 꺼내기
const cors = require("cors");
// 서버 만들기
const app = express();

app.use(cors()); // 必 — 다른 도메인에서 요청 허용 및 규제

app.use(express.json()); // 객체로 해석 => 변환 전 "{\"id\":1,\"name\":\"LEE\"}" => 변환 후 {id: 1, name: "LEE"}

app.use((req, res, next) => {
    console.log(req.method, req.url);
    next()
})
// 규칙 만들기
app.get("/api/users", (req, res) => {
    res.json([{id: 1, name: "LEE"}]);
})

    // 문열기
app.listen(3000, () => console.log("http://localhost:3000/api/users"));    