import React from 'react';
import { createRoot } from "react-dom/client";
import {Provider} from "react-redux"
import thisstore from './store';
import Routing from './routes';

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

root.render(
    <Provider store={thisstore}>
        <Routing/>
    </Provider>
);

