import store from '@/redux/store'
import '@/styles/normalize.css'
import '@/styles/styles.css'
import { Provider } from 'react-redux'
import 'react-notifications-component/dist/theme.css'
// import '@/styles/styles.scss'

export default function App({ Component, pageProps }) {
    return (
        <Provider store={store}>
            <Component {...pageProps} />
        </Provider>
    )
}
