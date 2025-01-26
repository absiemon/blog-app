import EditIcon from '@mui/icons-material/Edit';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import './reusable.css'
import { useNavigate } from 'react-router-dom';
import { BlogCategory } from '../../types/types';
import moment from 'moment';
import { useContext } from 'react';
import { AppContext } from '../../context/AppContext';

interface EditableBlogCardProps {
    imageUrl: string;
    title?: string;
    id?: string;
    category: BlogCategory;
    releaseDate?: string;
    bookmark?: boolean;
    bookmarkId?: any;
}

function EditableBlogCard({ title, id, category, releaseDate, }: EditableBlogCardProps) {

    const { isAdmin } = useContext(AppContext)

    const navigate = useNavigate()

    const handleEditBlog = async () => {
        navigate(`/home/manage-blog/${id}`)
    }

    return (
        <div className='h-[250px] w-[300px] relative videCard-container rounded-lg shadow-2xl flex justify-end flex-col p-4 bg-[#1e2e3d]'>

            {isAdmin &&
                <div className={`absolute top-3 right-3 bg-gray-600 bg-opacity-50  h-10 w-10 flex items-center justify-center rounded-full hover:bg-white cursor-pointer hover:text-black `}
                >
                    <EditIcon onClick={handleEditBlog} />
                </div>
            }

            <div
                className='gap-2 absolute top-[70px] left-[90px] bg-white bg-opacity-30 p-2 rounded-full text-xl hidden cursor-pointer play-container'
                role='button'
                onClick={() =>
                    navigate(`/home/blog/${id}`)
                }
            >
                <PlayCircleIcon sx={{ fontSize: '30px' }} />
                <p>Read</p>
            </div>

            <div className='flex gap-7 text-white opacity-50 text-base mt-2'>
                <p>{moment(releaseDate).format('MMMM Do')}</p>
                <ul className='flex list-disc gap-6'>
                    <li>{category?.name}</li>
                </ul>
            </div>
            <h1 className='text-lg font-medium'>
                {
                    title?.slice(0, 20)
                }
            </h1>

        </div>
    )
}

export default EditableBlogCard