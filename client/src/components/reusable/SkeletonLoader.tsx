
//Component to show skeleton loading boc when vidoes is being fetched from the server
import Skeleton from '@mui/material/Skeleton';

//Define the type of prop that component can accept
interface propType{
  count?: number
}

function SkeletonLoader({count = 20}: propType) {

  return (
    <div className="grid bdsm:grid-cols-2 md:grid-cols-3 bdmd:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4  mt-4">
      
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="">
          <Skeleton variant="rectangular" width={'250px'} height={'170px'} sx={{ backgroundColor: '#161D2F' }} />
          <Skeleton width={'250px'} sx={{ backgroundColor: '#161D2F' }} />
        </div>
      ))}
    </div>
  );
}

export default SkeletonLoader;
