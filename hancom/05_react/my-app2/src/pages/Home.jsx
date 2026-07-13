import { useState } from 'react'
import { Link } from 'react-router-dom'
import { BOTTLE_SHAPES } from '../data/bottleShapes.js'
import { getLastSpirit } from '../utils/navMemory.js'
import CocktailDraw from '../components/CocktailDraw.jsx'
import './Home.css'

const BOTTLES = [
    { key: 'whisky', label: '위스키', to: '/whisky' },
    { key: 'gin', label: '진', to: '/gin' },
    { key: 'rum', label: '럼', to: '/rum' },
]

const SPIRIT_ORDER = ['whisky', 'gin', 'rum']

const DEFAULT_PROMPT = {
    eyebrow: 'Cocktail',
    title: '칵테일 레시피',
    sub: '오늘은 어떤 칵테일을 마실까요?',
    spirit: null, // null이면 병 3개 전부에 화살표
}

const SPIRIT_PROMPTS = {
    whisky: { eyebrow: 'Whisky', title: '이번엔 위스키 베이스로?', sub: '위스키로 만든 칵테일 12가지', spirit: 'whisky' },
    gin: { eyebrow: 'Gin', title: '이번엔 진 베이스로?', sub: '진으로 만든 칵테일 12가지', spirit: 'gin' },
    rum: { eyebrow: 'Rum', title: '이번엔 럼 베이스로?', sub: '럼으로 만든 칵테일 12가지', spirit: 'rum' },
}

// cameFrom이 없으면(=주소창으로 바로 들어온 첫 화면) 고정 문구,
// 있으면(=레시피 페이지에서 "처음으로"로 돌아옴) 그 기주를 뺀 나머지 둘 중 랜덤
const pickPrompt = (cameFrom) => {
    if (!cameFrom) return DEFAULT_PROMPT
    const others = SPIRIT_ORDER.filter((key) => key !== cameFrom)
    const picked = others[Math.floor(Math.random() * others.length)]
    return SPIRIT_PROMPTS[picked]
}

const Home = () => {
    const [hovered, setHovered] = useState(null)
    const [prompt] = useState(() => pickPrompt(getLastSpirit()))

    return (
        <div className="home-stage">
            <div className="diorama">
                <p className="diorama__eyebrow">{prompt.eyebrow}</p>
                <h1 className="diorama__title">{prompt.title}</h1>
                <p className="diorama__sub">{prompt.sub}</p>

                <div className="shelf" onMouseLeave={() => setHovered(null)}>
                    {BOTTLES.map((bottle) => (
                        <Link
                            key={bottle.key}
                            to={bottle.to}
                            className={
                                'bottle bottle--' + bottle.key +
                                (hovered === bottle.key ? ' is-active' : '') +
                                (hovered && hovered !== bottle.key ? ' is-faded' : '')
                            }
                            onMouseEnter={() => setHovered(bottle.key)}
                            onFocus={() => setHovered(bottle.key)}
                            onBlur={() => setHovered(null)}
                        >
                            {(prompt.spirit === null || prompt.spirit === bottle.key) && (
                                <span className="bottle__hint" aria-hidden="true">↓</span>
                            )}
                            <span className="bottle__glass">
                                <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="bottle__svg">
                                    <polygon points={BOTTLE_SHAPES[bottle.key].points} className="bottle__shape" />
                                </svg>
                                <span className="bottle__cap" />
                                <span className="bottle__label">{bottle.label}</span>
                            </span>
                        </Link>
                    ))}
                    <div className="shelf__plank" />
                </div>
            </div>

            {prompt.spirit !== null && <CocktailDraw />}
        </div>
    )
}

export default Home
