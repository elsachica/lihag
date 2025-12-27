
import { List, Datagrid, TextField, DateField, ReferenceField, EditButton, DeleteButton, Create, SimpleForm, TextInput, SelectInput, Edit } from 'react-admin';

export const MaintenanceList = () => (
    <List>
        <Datagrid rowClick="edit">
            <TextField source="id" />
            <TextField source="title" label="Rubrik" />
            <TextField source="description" label="Beskrivning" />
            <TextField source="status" label="Status" />
            <DateField source="createdAt" label="Skapad" />
            <ReferenceField source="propertyId" reference="properties" label="Fastighet">
                <TextField source="address" />
            </ReferenceField>
            <EditButton />
            <DeleteButton />
        </Datagrid>
    </List>
);

export const MaintenanceCreate = (props) => (
    <Create {...props}>
        <SimpleForm>
            <TextInput source="title" label="Rubrik" />
            <TextInput source="description" label="Beskrivning" />
            <SelectInput source="status" label="Status" choices={[
                { id: 'open', name: 'Öppen' },
                { id: 'in_progress', name: 'Pågår' },
                { id: 'closed', name: 'Stängd' }
            ]} />
            <TextInput source="propertyId" label="Fastighets-ID" />
        </SimpleForm>
    </Create>
);

export const MaintenanceEdit = (props) => (
    <Edit {...props}>
        <SimpleForm>
            <TextInput source="title" label="Rubrik" />
            <TextInput source="description" label="Beskrivning" />
            <SelectInput source="status" label="Status" choices={[
                { id: 'open', name: 'Öppen' },
                { id: 'in_progress', name: 'Pågår' },
                { id: 'closed', name: 'Stängd' }
            ]} />
            <TextInput source="propertyId" label="Fastighets-ID" />
        </SimpleForm>
    </Edit>
);
