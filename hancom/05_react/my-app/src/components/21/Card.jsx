import './Card.css'
const Card = ({title, desc, emoji}) => {
    return (
        <div className="card">
            <span className="card-emoji">{emoji}</span>
            <h3 className="card-title">{title}</h3>
            <p className="card-desc">{desc}</p>
        </div>
    )
}

export default Card
