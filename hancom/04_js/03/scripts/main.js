const nameinput = document.querySelector("#name")
const out = document.querySelector("#out")

document.querySelector("#greet").addEventListener("click", ()=> {
    let myName = nameinput.value;
    out.textContent = `안녕, ${myName}!`
})