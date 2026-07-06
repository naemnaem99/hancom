const title = document.querySelector("#title")
// '.'은 '~의'라는 뜻. 위의 document.quertySeletor은 document의 id가 title인 것을 찾아서 const 어쩌구 하겠다.
const btn = document.querySelector("#btn")

btn.addEventListener("click", () => {
    // 제목이 바뀌는 로직
    title.textContent = "hello world";
});   