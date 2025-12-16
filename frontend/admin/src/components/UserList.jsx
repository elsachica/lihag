import { List, Datagrid, TextField, EmailField } from 'react-admin';

export const UserList = () => (
    <List>
        <Datagrid rowClick="edit">
            <TextField source="id" />
            <TextField source="name" label="Namn" />
            <EmailField source="email" label="E-post" />
            <TextField source="role" label="Roll" />
        </Datagrid>
    </List>
);
