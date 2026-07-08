const n = document.querySelector("#n")
const out = document.querySelector("#out")

document.querySelector("#run").addEventListener("click",()=>{
    out.innerHTML=""
    const count= Number(n.value)
    for(let z = 1; z <= count; z++) {
        const li = document.createElement("li")
        li.textContent = `${z}번째 사과`
        out.appendChild(li)
    }
})

document.querySelector("#down").addEventListener("click",()=>{
    out.innerHTML=""
    let z = Number(n.value)
    while(z>0) {
        const li = document.createElement("li")
        li.textContent = z
        out.append(li)
        z--
    }
})