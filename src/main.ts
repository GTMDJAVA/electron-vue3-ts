import {createApp} from 'vue'
import App from './App.vue'

import './style.css'

// If you want use Node.js, the`nodeIntegration` needs to be enabled in the Main process.
// import './demos/node'
import router from './router'

createApp(App)
    .use(router)
    .mount('#app')
    .$nextTick(() => {
        postMessage({payload: 'removeLoading'}, '*')
    })
