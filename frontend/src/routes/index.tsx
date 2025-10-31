import React from 'react';
import { BrowserRouter as Router, useRoutes } from 'react-router-dom';
import AppRoutes from './app';

const Routes = () => {
    const appRoutes = [...AppRoutes];
    return useRoutes(appRoutes);
}

const BaseRoutes : React.FC = () => {
    return (
        <Router>
            <Routes />
        </Router>
    );
}

export default BaseRoutes;
