import React from 'react'
import { Admin, Resource } from 'react-admin'
import PeopleIcon from '@mui/icons-material/People'
import ApartmentIcon from '@mui/icons-material/Apartment'
import BuildIcon from '@mui/icons-material/Build'
import MyLayout from './Layout'
import { UserList, UserCreate, UserEdit } from './components/UserList'
import { PropertyList, PropertyCreate, PropertyEdit } from './components/PropertyList'
import { MaintenanceList, MaintenanceCreate, MaintenanceEdit } from './components/MaintenanceList'
import './App.css'

import simpleRestProvider from 'ra-data-simple-rest'

const adminDataProvider = simpleRestProvider(import.meta.env.VITE_AUTH_SERVICE_URL || 'http://localhost:8891')

// Map resource names to API endpoints
const resourceMap = {
    properties: 'property/apartments',
    maintenanceReports: 'maintenance',
    accounts: '/'
}

const dataProvider = {
    getList: (resource, params) => {
        const mapped = resourceMap[resource] || resource
        return adminDataProvider.getList(mapped, params)
    },
    getOne: (resource, params) => {
        const mapped = resourceMap[resource] || resource
        return adminDataProvider.getOne(mapped, params)
    },
    getMany: (resource, params) => {
        const mapped = resourceMap[resource] || resource
        return adminDataProvider.getMany(mapped, params)
    },
    getManyReference: (resource, params) => {
        const mapped = resourceMap[resource] || resource
        return adminDataProvider.getManyReference(mapped, params)
    },
    create: (resource, params) => {
        const mapped = resourceMap[resource] || resource
        return adminDataProvider.create(mapped, params)
    },
    update: (resource, params) => {
        const mapped = resourceMap[resource] || resource
        return adminDataProvider.update(mapped, params)
    },
    updateMany: (resource, params) => {
        const mapped = resourceMap[resource] || resource
        return adminDataProvider.updateMany(mapped, params)
    },
    delete: (resource, params) => {
        const mapped = resourceMap[resource] || resource
        return adminDataProvider.delete(mapped, params)
    },
    deleteMany: (resource, params) => {
        const mapped = resourceMap[resource] || resource
        return adminDataProvider.deleteMany(mapped, params)
    }
}

function App() {
        return (
            <Admin
                dataProvider={dataProvider}
                layout={MyLayout}
            >
                <Resource name="accounts" list={UserList} create={UserCreate} edit={UserEdit} icon={PeopleIcon} />
                <Resource name="properties" list={PropertyList} create={PropertyCreate} edit={PropertyEdit} icon={ApartmentIcon} />
                <Resource name="maintenance" list={MaintenanceList} create={MaintenanceCreate} edit={MaintenanceEdit} icon={BuildIcon} />
            </Admin>
        )
}

export default App
