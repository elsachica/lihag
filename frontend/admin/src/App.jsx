import React from 'react'
import { Admin, Resource } from 'react-admin'
import simpleRestProvider from 'ra-data-simple-rest'
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
            <Resource name="users" list={UserList} />
            <Resource name="properties" list={PropertyList} />
            <Resource name="maintenance" list={MaintenanceList} />
        </Admin>
    )
}

export default App
