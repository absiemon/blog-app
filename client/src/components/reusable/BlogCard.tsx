import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import './reusable.css'
import { useNavigate } from 'react-router-dom';
import { BlogCategory } from '../../types/types';
import moment from 'moment';


interface BlogCardProps {
    imageUrl: string;
    title?: string;
    id?: string;
    category: BlogCategory;
    releaseDate?: string;
    bookmark?: boolean;
    bookmarkId?: any;
}

function BlogCard({ title, id, category, releaseDate, }: BlogCardProps) {

    const navigate = useNavigate()

    return (
        <div className='h-[250px] w-[300px] relative videCard-container rounded-lg shadow-2xl flex justify-end flex-col p-4 bg-[#1e2e3d]'>

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

export default BlogCard