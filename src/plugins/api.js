// api.js

import axios from 'axios';

// Remplacez 'URL ICI' par votre URL réelle
const baseURL = 'https://donations.edu.netlor.fr';
const apiKey = 'Oy)#WQ]$0<ba';

export default {
    install: function (app,options) {
        const api = axios.create({
            baseURL:baseURL,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `key=${apiKey}`,
            },
        });
        app.config.globalProperties.$api = api;
    }
}