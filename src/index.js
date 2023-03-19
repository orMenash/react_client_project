import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { CookiesProvider } from "react-cookie";
import { BrowserRouter, Route } from "react-router-dom"

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <BrowserRouter>
        <CookiesProvider>
            <App />
        </CookiesProvider>
    </BrowserRouter>
);
