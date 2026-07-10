import { useEffect } from "react"

const Hello = () => {
    useEffect(() => {
        console.log('화면 뜰 때 딱 1번 실행')
    }, [])

    return (
        <p>
         안녕하세요!
        </p>
    )
}

export default Hello
