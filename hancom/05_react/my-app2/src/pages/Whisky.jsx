import CocktailGrid from '../components/CocktailGrid.jsx'
import { SPIRIT_COCKTAILS } from '../data/cocktailSpirits.js'

const Whisky = () => (
    <CocktailGrid
        spirit="whisky"
        title={SPIRIT_COCKTAILS.whisky.title}
        cocktailNames={SPIRIT_COCKTAILS.whisky.cocktails}
    />
)

export default Whisky
