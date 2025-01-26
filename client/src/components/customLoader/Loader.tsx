//This Component is for showing loader when app is loading
import MenuBookIcon from '@mui/icons-material/MenuBook';
import './Loader.css'; 

//Coponent to create a custome Loader
const Loader = () => {
  return (
    <div className="loader-container">
      <div className="loading-icon">
        <MenuBookIcon 
            sx={{fontSize:'50px', color:'#FC4747'}}
        />
      </div>
      <p className='text-sm text-primary'>Getting ready...</p>
    </div>
  );
};

export default Loader;