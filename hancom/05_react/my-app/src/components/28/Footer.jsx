import { Box, Typography } from '@mui/material'

const Footer = () => {
    return (
        <Box component="footer" sx={{ py: 2, textAlign: 'center', backgroundColor: 'grey.100' }}>
            <Typography variant="body2" color="text.secondary">
                어 그래 푸터야~
            </Typography>
        </Box>
    )
}

export default Footer
