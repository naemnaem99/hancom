const greet = document.querySelector("#greet")
const input = document.querySelector("#name")

const saved = localStorage.getItem("name")
if(saved) {
    greet.textContent = `안녕, ${saved}!`
}

document.querySelector("#save").addEventListener("click",()=>{
    const myName = input.value
    if(!myName){return}
    localStorage.setItem("name",myName)
    greet.textContent = `안녕, ${myName}!`
})

document.querySelector("#reset").addEventListener("click",()=>{
    localStorage.removeItem("name")
    greet.textContent=`안녕 넌 누구니?`
})