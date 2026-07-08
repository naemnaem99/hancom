const img_a = "https://picsum.photos/96?random=1"
const img_b = "https://picsum.photos/96?random=2"

const myImage = document.querySelector("#pic")
myImage.setAttribute("src", img_a)
myImage.onclick = ()=> {
    const mySrc = myImage.getAttribute("src")
    if(mySrc === img_a) {
        myImage.setAttribute("src", img_b)}
    else{myImage.setAttribute("src", img_a)
    }
}