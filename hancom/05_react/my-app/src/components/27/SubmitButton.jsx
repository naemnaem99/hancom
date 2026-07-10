import {Button, TextField, Card, Alert } from '@mui/material'

const SubmitButton = () => {
    return (
        <>
        <Alert severity="success">저장</Alert>
        <Card sx={{ padding: 2 }}>야미</Card>
        <TextField />
        <Button variant='contained' onClick={() => alert ("눌러주셔서 감사합니다.")}>
            눌러주세요!
        </Button>
        </>
    )
}

export default SubmitButton