import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './shared/store'; // Ensure this is the correct path

import '@/assets/styles.scss';
import Aura from '@primeuix/themes/aura';
import PrimeVue from 'primevue/config';
import ConfirmationService from 'primevue/confirmationservice';
import ToastService from 'primevue/toastservice';
import errorService from './shared/ErrorService';

const app = createApp(App);
app.use(router);
app.use(store);
app.use(PrimeVue, {
    theme: {
        preset: Aura,
        options: {
            darkModeSelector: '.app-dark'
        }
    }
});

app.use(ToastService);
app.use(ConfirmationService);

const toast = app.config.globalProperties.$toast;
errorService.setToastInstance(toast);

app.mount('#app');
