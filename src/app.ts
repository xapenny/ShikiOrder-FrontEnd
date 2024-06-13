import { createApp } from 'vue'
import './app.scss'
import router from './router'
import store from './store'

const App = createApp({
    onShow(options) { },
})

App.use(router).use(store)

export default App
