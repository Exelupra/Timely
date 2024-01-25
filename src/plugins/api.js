import axios from 'axios';
import { useStore } from '../store/store';

const baseURL = 'https://timely.edu.netlor.fr';

export default {
  install: function (app, options) {
    const store = useStore();

    const api = axios.create({
      baseURL: baseURL,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `key=${store.apiKey}`,
      },
    });

    app.config.globalProperties.$api = api;
  },
};
