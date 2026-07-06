const multi = (n1,n2,n3) => n1 * n2 + n3;

const a = document.querySelector("#a")
const b = document.querySelector("#b")
const c = document.querySelector("#c")
const result = document.querySelector("#result")

document.querySelector("#calc").addEventListener("click",()=>{
    result.textContent = `${multi(Number(a.value),Number(b.value),Number(c.value))}`;
})