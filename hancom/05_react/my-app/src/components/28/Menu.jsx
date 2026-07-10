import { Tabs, Tab } from '@mui/material'

const Menu = ({ value, onChange }) => {
    return (
        <Tabs value={value} onChange={onChange} centered>
            <Tab label="홈" />
            <Tab label="소개" />
            <Tab label="연락처" />
        </Tabs>
    )
}

export default Menu
