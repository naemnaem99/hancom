import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import SpiritLoader from './SpiritLoader.jsx'
import { SPIRIT_COCKTAILS } from '../data/cocktailSpirits.js'
import { setLastSpirit } from '../utils/navMemory.js'
import './CocktailGrid.css'

const SPIRIT_ORDER = ['whisky', 'gin', 'rum']

const fetchCocktail = async (name) => {
    const res = await fetch(`https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${encodeURIComponent(name)}`)
    const data = await res.json()
    return data.drinks ? data.drinks[0] : null
}

const MIN_LOADING_MS = 1500

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

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

const CocktailGrid = ({ spirit, title, cocktailNames }) => {
    const [cocktails, setCocktails] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [selectedId, setSelectedId] = useState(null)

    useEffect(() => {
        setIsLoading(true)
        Promise.all([
            Promise.all(cocktailNames.map(fetchCocktail)),
            wait(MIN_LOADING_MS),
        ])
            .then(([results]) => setCocktails(results.filter(Boolean)))
            .catch((error) => console.error('칵테일 로딩 실패:', error))
            .finally(() => setIsLoading(false))
    }, [cocktailNames])

    const selected = cocktails.find((c) => c.idDrink === selectedId)
    const [leftSpirit, rightSpirit] = SPIRIT_ORDER.filter((key) => key !== spirit)

    if (isLoading) {
        return <SpiritLoader spirit={spirit} label={title} />
    }

    return (
        <section className="cocktail-page">
            <nav className="spirit-nav">
                <Link to={`/${leftSpirit}`} className="spirit-nav__side">
                    ← {SPIRIT_COCKTAILS[leftSpirit].title}
                </Link>
                <Link to="/" onClick={() => setLastSpirit(spirit)} className="spirit-nav__home">처음으로</Link>
                <Link to={`/${rightSpirit}`} className="spirit-nav__side">
                    {SPIRIT_COCKTAILS[rightSpirit].title} →
                </Link>
            </nav>

            <h1>{title} 칵테일</h1>

            <div className="cocktail-grid">
                {cocktails.map((c, i) => (
                    <button
                        key={c.idDrink}
                        type="button"
                        className="cocktail-card"
                        style={{ animationDelay: `${i * 60}ms` }}
                        onClick={() => setSelectedId(c.idDrink)}
                    >
                        <img src={c.strDrinkThumb} alt={c.strDrink} />
                        <span>{c.strDrink}</span>
                    </button>
                ))}
            </div>

            {selected && (
                <div className="cocktail-modal-backdrop" onClick={() => setSelectedId(null)}>
                    <div className="cocktail-modal" onClick={(e) => e.stopPropagation()}>
                        <button type="button" className="close-btn" onClick={() => setSelectedId(null)}>닫기</button>
                        <img src={selected.strDrinkThumb} alt={selected.strDrink} />
                        <h2>{selected.strDrink}</h2>
                        <p className="category">{selected.strCategory} · {selected.strGlass}</p>

                        <h3>재료</h3>
                        <ul>
                            {getIngredients(selected).map((item) => (
                                <li key={item}>{item}</li>
                            ))}
                        </ul>

                        <h3>제조법</h3>
                        <p>{selected.strInstructions}</p>
                    </div>
                </div>
            )}
        </section>
    )
}

export default CocktailGrid
