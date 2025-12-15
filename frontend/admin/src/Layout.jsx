import * as React from 'react';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import {
    AppBar,
    Layout,
    Menu,
    InspectorButton,
    TitlePortal,
} from 'react-admin';

const MyAppBar = () => (
    <AppBar>
        <TitlePortal />
        <InspectorButton />
    </AppBar>
);

const MyMenu = () => (
    <Menu>
        <Menu.ResourceItem name="users" keyboardShortcut="g>u" />
        <Menu.ResourceItem name="properties" keyboardShortcut="g>p" />
        <Menu.ResourceItem name="maintenance" keyboardShortcut="g>m" />
    </Menu>
);

export default ({ children }) => (
    <>
        <Layout appBar={MyAppBar} menu={MyMenu}>
            {children}
        </Layout>
        <ReactQueryDevtools
            initialIsOpen={false}
            buttonPosition="bottom-left"
        />
    </>
);