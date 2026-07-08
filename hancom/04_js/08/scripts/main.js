const btn = document.querySelector("#btn")
const count = document.querySelector("#count")
let n = 0

btn.addEventListener("click", () => {
    n++
    count.textContent = `${n}번`
})
