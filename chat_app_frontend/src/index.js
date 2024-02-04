import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './static/styles/tailwind-source.css'
import './static/styles/global.css'
import 'react-toastify/dist/ReactToastify.css'
import {ToastContainer} from "react-toastify";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <ToastContainer
            position="top-right"
            draggable
            pauseOnHover
            theme="dark"
        />
        <App/>
    </React.StrictMode>
);
