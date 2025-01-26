//Page to add and modify Favourite Genres
import { Container } from '@mui/material'
import { useContext, useEffect, useState } from 'react'
import CheckIcon from '@mui/icons-material/Check';
import axios from 'axios';
import { LoadingButton } from '@mui/lab';
import { AppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import Loader from '../components/customLoader/Loader';

//Definf the type of genres object
interface allGenresType {
    name: string;
    id: number;
}

function FavGenres() {
    const { setSnackbar } = useContext(AppContext)
    const navigate = useNavigate()

    //State for genres
    const [allGenres, setAllGenres] = useState<allGenresType[]>([])

    //State for showing loader when all genres is being fetched from the server
    const [loading, setLoading] = useState<boolean>(false)

    //State for showing loading icon when form is submitting
    const [buttonLoading, setButtonLoading] = useState<boolean>(false)

    //State to store all selected genres
    const [selectedGenres, setSelectedGenres] = useState<number[]>([])

    //Fetching all genres when page loads
    useEffect(() => {
        const fetchGenres = async () => {
            const token = localStorage.getItem('token')
            try {
                setLoading(true)
                await axios.get(
                    '/dashboard/get/genres',
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                )
                    .then((response) => {
                        setAllGenres(response.data?.data?.genres)
                        setSelectedGenres(response.data?.favGenres?.genres || [])
                        setLoading(false)
                    })
                    .catch(() => {
                        setLoading(false)
                        setSnackbar((prev) => {
                            return { ...prev, open: true, message: "Some error occured" };
                        });
                    })
            } catch (error) {
                console.log(error)
            }
        }
        fetchGenres()
    }, [])

    //Function to handle genres selction and removal
    const handleGenresClick = (id: number) => {
        setSelectedGenres((prevGenres) => {
            const index = prevGenres?.indexOf(id);
            if (index !== -1) {
                return [...prevGenres.slice(0, index), ...prevGenres.slice(index + 1)];
            } else {
                return [...prevGenres, id];
            }
        });
    }

    //Calling api to save all selected genres in database for a preticular user
    const handleAddToFav = async () => {
        const token = localStorage.getItem('token')
        setButtonLoading(true)

        await axios.post('/dashboard/add/genres', {genres: selectedGenres},
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        )
            .then(() => {
                setButtonLoading(false)
                setSnackbar((prev) => {
                    return { ...prev, open: true, message: "Favourite genres updated successfully" };
                });
                navigate('/home')

            }).catch(() => {
                setButtonLoading(false)
                setSnackbar((prev) => {
                    return { ...prev, open: true, message: "Some error occured" };
                });
            })
    }

    return (
        <Container sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '100vh', pt: 5, pb: 5 }}>

            <main className="mt-6  p-4 bg-secondary rounded-xl xs:w-[100%] sm:w-[60%]">
                <h1 className='text-2xl text-center'>
                    Choose Your Favourite
                    <br />
                    <span>Genres</span>
                </h1>
                {!loading ?

                    <div className='grid bdsm:grid-cols-2 bdmd:grid-cols-3 gap-4 mt-4'>
                        {allGenres && allGenres.map((elm) => {
                            return (
                                <div className='cursor-pointer bg-tertiary p-2 rounded-md flex justify-between' role='button'
                                    onClick={() => handleGenresClick(elm?.id)}>
                                    <p>{elm?.name}</p>
                                    {
                                        selectedGenres.includes(elm?.id) ?
                                            <CheckIcon sx={{ backgroundColor: '#161D2F', borderRadius: '20px', padding: '4px' }} />
                                            : null
                                    }
                                </div>
                            )
                        })}
                    </div>
                    :
                    <Loader />
                }
                <LoadingButton
                    loadingPosition="start"
                    onClick={handleAddToFav}
                    loading={buttonLoading}
                    disabled={selectedGenres?.length === 0}
                >
                    {!buttonLoading && "Add to favourite"}
                </LoadingButton>
            </main>
        </Container>

    )
}

export default FavGenres