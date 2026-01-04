
import { List, Datagrid, TextField, DateField, EditButton, DeleteButton, Create, SimpleForm, TextInput, SelectInput, Edit } from 'react-admin';

export const MaintenanceList = () => (
    <List>
        <Datagrid rowClick="edit">
            <TextField source="_id" label="ID" />
            <TextField source="apartmentId" label="Lägenhet" />
            <TextField source="category" label="Kategori" />
            <TextField source="description" label="Beskrivning" />
            <TextField source="status" label="Status" />
            <TextField source="priority" label="Prioritet" />
            <DateField source="createdAt" label="Skapad" showTime />
            <EditButton />
            <DeleteButton />
        </Datagrid>
    </List>
);

export const MaintenanceCreate = () => (
    <Create>
        <SimpleForm>
            <TextInput source="apartmentId" label="Lägenhet ID" required />
            <SelectInput source="category" label="Kategori" choices={[
                { id: 'electrical', name: 'El' },
                { id: 'plumbing', name: 'VVS' },
                { id: 'heating', name: 'Värme' },
                { id: 'ventilation', name: 'Ventilation' },
                { id: 'other', name: 'Övrigt' }
            ]} required />
            <TextInput source="description" label="Beskrivning" multiline required />
            <SelectInput source="status" label="Status" choices={[
                { id: 'new', name: 'Ny' },
                { id: 'in_progress', name: 'Pågående' },
                { id: 'completed', name: 'Klar' },
                { id: 'cancelled', name: 'Avbruten' }
            ]} defaultValue="new" />
            <SelectInput source="priority" label="Prioritet" choices={[
                { id: 'low', name: 'Låg' },
                { id: 'medium', name: 'Medium' },
                { id: 'high', name: 'Hög' },
                { id: 'urgent', name: 'Akut' }
            ]} />
            <TextInput source="assignedTo" label="Tilldelad till" />
        </SimpleForm>
    </Create>
);

export const MaintenanceEdit = () => (
    <Edit>
        <SimpleForm>
            <TextInput source="apartmentId" label="Lägenhet ID" disabled />
            <SelectInput source="category" label="Kategori" choices={[
                { id: 'electrical', name: 'El' },
                { id: 'plumbing', name: 'VVS' },
                { id: 'heating', name: 'Värme' },
                { id: 'ventilation', name: 'Ventilation' },
                { id: 'other', name: 'Övrigt' }
            ]} required />
            <TextInput source="description" label="Beskrivning" multiline required />
            <SelectInput source="status" label="Status" choices={[
                { id: 'new', name: 'Ny' },
                { id: 'in_progress', name: 'Pågående' },
                { id: 'completed', name: 'Klar' },
                { id: 'cancelled', name: 'Avbruten' }
            ]} />
            <SelectInput source="priority" label="Prioritet" choices={[
                { id: 'low', name: 'Låg' },
                { id: 'medium', name: 'Medium' },
                { id: 'high', name: 'Hög' },
                { id: 'urgent', name: 'Akut' }
            ]} />
            <TextInput source="assignedTo" label="Tilldelad till" />
        </SimpleForm>
    </Edit>
);
