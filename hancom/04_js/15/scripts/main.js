class Dog {
    constructor(name, age) {
        this.name = name
        this.age = age}
    
    bark(){
        return `${this.name}: 멍멍!`
    }
    info(){
        return `(${this.age})`
    }    
}


const out = document.querySelector("#out")

const poppy = new Dog("뽀삐","6")
const choco = new Dog("쪼꼬","8")

document.querySelector("#bark").addEventListener("click", ()=>{
    out.textContent = `${poppy.bark()}${poppy.info()} ${choco.bark()}${choco.info()}` 
})