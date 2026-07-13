import BottleShape from './BottleShape.jsx'
import './SpiritLoader.css'

const SpiritLoader = ({ spirit, label }) => (
    <div className="spirit-loader">
        <span className="spirit-loader__icon">
            <BottleShape spirit={spirit} width={72} />
        </span>
        <p className="spirit-loader__text">
            {label} 따르는 중
            <span className="spirit-loader__dots">
                <span>.</span><span>.</span><span>.</span>
            </span>
        </p>
    </div>
)

export default SpiritLoader
