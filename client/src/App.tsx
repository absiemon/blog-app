import './App.css'
import Routes from './routes'
import CustomSnackbar from './components/reusable/CustomSnackbar'
import Loader from './components/customLoader/Loader';
import { useContext } from 'react';
import { AppContext } from './context/AppContext';


function App() {
  const { isAppLoading } = useContext(AppContext)

  return (
    <>
      {!isAppLoading ?
        <>
          <Routes />
          <CustomSnackbar />
        </>
        :
        <Loader />
      }
    </>
  )
}

export default App
