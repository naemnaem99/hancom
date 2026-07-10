import { AppBar, Toolbar, Typography, Box } from '@mui/material'
import Counter from '../29/Counter'

const Header = () => {
    return (
        <AppBar position="static">
            <Toolbar>
                <Box sx={{ flex: 1, textAlign:'left' }}>
                    <Counter/>
                </Box>
                <Typography variant="h6" sx={{ flex: 1, textAlign: 'center' }}>리액트 이해중..</Typography>
                <Box sx={{ flex: 1, textAlign:'right'}} />
            </Toolbar>
        </AppBar>
    )
}

export default Header
