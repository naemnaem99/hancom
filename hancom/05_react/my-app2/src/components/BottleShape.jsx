import { BOTTLE_SHAPES } from '../data/bottleShapes.js'

const BottleShape = ({ spirit, width = 64 }) => {
    const shape = BOTTLE_SHAPES[spirit]
    const height = (width / 64) * shape.heightAt64

    return (
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" width={width} height={height}>
            <polygon
                points={shape.points}
                fill="#fff"
                stroke="#000"
                strokeWidth="3"
                vectorEffect="non-scaling-stroke"
            />
        </svg>
    )
}

export default BottleShape
