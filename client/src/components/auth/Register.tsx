
import React, { useContext, useState } from 'react';
import { TextField, MenuItem, Select, FormControl, SelectChangeEvent } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import { AppContext } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { StorageManager } from '../../utills/storageManager';
import axiosServices from '../../utills/axios';

// Defining the type of props that the component can accept
interface RegisterProps {
    setIsLogin: React.Dispatch<React.SetStateAction<boolean>>;
}

// Defining the type for the event object of input type text
interface EventType {
    InputEvent: React.ChangeEvent<HTMLInputElement>;
}

function Register({ setIsLogin }: RegisterProps) {
    const { setUser, setIsAuthenticated, setSnackbar, deviceDetails } = useContext(AppContext);
    const navigate = useNavigate();

    // Defining the state for error handling
    const [error, setError] = useState({
        nameError: false,
        emailError: false,
        passwordError: false,
        repeatPassError: false,
        roleError: false,
    });

    // Defining the state for inputs
    const [role, setRole] = useState<string>('ADMIN'); // Default role is 'USER'
    const [name, setName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [repeatPass, setRepeatPass] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);

    // Function to handle registration after all input validation
    const handleRegister = (event: React.FormEvent) => {
        event.preventDefault();

        // Validate inputs
        if (!name || !email || !password || !repeatPass || !role) {
            setError((prev) => ({
                ...prev,
                nameError: !name,
                emailError: !email,
                passwordError: !password,
                repeatPassError: !repeatPass,
                roleError: !role,
            }));
            return;
        }

        if (repeatPass !== password) {
            setError((prev) => ({
                ...prev,
                repeatPassError: true,
            }));
            return;
        }

        setLoading(true);

        // Send registration request
        axiosServices
            .post('/auth/signup', { name, email, password, role, device_info: deviceDetails })
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
                setSnackbar((prev) => ({
                    ...prev,
                    open: true,
                    message: error?.message,
                }));
            });
    };

    // Single function to handle input change of all inputs
    const handleChange = (e: EventType['InputEvent'], field: string) => {
        const text = e.target.value;
        const newField = field + 'Error';

        // Removing error state if value in a particular input changes
        if (text) {
            setError((prev) => ({
                ...prev,
                [newField]: false,
            }));
        }

        if (field === 'name') setName(text);
        if (field === 'email') setEmail(text);
        else if (field === 'password') setPassword(text);
        else if (field === 'repeatPass') setRepeatPass(text);
    };

    // Handle role change
    const handleRoleChange = (e: SelectChangeEvent<string>) => {
        const selectedRole = e.target.value as string;
        setRole(selectedRole);
        setError((prev) => ({
            ...prev,
            roleError: false,
        }));
    };

    return (
        <main className="bg-secondary shadow-xl md:w-[60%] bdmd:w-[40%] py-2 px-4 rounded-xl">
            <h1 className="text-2xl text-center mt-[10px]">Sign Up</h1>

            <form className="w-[100%] relative">

                <FormControl variant="filled" sx={{ marginTop: '20px', width: '100%' }}>
                    <Select
                        labelId="role-label"
                        id="role"
                        value={role}
                        onChange={handleRoleChange}
                        sx={{
                            '& .css-e2jmdx': {
                                borderBottom: `${error.roleError && '1px solid #FC4747 !important'}`,
                            },
                        }}
                    >
                        <MenuItem value="USER">User</MenuItem>
                        <MenuItem value="ADMIN">Admin</MenuItem>
                    </Select>
                </FormControl>
                {error.roleError && (
                    <p className="text-secondary text-[12px] absolute right-0 top-[290px]">Please select a role</p>
                )}

                <TextField
                    id="name"
                    label="Name"
                    variant="filled"
                    type="text"
                    sx={{
                        marginTop: '30px',
                        width: '100%',
                        '& .css-e2jmdx': {
                            borderBottom: `${error.emailError && '1px solid #FC4747 !important'}`,
                        },
                    }}
                    value={name}
                    onChange={(e: EventType['InputEvent']) => handleChange(e, 'name')}
                />
                {error.nameError && (
                    <p className="text-secondary text-[12px] absolute right-0 top-[60px]">Can't be empty</p>
                )}

                <TextField
                    id="email"
                    label="Email address"
                    variant="filled"
                    type="email"
                    sx={{
                        marginTop: '30px',
                        width: '100%',
                        '& .css-e2jmdx': {
                            borderBottom: `${error.emailError && '1px solid #FC4747 !important'}`,
                        },
                    }}
                    value={email}
                    onChange={(e: EventType['InputEvent']) => handleChange(e, 'email')}
                />
                {error.emailError && (
                    <p className="text-secondary text-[12px] absolute right-0 top-[60px]">Can't be empty</p>
                )}

                <TextField
                    id="password"
                    label="Password"
                    variant="filled"
                    type="password"
                    sx={{
                        marginTop: '20px',
                        width: '100%',
                        '& .css-e2jmdx': {
                            borderBottom: `${error.passwordError && '1px solid #FC4747 !important'}`,
                        },
                    }}
                    value={password}
                    onChange={(e: EventType['InputEvent']) => handleChange(e, 'password')}
                />
                {error.passwordError && (
                    <p className="text-secondary text-[12px] absolute right-0 top-[140px]">Can't be empty</p>
                )}

                <TextField
                    id="repeatPass"
                    label="Repeat password"
                    variant="filled"
                    type="password"
                    sx={{
                        marginTop: '20px',
                        width: '100%',
                        '& .css-e2jmdx': {
                            borderBottom: `${error.repeatPassError && '1px solid #FC4747 !important'}`,
                        },
                    }}
                    value={repeatPass}
                    onChange={(e: EventType['InputEvent']) => handleChange(e, 'repeatPass')}
                />
                {error.repeatPassError && (
                    <p className="text-secondary text-[12px] absolute right-0 top-[215px]">Should match with password</p>
                )}

                <LoadingButton
                    loadingPosition="start"
                    onClick={handleRegister}
                    loading={loading}
                    style={{
                        marginTop: '30px',
                        marginBottom: '20px',
                    }}
                >
                    {!loading && 'Create an account'}
                </LoadingButton>

            </form>

            <div className="flex items-center justify-center gap-3 mb-[20px]">
                <p>Already have an account?</p>
                <div role="button" className="text-secondary" onClick={() => setIsLogin(true)}>
                    Login
                </div>
            </div>
        </main>
    );
}

export default Register;