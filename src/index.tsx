import React from 'react';
import * as ReactDOMClient from 'react-dom/client';
import { Provider } from 'react-redux';
import { HashRouter } from 'react-router-dom';

import App from './components/app/app';
import store from './services/store';

const container = document.getElementById('root') as HTMLElement;
const root = ReactDOMClient.createRoot(container);
 
 root.render(
   <React.StrictMode>
     <Provider store={store}>
    <HashRouter>
         <App />
    </HashRouter>
     </Provider>
   </React.StrictMode>
 );
