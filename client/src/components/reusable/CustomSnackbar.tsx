//This component will show the popup on error and success state
import { Snackbar } from "@mui/material";
import { useContext } from "react";
import { AppContext } from "../../context/AppContext";


// Component to messages
function CustomSnackbar() {
    const {snackbar, handleClose} = useContext(AppContext)
    const {vertical, horizontal, open, message} = snackbar;

  return (
    <>
      <Snackbar
        // anchorOrigin={{ `bottom` }}
        open={open}
        autoHideDuration={3000}
        onClose={handleClose}
        message={message}
        key={vertical + horizontal}
        sx={{
            '& .css-1gz1y6s':{
                backgroundColor:'#161D2F',
                color:'#FFFFFF',
                fontFamily: "'Poppins', sans-serif",
            }
        }}
      />
    </>
  );
}

export default CustomSnackbar;
