//Component to show skeleton loading when vidoe detail is being fetched from the server
import Skeleton from '@mui/material/Skeleton';
import { useEffect, useState } from 'react';

function VideoDetailsLoader() {

    const [windowWidth, setWindowWidth] = useState<number>(window.innerWidth);
    useEffect(() => {
        const handleResize = () => {
          setWindowWidth(window.innerWidth);
        };
        window.addEventListener('resize', handleResize);
        return () => {
          window.removeEventListener('resize', handleResize);
        };
      }, []);

    return (
        <div className='xs:block bdmd:flex gap-5 w-full h-full'>
            <Skeleton 
                variant="rectangular" 
                className='bdmd:w-[30%]'
                height={`${windowWidth < 1240 ? '20vh' : '80vh'}`} 
                sx={{ backgroundColor: '#161D2F' }} 
            />
            <Skeleton 
                variant="rectangular" 
                className='bdmd:w-[70%]'
                height={`${windowWidth < 1240 ? '60vh' : '80vh'}`} 
                sx={{ 
                    backgroundColor: '#161D2F', 
                    marginTop: `${windowWidth < 1240 && '20px'}`
                }} 
            />
        </div>
    )
}

export default VideoDetailsLoader