
import { List, Datagrid, TextField, EmailField, EditButton, DeleteButton, Create, SimpleForm, TextInput, SelectInput, Edit, PasswordInput } from 'react-admin';

export const UserList = () => (
    <List>
        <Datagrid rowClick="edit">
            <TextField source="_id" label="ID" />
            <EmailField source="email" label="E-post" />
            <TextField source="role" label="Roll" />
            <TextField source="propertyId" label="Lägenhet ID" />
            <EditButton />
            <DeleteButton />
        </Datagrid>
    </List>
);

export const UserCreate = () => (
    <Create>
        <SimpleForm>
            <TextInput source="email" label="E-post" type="email" required />
            <PasswordInput source="password" label="Lösenord" required />
            <SelectInput source="role" label="Roll" choices={[
                { id: 'admin', name: 'Admin' },
                { id: 'tenant', name: 'Hyresgäst' },
                { id: 'maintenance', name: 'Underhåll' }
            ]} defaultValue="tenant" required />
            <TextInput source="propertyId" label="Lägenhet ID" />
        </SimpleForm>
    </Create>
);

export const UserEdit = () => (
    <Edit>
        <SimpleForm>
            <TextInput source="email" label="E-post" type="email" required />
            <PasswordInput source="password" label="Lösenord (lämna tomt för att inte ändra)" />
            <SelectInput source="role" label="Roll" choices={[
                { id: 'admin', name: 'Admin' },
                { id: 'tenant', name: 'Hyresgäst' },
                { id: 'maintenance', name: 'Underhåll' }
            ]} required />
            <TextInput source="propertyId" label="Lägenhet ID" />
        </SimpleForm>
    </Edit>
);
