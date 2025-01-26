// This Component serves the login form 
import React, { useContext, useState } from 'react'
import { TextField } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import { AppContext } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { StorageManager } from '../../utills/storageManager';
import axiosServices from '../../utills/axios';

//Defining the type of props that he can accept
interface LoginProps {
  setisLogin: React.Dispatch<React.SetStateAction<boolean>>;
}

//Defining the type event object of input type text
interface EventType {
  InputEvent: React.ChangeEvent<HTMLInputElement>;
}

function Login({ setisLogin }: LoginProps) {
  const { setUser, setIsAuthenticated, setSnackbar, deviceDetails } = useContext(AppContext)
  const navigate = useNavigate()

  //Defining the state for error handling 
  const [error, setError] = useState({
    emailError: false,
    passwordError: false,
  });

  //Defining the state for inputs
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  //Funtion to handle login after all input validation
  const handleLogin = (event: React.FormEvent) => {
    event.preventDefault();
    if (!email && !password) {
      setError((prev) => {
        return { ...prev, emailError: true, passwordError: true };
      });
      return;
    }
    if (!email) {
      setError((prev) => {
        return { ...prev, emailError: true };
      });
      return;
    }
    if (!password) {
      setError((prev) => {
        return { ...prev, passwordError: true };
      });
      return;
    }

    setLoading(true);
    axiosServices
      .post("/auth/login", { email, password, device_info: deviceDetails })
      .then((res) => {
        setIsAuthenticated(true);
        setUser(res.data?.data);

        const accessToken = res?.data?.accessToken;
        const session_id = res?.data?.session?.session_id;
        const device_id = res?.data?.session?.device_id;
        const refresh_token = res?.data?.session?.refresh_token;
        new StorageManager('ACCESS_TOKEN', 'AUTH', true, accessToken).setStorage()
        new StorageManager('SESSION_ID', 'SESSION', true, session_id).setStorage()
        new StorageManager('DEVICE_ID', 'PERSIST', true, device_id).setStorage()
        new StorageManager('REFRESH_TOKEN', 'SESSION', true, refresh_token).setStorage()

        setLoading(false);
        navigate('/home/blogs');

      })
      .catch((error) => {
        setLoading(false);
        setSnackbar((prev) => {
          return { ...prev, open: true, message: error?.message, };
        });
      });
  };


  // Single function to handles input change of both input
  const handleChange = (e: EventType[`InputEvent`], field: string) => {
    const text = e.target.value;
    const newField = field + "Error";
    // Removing error state if value in particular input is changes
    if (text) {
      setError((prev) => {
        return { ...prev, [newField]: false };
      });
    }
    if (field === "email") setEmail(text);
    else if (field === "password") setPassword(text);
  }

  return (
    <main className='bg-secondary shadow-xl md:w-[60%] bdmd:w-[40%] py-2 px-4 rounded-xl'>
      <h1 className='text-2xl text-center mt-[10px]'>Login</h1>
      <form className='w-[100%] relative' onSubmit={handleLogin} >
        <TextField
          id="filled-search"
          label="Email address"
          variant="filled"
          type='email'
          sx={{
            marginTop: '30px',
            width: '100%',
            '& .css-e2jmdx': {
              borderBottom: `${error.emailError && '1px solid #FC4747 !important'}`
            }
          }}
          value={email}
          onChange={(e: EventType[`InputEvent`]) => handleChange(e, "email")}

        />
        {error.emailError && (
          <p className="text-secondary text-[12px] absolute right-0 top-[60px]">Can't be empty</p>
        )}
        <TextField
          id="filled-search"
          label="Password"
          variant="filled"
          type='text'
          sx={{
            marginTop: '20px',
            width: '100%',
            '& .css-e2jmdx': {
              borderBottom: `${error.passwordError && '1px solid #FC4747 !important'}`
            }
          }}
          value={password}
          onChange={(e: EventType[`InputEvent`]) => handleChange(e, "password")}
        />
        {error.passwordError && (
          <p className="text-secondary text-[12px] absolute right-0 top-[140px]">Can't be empty</p>
        )}

        <LoadingButton
          loadingPosition="start"
          onClick={handleLogin}
          loading={loading}
          style={{
            marginTop: '30px',
            marginBottom: '20px',
          }}
        >
          {!loading && "Login to your account"}
        </LoadingButton>
      </form>
      <div className='flex items-center justify-center gap-3 mb-[20px]'>
        <p>Don't have an account?</p>
        <div role='button' className='text-secondary' onClick={() => setisLogin(false)}>Sign up</div>
      </div>

    </main>
  )
}

export default Login