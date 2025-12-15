import { List, Datagrid, TextField, NumberField } from 'react-admin';

export const PropertyList = () => (
    <List>
        <Datagrid rowClick="edit">
            <TextField source="id" />
            <TextField source="address" label="Adress" />
            <TextField source="city" label="Stad" />
            <NumberField source="apartments" label="Antal lägenheter" />
            <TextField source="status" label="Status" />
        </Datagrid>
    </List>
);
