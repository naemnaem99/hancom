import CocktailGrid from '../components/CocktailGrid.jsx'
import { SPIRIT_COCKTAILS } from '../data/cocktailSpirits.js'

const Gin = () => (
    <CocktailGrid
        spirit="gin"
        title={SPIRIT_COCKTAILS.gin.title}
        cocktailNames={SPIRIT_COCKTAILS.gin.cocktails}
    />
)

export default Gin
