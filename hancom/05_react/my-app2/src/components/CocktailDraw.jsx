import { useRef, useState } from 'react'
import { BOTTLE_SHAPES } from '../data/bottleShapes.js'
import { SPIRIT_COCKTAILS } from '../data/cocktailSpirits.js'
import './CocktailDraw.css'

// { whisky: {cocktails:[...]}, gin: {...}, rum: {...} } -> 36개 { spirit, name } 평탄화
const ALL_COCKTAILS = Object.entries(SPIRIT_COCKTAILS).flatMap(([spirit, { cocktails }]) =>
    cocktails.map((name) => ({ spirit, name }))
)

const CARD_COUNT = 20 // 상단 10 + 하단 10
const FLIP_MS = 650

const shuffle = (list) => {
    const copy = [...list]
    for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[copy[i], copy[j]] = [copy[j], copy[i]]
    }
    return copy
}

const fetchCocktail = async (name) => {
    const res = await fetch(`https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${encodeURIComponent(name)}`)
    const data = await res.json()
    return data.drinks ? data.drinks[0] : null
}

const getIngredients = (drink) => {
    const list = []
    for (let i = 1; i <= 15; i++) {
        const ingredient = drink[`strIngredient${i}`]
        const measure = drink[`strMeasure${i}`]
        if (!ingredient) continue
        list.push(`${measure ? measure.trim() : ''} ${ingredient}`.trim())
    }
    return list
}

// 카드 앞면 병 모양은 기주와 무관하게 전부 위스키 실루엣으로 통일
const BottleFace = () => (
    <span className="draw-card__face draw-card__front">
        <span className="draw-card__bottle-wrap">
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="draw-card__bottle" aria-hidden="true">
                <polygon points={BOTTLE_SHAPES.whisky.points} />
            </svg>
            <span className="draw-card__q" aria-hidden="true">?</span>
        </span>
    </span>
)

const CocktailDraw = () => {
    const [cards, setCards] = useState(null) // null = 닫힘
    const [picked, setPicked] = useState(null) // { id, spirit, name, drink, rect }
    const [phase, setPhase] = useState('idle') // idle -> flipping -> revealed
    const timers = useRef([])

    const clearTimers = () => {
        timers.current.forEach(clearTimeout)
        timers.current = []
    }

    const open = () => {
        const picks = shuffle(ALL_COCKTAILS).slice(0, CARD_COUNT)
        setCards(picks.map((pick, i) => ({ id: i, ...pick })))
        setPicked(null)
        setPhase('idle')
    }

    const close = () => {
        clearTimers()
        setCards(null)
        setPicked(null)
        setPhase('idle')
    }

    const handlePick = async (card, event) => {
        if (phase !== 'idle') return
        const rect = event.currentTarget.getBoundingClientRect()
        setPicked({ ...card, rect, drink: null })
        setPhase('flipping')

        const drink = await fetchCocktail(card.name)
        if (!drink) {
            setPicked(null)
            setPhase('idle')
            return
        }
        setPicked((prev) => (prev ? { ...prev, drink } : prev))

        // 뒤집기가 끝난 뒤 화면 중앙에서 레시피 전체가 펼쳐진다 (페이지 이동 없음)
        timers.current.push(setTimeout(() => setPhase('revealed'), FLIP_MS))
    }

    if (!cards) {
        return (
            <button type="button" className="draw-trigger" onClick={open}>
                <span className="draw-trigger__q" aria-hidden="true">?</span>
                랜덤 칵테일 마시기
                <span className="draw-trigger__q" aria-hidden="true">?</span>
            </button>
        )
    }

    const topRow = cards.slice(0, 10)
    const bottomRow = cards.slice(10, 20)
    const isDiscarding = phase !== 'idle'
    const isRevealed = phase === 'revealed'

    return (
        <div className="draw-overlay">
            <div className={'draw-row draw-row--top' + (isDiscarding ? ' is-discarding' : '')}>
                {topRow.map((card) => (
                    <button
                        key={card.id}
                        type="button"
                        className="draw-card"
                        onClick={(e) => handlePick(card, e)}
                        disabled={phase !== 'idle'}
                        aria-label={`${card.name} 뽑기`}
                    >
                        <span className="draw-card__inner">
                            <BottleFace />
                        </span>
                    </button>
                ))}
            </div>

            <div className={'draw-row draw-row--bottom' + (isDiscarding ? ' is-discarding' : '')}>
                {bottomRow.map((card) => (
                    <button
                        key={card.id}
                        type="button"
                        className="draw-card"
                        onClick={(e) => handlePick(card, e)}
                        disabled={phase !== 'idle'}
                        aria-label={`${card.name} 뽑기`}
                    >
                        <span className="draw-card__inner">
                            <BottleFace />
                        </span>
                    </button>
                ))}
            </div>

            {picked && (
                <div
                    className={'draw-card draw-card--floating' + (isRevealed ? ' is-revealed' : '')}
                    style={
                        isRevealed
                            ? undefined
                            : {
                                top: picked.rect.top,
                                left: picked.rect.left,
                                width: picked.rect.width,
                                height: picked.rect.height,
                            }
                    }
                >
                    <span className={'draw-card__inner' + (picked.drink ? ' is-flipped' : '')}>
                        <BottleFace />
                        <span className="draw-card__face draw-card__back">
                            {picked.drink && !isRevealed && (
                                <>
                                    <img src={picked.drink.strDrinkThumb} alt="" />
                                    <span className="draw-card__name">{picked.drink.strDrink}</span>
                                </>
                            )}
                            {picked.drink && isRevealed && (
                                <div className="draw-reveal">
                                    <button type="button" className="draw-reveal__close" onClick={close}>닫기</button>
                                    <img src={picked.drink.strDrinkThumb} alt="" className="draw-reveal__img" />
                                    <h2 className="draw-reveal__title">{picked.drink.strDrink}</h2>
                                    <p className="draw-reveal__category">
                                        {picked.drink.strCategory} · {picked.drink.strGlass}
                                    </p>

                                    <h3>재료</h3>
                                    <ul>
                                        {getIngredients(picked.drink).map((item) => (
                                            <li key={item}>{item}</li>
                                        ))}
                                    </ul>

                                    <h3>제조법</h3>
                                    <p>{picked.drink.strInstructions}</p>
                                </div>
                            )}
                        </span>
                    </span>
                </div>
            )}
        </div>
    )
}

export default CocktailDraw
