import CocktailGrid from '../components/CocktailGrid.jsx'
import { SPIRIT_COCKTAILS } from '../data/cocktailSpirits.js'

const Rum = () => (
    <CocktailGrid
        spirit="rum"
        title={SPIRIT_COCKTAILS.rum.title}
        cocktailNames={SPIRIT_COCKTAILS.rum.cocktails}
    />
)

export default Rum
