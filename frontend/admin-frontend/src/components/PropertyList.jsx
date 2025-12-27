
import { List, Datagrid, TextField, NumberField, EditButton, DeleteButton, Create, SimpleForm, TextInput, SelectInput, Edit } from 'react-admin';

export const PropertyList = () => (
    <List>
        <Datagrid rowClick="edit">
            <TextField source="id" />
            <TextField source="address" label="Adress" />
            <TextField source="city" label="Stad" />
            <NumberField source="apartments" label="Antal lägenheter" />
            <TextField source="status" label="Status" />
            <EditButton />
            <DeleteButton />
        </Datagrid>
    </List>
);

export const PropertyCreate = (props) => (
    <Create {...props}>
        <SimpleForm>
            <TextInput source="address" label="Adress" />
            <TextInput source="city" label="Stad" />
            <NumberField source="apartments" label="Antal lägenheter" />
            <SelectInput source="status" label="Status" choices={[
                { id: 'active', name: 'Aktiv' },
                { id: 'inactive', name: 'Inaktiv' }
            ]} />
        </SimpleForm>
    </Create>
);

export const PropertyEdit = (props) => (
    <Edit {...props}>
        <SimpleForm>
            <TextInput source="address" label="Adress" />
            <TextInput source="city" label="Stad" />
            <NumberField source="apartments" label="Antal lägenheter" />
            <SelectInput source="status" label="Status" choices={[
                { id: 'active', name: 'Aktiv' },
                { id: 'inactive', name: 'Inaktiv' }
            ]} />
        </SimpleForm>
    </Edit>
);
