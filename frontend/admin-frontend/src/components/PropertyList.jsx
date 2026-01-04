
import { List, Datagrid, TextField, NumberField, BooleanField, EditButton, DeleteButton, Create, SimpleForm, TextInput, NumberInput, SelectInput, BooleanInput, Edit } from 'react-admin';

export const PropertyList = () => (
    <List>
        <Datagrid rowClick="edit">
            <TextField source="_id" label="ID" />
            <TextField source="number" label="Nummer" />
            <NumberField source="size" label="Storlek (kvm)" />
            <TextField source="area" label="Område" />
            <TextField source="type" label="Typ" />
            <NumberField source="price" label="Hyra (kr)" />
            <BooleanField source="isAvailable" label="Ledig" />
            <EditButton />
            <DeleteButton />
        </Datagrid>
    </List>
);

export const PropertyCreate = () => (
    <Create>
        <SimpleForm>
            <TextInput source="number" label="Nummer" required />
            <NumberInput source="size" label="Storlek (kvm)" required />
            <TextInput source="propertyId" label="Property ID" required />
            <TextInput source="area" label="Område" required />
            <SelectInput source="type" label="Typ" choices={[
                { id: 'apartment', name: 'Lägenhet' },
                { id: 'locale', name: 'Lokal' }
            ]} required />
            <NumberInput source="price" label="Månadshyra (kr)" required />
            <BooleanInput source="isAvailable" label="Ledig" defaultValue={true} />
            <TextInput source="description" label="Beskrivning" multiline />
            <NumberInput source="floor" label="Våning" />
            <NumberInput source="roomCount" label="Antal rum" />
        </SimpleForm>
    </Create>
);

export const PropertyEdit = () => (
    <Edit>
        <SimpleForm>
            <TextInput source="number" label="Nummer" required />
            <NumberInput source="size" label="Storlek (kvm)" required />
            <TextInput source="propertyId" label="Property ID" required />
            <TextInput source="area" label="Område" required />
            <SelectInput source="type" label="Typ" choices={[
                { id: 'apartment', name: 'Lägenhet' },
                { id: 'locale', name: 'Lokal' }
            ]} required />
            <NumberInput source="price" label="Månadshyra (kr)" required />
            <BooleanInput source="isAvailable" label="Ledig" />
            <TextInput source="description" label="Beskrivning" multiline />
            <NumberInput source="floor" label="Våning" />
            <NumberInput source="roomCount" label="Antal rum" />
        </SimpleForm>
    </Edit>
);
