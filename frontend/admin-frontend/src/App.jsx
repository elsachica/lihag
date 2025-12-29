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

const propertyDataProvider = simpleRestProvider(import.meta.env.PROPERTY_URL || 'http://property:8003')
const userDataProvider = simpleRestProvider(import.meta.env.AUTH_URL || 'http://localhost:8889')
const maintenanceDataProvider = simpleRestProvider(import.meta.env.MAINTENANCE_URL || 'http://localhost:8890')

// Map resource names to API endpoints
const resourceMap = {
    properties: 'apartments'
}

const dataProvider = {
    getList: (resource, params) => {
        if (resource === 'accounts') return userDataProvider.getList('accounts', params)
        if (resource === 'maintenance') return maintenanceDataProvider.getList('maintenance', params)
        if (resource === 'properties') return propertyDataProvider.getList('apartments', params)
        return propertyDataProvider.getList(resource, params)
    },
    getOne: (resource, params) => {
        if (resource === 'accounts') return userDataProvider.getOne('accounts', params)
        if (resource === 'maintenance') return maintenanceDataProvider.getOne('maintenance', params)
        if (resource === 'properties') return propertyDataProvider.getOne('apartments', params)
        return propertyDataProvider.getOne(resource, params)
    },
    getMany: (resource, params) => {
        if (resource === 'accounts') return userDataProvider.getMany('accounts', params)
        if (resource === 'maintenance') return maintenanceDataProvider.getMany('maintenance', params)
        if (resource === 'properties') return propertyDataProvider.getMany('apartments', params)
        return propertyDataProvider.getMany(resource, params)
    },
    getManyReference: (resource, params) => {
        if (resource === 'accounts') return userDataProvider.getManyReference('accounts', params)
        if (resource === 'maintenance') return maintenanceDataProvider.getManyReference('maintenance', params)
        if (resource === 'properties') return propertyDataProvider.getManyReference('apartments', params)
        return propertyDataProvider.getManyReference(resource, params)
    },
    create: (resource, params) => {
        if (resource === 'accounts') return userDataProvider.create('accounts', params)
        if (resource === 'maintenance') return maintenanceDataProvider.create('maintenance', params)
        if (resource === 'properties') return propertyDataProvider.create('apartments', params)
        return propertyDataProvider.create(resource, params)
    },
    update: (resource, params) => {
        if (resource === 'accounts') return userDataProvider.update('accounts', params)
        if (resource === 'maintenance') return maintenanceDataProvider.update('maintenance', params)
        if (resource === 'properties') return propertyDataProvider.update('apartments', params)
        return propertyDataProvider.update(resource, params)
    },
    updateMany: (resource, params) => {
        if (resource === 'accounts') return userDataProvider.updateMany('accounts', params)
        if (resource === 'maintenance') return maintenanceDataProvider.updateMany('maintenance', params)
        if (resource === 'properties') return propertyDataProvider.updateMany('apartments', params)
        return propertyDataProvider.updateMany(resource, params)
    },
    delete: (resource, params) => {
        if (resource === 'accounts') return userDataProvider.delete('accounts', params)
        if (resource === 'maintenance') return maintenanceDataProvider.delete('maintenance', params)
        if (resource === 'properties') return propertyDataProvider.delete('apartments', params)
        return propertyDataProvider.delete(resource, params)
    },
    deleteMany: (resource, params) => {
        if (resource === 'accounts') return userDataProvider.deleteMany('accounts', params)
        if (resource === 'maintenance') return maintenanceDataProvider.deleteMany('maintenance', params)
        if (resource === 'properties') return propertyDataProvider.deleteMany('apartments', params)
        return propertyDataProvider.deleteMany(resource, params)
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
