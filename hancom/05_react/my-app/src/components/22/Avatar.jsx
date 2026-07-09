import { useState } from 'react'
import './Avatar.css'

const Avatar = ({name, online}) => {
    const [isOnline, setIsOnline] = useState(online)

    return (
        <div className="avatar-row">
        <h3 className="avatar-name">{name}</h3>
        <button
            className={`toggle-btn ${isOnline ? 'online' : 'offline'}`}
            onClick={() => setIsOnline(!isOnline)}
            aria-label={isOnline ? '온라인' : '오프라인'}
        ></button>
        </div>
    )
}

export default Avatar
