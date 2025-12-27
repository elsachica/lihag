
import { List, Datagrid, TextField, EmailField, EditButton, DeleteButton, Create, SimpleForm, TextInput, SelectInput, Edit } from 'react-admin';

export const UserList = () => (
    <List>
        <Datagrid rowClick="edit">
            <TextField source="id" />
            <TextField source="name" label="Namn" />
            <EmailField source="email" label="E-post" />
            <TextField source="role" label="Roll" />
            <EditButton />
            <DeleteButton />
        </Datagrid>
    </List>
);

export const UserCreate = (props) => (
    <Create {...props}>
        <SimpleForm>
            <TextInput source="name" label="Namn" />
            <TextInput source="email" label="E-post" />
            <SelectInput source="role" label="Roll" choices={[
                { id: 'admin', name: 'Admin' },
                { id: 'user', name: 'Användare' }
            ]} />
        </SimpleForm>
    </Create>
);

export const UserEdit = (props) => (
    <Edit {...props}>
        <SimpleForm>
            <TextInput source="name" label="Namn" />
            <TextInput source="email" label="E-post" />
            <SelectInput source="role" label="Roll" choices={[
                { id: 'admin', name: 'Admin' },
                { id: 'user', name: 'Användare' }
            ]} />
        </SimpleForm>
    </Edit>
);
