//Page for Authentication
import { Container } from '@mui/material'
import { useContext, useEffect, useState } from 'react'
import Register from '../components/auth/Register'
import Login from '../components/auth/Login'
import { AppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import MenuBookIcon from '@mui/icons-material/MenuBook';


function AuthPage() {
  const { isAuthenticated } = useContext(AppContext)

  //State for checking whether user is on login form or registration form
  const [isLogin, setIsLogin] = useState<boolean>(true)
  const navigate = useNavigate()

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/home')
    }
    else {
      navigate('/')
    }
  }, [])

  return (
    <Container sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '100vh', pt: 5, pb: 5 }}>
      <MenuBookIcon
        sx={{ fontSize: '50px', color: '#FC4747', marginBottom: '20px' }}
      />
      <>
        {isLogin ?
          <Login setisLogin={setIsLogin} />
          :
          <Register setIsLogin={setIsLogin} />
        }
      </>
    </Container>
  )
}

export default AuthPage