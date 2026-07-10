import { Container, Card, CardContent, Typography } from '@mui/material'

const PAGES = [
    { title: '홈', desc: '환영합니다! 여기는 홈 화면입니다.' },
    { title: '소개', desc: '이 사이트는 React와 MUI를 연습하는 공간입니다.' },
    { title: '연락처', desc: '문의사항은 이메일로 남겨주세요.' },
]

const Content = ({ tab }) => {
    const page = PAGES[tab]

    return (
        <Container sx={{ py: 4 }}>
            <Card variant='outlined'>
                <CardContent>
                    <Typography variant="h5" gutterBottom>{page.title}</Typography>
                    <Typography color="text.secondary">
                        {page.desc}
                    </Typography>
                </CardContent>
            </Card>
        </Container>
    )
}

export default Content
