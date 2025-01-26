import { useContext, useEffect } from 'react'
import MenuBookIcon from '@mui/icons-material/MenuBook';
import LogoutIcon from '@mui/icons-material/Logout';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import GridViewIcon from '@mui/icons-material/GridView';

import { Link } from 'react-router-dom';
import { Avatar, Tooltip } from '@mui/material';
import { AppContext } from '../context/AppContext';

function sidebar() {
    const { user, menuItems, fetchMenuItems, handleLogOut } = useContext(AppContext)

    useEffect(() => {
        fetchMenuItems()
    }, [])

    const mapIcons = (icon: string) => {
        if (icon === 'LibraryBooksIcon') {
            return <LibraryBooksIcon />
        }
        else if (icon === 'GridViewIcon') {
            return <GridViewIcon />
        }
    }

    return (
        <header
            className='xs:h-[15vh] sm:h-[10vh] md:h-[60vh] xs:w-[100%] md:w-[5vw] bg-secondary 
            md:rounded-2xl sm:flex md:flex-col items-center py-4 justify-between md:fixed 
            md:overflow-y-scroll xs:px-5 md:px-0 xs:mb-4 md:mb-0'
        >
            <div className='xs:flex w-[100%] items-center justify-center sm:block md:flex'>
                <MenuBookIcon
                    sx={{ fontSize: '30px', color: '#FC4747' }}
                />
            </div>

            <div className='flex md:flex-col items-center justify-center gap-5'>

                {menuItems?.children.map((item, index) => {
                    return (
                        <Link key={index} to={`${item.url}`}>
                            <Tooltip title={item.title} placement='right-start' >
                                <>{mapIcons(item.icon)}</>
                            </Tooltip>
                        </Link>
                    )
                })}

                <div className='flex md:flex-col items-center gap-6  sm:ml-[150px] md:ml-[0px] md:mt-[150px]'>
                    <Tooltip title="Logout" placement='right-start' >
                        <div className='text-[#5A698F] hover:text-[#FFFFFF] cursor-pointer' onClick={handleLogOut}>
                            <LogoutIcon />
                        </div>
                    </Tooltip>

                    <Avatar sx={{ backgroundColor: '#FC4747', color: '#FFFFFF' }}>
                        {user?.email?.charAt(0).toUpperCase()}
                    </Avatar>
                </div>
            </div>

        </header>
    )
}

export default sidebar