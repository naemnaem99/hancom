let person = {
    name: "콩이",
    age: 10
}

const out = document.querySelector("#out")

const render = () => {
    out.textContent = `${person.name},(${person.age}살)`
}
render()

document.querySelector("#age").addEventListener("click", ()=> {
    person.age++
    render()
})

document.querySelector("#name").addEventListener("click", ()=>{
    person.name = "두부"
    render()
})