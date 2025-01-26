import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { HashRouter } from 'react-router-dom';
import './index.css'
import { AppProvider } from './context/AppContext.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <HashRouter>
    <AppProvider>
      <App />
    </AppProvider>
  </HashRouter>,
)
