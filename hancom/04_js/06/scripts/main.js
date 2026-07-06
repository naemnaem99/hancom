const icecream = document.querySelector("#icecream")
const result = document.querySelector("#result")

document.querySelector("#확인").addEventListener("click", () => {
    if(icecream.value === "a") {result.textContent = "초코 좋아";}
    else if(icecream.value === "b") {result.textContent = "바닐라도 좋아";}
    else {result.textContent = "딸기는 더 좋아";}
    
});