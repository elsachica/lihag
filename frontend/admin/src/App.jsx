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

const baseDataProvider = simpleRestProvider(import.meta.env.PROPERTY_URL || 'http://localhost:8888')

// Map resource names to API endpoints
const resourceMap = {
    properties: 'apartments'
}

const dataProvider = {
    ...baseDataProvider,
    getList: (resource, params) => {
        const apiResource = resourceMap[resource] || resource
        return baseDataProvider.getList(apiResource, params)
    },
    getOne: (resource, params) => {
        const apiResource = resourceMap[resource] || resource
        return baseDataProvider.getOne(apiResource, params)
    },
    getMany: (resource, params) => {
        const apiResource = resourceMap[resource] || resource
        return baseDataProvider.getMany(apiResource, params)
    },
    getManyReference: (resource, params) => {
        const apiResource = resourceMap[resource] || resource
        return baseDataProvider.getManyReference(apiResource, params)
    },
    create: (resource, params) => {
        const apiResource = resourceMap[resource] || resource
        return baseDataProvider.create(apiResource, params)
    },
    update: (resource, params) => {
        const apiResource = resourceMap[resource] || resource
        return baseDataProvider.update(apiResource, params)
    },
    updateMany: (resource, params) => {
        const apiResource = resourceMap[resource] || resource
        return baseDataProvider.updateMany(apiResource, params)
    },
    delete: (resource, params) => {
        const apiResource = resourceMap[resource] || resource
        return baseDataProvider.delete(apiResource, params)
    },
    deleteMany: (resource, params) => {
        const apiResource = resourceMap[resource] || resource
        return baseDataProvider.deleteMany(apiResource, params)
    }
}

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
