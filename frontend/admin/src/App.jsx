import React from 'react'
import { Admin, Resource } from 'react-admin'
import simpleRestProvider from 'ra-data-simple-rest'
import PeopleIcon from '@mui/icons-material/People'
import ApartmentIcon from '@mui/icons-material/Apartment'
import BuildIcon from '@mui/icons-material/Build'
import MyLayout from './Layout'
import { UserList } from './components/UserList'
import { PropertyList } from './components/PropertyList'
import { MaintenanceList } from './components/MaintenanceList'
import './App.css'

const dataProvider = simpleRestProvider('http://localhost:3000/api')

function App() {
    return (
        <Admin
            dataProvider={dataProvider}
            layout={MyLayout}
        >
            <Resource name="accounts" list={UserList} icon={PeopleIcon} />
            <Resource name="properties" list={PropertyList} icon={ApartmentIcon} />
            <Resource name="maintenance" list={MaintenanceList} icon={BuildIcon} />
        </Admin>
    )
}

export default App
