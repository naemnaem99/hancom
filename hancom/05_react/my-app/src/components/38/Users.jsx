import { useState, useEffect } from "react"

const Users = () => {
    const [users, setUsers] = useState([])

    useEffect(() => {
        fetch('https://jsonplaceholder.typicode.com/users')
            .then((res) => res.json())
            .then((data) => {
                console.log(data)
                setUsers(data)
            })
    }, [])

    return (
        <>
        <ul style={{ listStyleType: "none", display: "flex", flexDirection: "column", gap: "16px" }}>
            {users.map((u)=>(
                <li key={u.id}>{u.name}
                <br/>{u.email}</li>
            ))}
        </ul>
        </>
    )          
}

export default Users
