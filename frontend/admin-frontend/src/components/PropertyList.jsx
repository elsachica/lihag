
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
            <TextInput source="number" label="Nummer" required />
            <NumberField source="size" label="Storlek (kvm)" required />
            <TextInput source="propertyId" label="Property ID" required />
            <TextInput source="area" label="Område" required />
            <SelectInput source="type" label="Typ" choices={[
                { id: 'apartment', name: 'Lägenhet' },
                { id: 'locale', name: 'Lokal' }
            ]} required />
            <NumberField source="price" label="Månadshyra" required />
            <SelectInput source="isAvailable" label="Ledig" choices={[
                { id: true, name: 'Ja' },
                { id: false, name: 'Nej' }
            ]} />
            <TextInput source="description" label="Beskrivning" />
            <NumberField source="floor" label="Våning" />
            <NumberField source="roomCount" label="Antal rum" />
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
