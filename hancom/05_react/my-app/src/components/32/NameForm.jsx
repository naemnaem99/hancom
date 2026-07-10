import { useState } from "react"


const NameForm = () => {
    const [name, setName] = useState("")
    
    return (
        <>
        <input value={name}
        onChange={(e) => setName(e.target.value)}
        />
        <p> 안녕,{name} </p>
        </>
    )
}

export default NameForm
