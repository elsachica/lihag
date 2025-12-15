import { List, Datagrid, TextField, DateField, ReferenceField } from 'react-admin';

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
        </Datagrid>
    </List>
);
