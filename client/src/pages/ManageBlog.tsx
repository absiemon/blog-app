import SearchIcon from '@mui/icons-material/Search';
import { useEffect, useState } from 'react';
import UserBlogs from '../components/home/UserBlogs';
import { useNavigate, useParams } from 'react-router-dom';
import BlogOperation from '../components/reusable/BlogOperation';
import { LoadingButton } from '@mui/lab';

function ManageBlogPage() {

    //===================States for searching and pagination 
    const navigate = useNavigate()

    const [searchQuery, setSearchQuery] = useState<string>(""); //state for onChange of input box
    const [searchInput, setSearchInput] = useState<string>("");  //state for searching blogs
    const [pageNo, setPageNo] = useState<number>(1)
    const [blogId, setBlogId] = useState<string>()

    const [open, setOpen] = useState(false); // Drawer open state
    const { id } = useParams();

    const handleSearch = async () => {
        setPageNo(1)
        setSearchInput(searchQuery)
    }

    useEffect(() => {
        if (id) {
            setBlogId(id)
            setOpen(true)
        }
    }, [id])

    const handleClose = () => {
        setOpen(false)
        navigate('/home/manage-blog')
    }

    return (
        <main className='flex flex-col xs:w-[100%] sm:w-[100%] md:w-[88vw] gap-6'>
            <header className='bg-secondary h-[50px] rounded-xl flex gap-2 items-center px-3'>
                <SearchIcon sx={{ color: 'white' }} />
                <input
                    type='text'
                    placeholder='Search for blogs by title'
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            handleSearch();
                        }
                    }}
                />
            </header>

            <div className=' flex items-end justify-end w-full '>

                <LoadingButton
                    loadingPosition="start"
                    onClick={() => setOpen(true)}
                    style={{
                        marginBottom: '0px !important',
                        marginTop: '0px !important'
                    }}
                    className='w-full sm:w-[20%]'
                >
                    Create
                </LoadingButton>
            </div>

            <section className=''>
                <UserBlogs searchInput={searchInput} pageNo={pageNo} setPageNo={setPageNo} />
            </section>

            {(open || blogId) &&
                <div className='flex items-center justify-center w-1/2'>
                    <BlogOperation open={open} setOpen={setOpen} handleClose={handleClose} />
                </div>
            }

        </main>
    )
}

export default ManageBlogPage