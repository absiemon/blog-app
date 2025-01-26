// import { ReactNode, useState, useLayoutEffect, createContext, Dispatch, SetStateAction } from 'react';
// import { User, snackbarType, DeviceDetails, MenuItems, Blog, FetchBlogsParams } from '../types/types'
// import { useNavigate } from "react-router-dom";
// import { getDeviceDetails } from '../utills';
// import axiosServices from '../utills/axios';
// import { StorageManager } from '../utills/storageManager';

// interface AppProviderProps {
//   children: ReactNode;
// }

// //Defing the type of all its export items
// interface AppContextType {
//   isAppLoading: boolean;
//   setisAppLoading: Dispatch<SetStateAction<boolean>>;

//   isAuthenticated: boolean;
//   setIsAuthenticated: Dispatch<SetStateAction<boolean>>;

//   user: User | undefined;
//   setUser: Dispatch<SetStateAction<User | undefined>>;

//   snackbar: snackbarType;
//   setSnackbar: Dispatch<SetStateAction<snackbarType>>;

//   handleClose: any;

//   loading: boolean;
//   setLoading: Dispatch<SetStateAction<boolean>>;

//   pageNo: number;
//   setPageNo: Dispatch<SetStateAction<number>>;

//   totalPages: number;
//   setTotalPages: Dispatch<SetStateAction<number>>;

//   totalCount: number;
//   setTotalCount: Dispatch<SetStateAction<number>>;

//   deviceDetails: DeviceDetails | undefined;
//   setDeviceDetails: Dispatch<SetStateAction<DeviceDetails | undefined>>;

//   menuItems: MenuItems | undefined;
//   setMenuItems: Dispatch<SetStateAction<MenuItems | undefined>>;

//   blogs: Blog[] | undefined;
//   setBlogs: Dispatch<SetStateAction<Blog[]>>;

//   singleBlog: Blog | undefined;
//   setSingleBlog: Dispatch<SetStateAction<Blog | undefined>>;

//   isAdmin: boolean;
//   setIsAdmin: Dispatch<SetStateAction<boolean>>;

//   //functions
//   fetchMenuItems: any;
//   handleLogOut: any;
//   fetchBlogs: any;
//   fetchSingleBlog: any;
//   fetchBlogsOfUser: any;
//   handleLogout: any;
// }


// export const AppContext = createContext<AppContextType>({} as AppContextType);

// export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {

//   //State to track app status 
//   const [isAppLoading, setisAppLoading] = useState(true)

//   //State to check user status whether authenticated or not
//   const [isAuthenticated, setIsAuthenticated] = useState(false);

//   //State to set the use details
//   const [user, setUser] = useState<User | undefined>(undefined);
//   const [deviceDetails, setDeviceDetails] = useState<DeviceDetails>();
//   const [menuItems, setMenuItems] = useState<MenuItems>();
//   const [isAdmin, setIsAdmin] = useState(false);

//   //State for pagination
//   const [pageNo, setPageNo] = useState<number>(1)
//   const [totalPages, setTotalPages] = useState<number>(0)
//   const [totalCount, setTotalCount] = useState<number>(0)

//   //========States for blog
//   const [blogs, setBlogs] = useState<Blog[]>([]);
//   const [singleBlog, setSingleBlog] = useState<Blog>();

//   //========================================
//   const [loading, setLoading] = useState<boolean>(true)
//   //========================================

//   const navigate = useNavigate()

//   const [snackbar, setSnackbar] = useState({
//     open: false,
//     vertical: "bottom",
//     horizontal: "right",
//     message: ""
//   })


//   const handleClose = () => {
//     setSnackbar((prev) => {
//       return { ...prev, open: false };
//     });
//   };

//   //Function to fetch user profile on each page refreash
//   const fetchMenuItems = async () => {
//     axiosServices
//       .get("/dashboard/menu")
//       .then((res) => {
//         setMenuItems(res.data?.data);
//       })
//       .catch((_err) => {
//         setIsAuthenticated(false);
//         navigate("/");
//       });
//   }

//   const fetchProfile = async () => {
//     axiosServices
//       .get("/user")
//       .then((res) => {
//         setIsAuthenticated(true);
//         setUser(res.data?.data);
//         setisAppLoading(false);
//         navigate('/home/blogs')
//       })
//       .catch((_err) => {
//         setisAppLoading(false);
//         navigate("/");
//       });
//   }

//   //Function to fetch all blogs.
//   const fetchBlogs = async ({ title, sortBy, page, limit }: FetchBlogsParams) => {

//     await axiosServices.get(
//       `/blog/?title=${title}&sortBy=${sortBy}&page=${page}&limit=${limit}`,
//     )
//       .then((response) => {
//         setBlogs(response.data?.data)
//         setTotalCount(response.data?.totalCount);
//         setTotalPages(response.data?.totalPages);
//         setLoading(false)
//       })
//       .catch((err) => {
//         setLoading(false)
//         setSnackbar((prev) => {
//           return { ...prev, open: true, message: err?.message };
//         });
//       })
//   }

//   const fetchSingleBlog = async ({ blogId }: { blogId: string }) => {

//     await axiosServices.get(
//       `/blog/${blogId}`,
//     )
//       .then((response) => {
//         setSingleBlog(response.data?.data)
//         setLoading(false)
//       })
//       .catch((err) => {
//         setLoading(false)
//         setSnackbar((prev) => {
//           return { ...prev, open: true, message: err?.message };
//         });
//       })
//   }

//   //Function to fetch all blogs of user.
//   const fetchBlogsOfUser = async ({ title, sortBy, page, limit }: FetchBlogsParams) => {

//     await axiosServices.get(
//       `/blog/user?title=${title}&sortBy=${sortBy}&page=${page}&limit=${limit}`,
//     )
//       .then((response) => {
//         setBlogs(response.data?.data)
//         setTotalCount(response.data?.totalCount);
//         setTotalPages(response.data?.totalPages);
//         setLoading(false)
//       })
//       .catch((err) => {
//         setLoading(false)
//         setSnackbar((prev) => {
//           return { ...prev, open: true, message: err?.message };
//         });
//       })
//   }


//   useLayoutEffect(() => {
//     fetchProfile()
//   }, [])

//   useLayoutEffect(() => {
//     async function fetch() {
//       const deviceDetails = await getDeviceDetails()
//       setDeviceDetails(deviceDetails)
//     }
//     fetch()
//   }, [])

//   useLayoutEffect(() => {
//     if (user) {
//       setIsAdmin(user?.role === 'ADMIN')
//     }
//   }, [user])

//   const handleLogOut = () => {
//     navigate('/')

//     new StorageManager('ACCESS_TOKEN', 'AUTH', true).deleteStorage()
//     new StorageManager('SESSION_ID', 'SESSION', true).deleteStorage()
//     new StorageManager('REFRESH_TOKEN', 'SESSION', true).deleteStorage()
//   }

//   return (
//     <AppContext.Provider
//       value={{
//         isAuthenticated,
//         setIsAuthenticated,
//         user, 
//         setUser,
//         snackbar, setSnackbar, handleClose,
//         isAppLoading, setisAppLoading,
//         loading,
//         setLoading,
//         pageNo,
//         setPageNo,
//         deviceDetails,
//         menuItems,
//         blogs,
//         setBlogs,
//         fetchMenuItems,
//         fetchBlogs,
//         totalPages,
//         totalCount,
//         fetchSingleBlog,
//         fetchBlogsOfUser,
//         singleBlog,
//         handleLogOut,
//         isAdmin,
//       }}
//     >
//       {children}
//     </AppContext.Provider>
//   );
// };

import { ReactNode, useState, useLayoutEffect, createContext, Dispatch, SetStateAction } from 'react';
import { User, snackbarType, DeviceDetails, MenuItems, Blog, FetchBlogsParams } from '../types/types';
import { useNavigate } from 'react-router-dom';
import { getDeviceDetails } from '../utills';
import axiosServices from '../utills/axios';
import { StorageManager } from '../utills/storageManager';

interface AppProviderProps {
  children: ReactNode;
}

// Define the type of all its export items
interface AppContextType {
  isAppLoading: boolean;
  setisAppLoading: Dispatch<SetStateAction<boolean>>;

  isAuthenticated: boolean;
  setIsAuthenticated: Dispatch<SetStateAction<boolean>>;

  user: User | undefined;
  setUser: Dispatch<SetStateAction<User | undefined>>;

  snackbar: snackbarType;
  setSnackbar: Dispatch<SetStateAction<snackbarType>>;

  handleClose: () => void;

  loading: boolean;
  setLoading: Dispatch<SetStateAction<boolean>>;

  pageNo: number;
  setPageNo: Dispatch<SetStateAction<number>>;

  totalPages: number;
  setTotalPages: Dispatch<SetStateAction<number>>;

  totalCount: number;
  setTotalCount: Dispatch<SetStateAction<number>>;

  deviceDetails: DeviceDetails | undefined;
  setDeviceDetails: Dispatch<SetStateAction<DeviceDetails | undefined>>;

  menuItems: MenuItems | undefined;
  setMenuItems: Dispatch<SetStateAction<MenuItems | undefined>>;

  blogs: Blog[];
  setBlogs: Dispatch<SetStateAction<Blog[]>>;

  singleBlog: Blog | undefined;
  setSingleBlog: Dispatch<SetStateAction<Blog | undefined>>;

  isAdmin: boolean;
  setIsAdmin: Dispatch<SetStateAction<boolean>>;

  // Functions
  fetchMenuItems: () => void;
  handleLogOut: () => void;
  fetchBlogs: (params: FetchBlogsParams) => void;
  fetchSingleBlog: (params: { blogId: string }) => void;
  fetchBlogsOfUser: (params: FetchBlogsParams) => void;
}

export const AppContext = createContext<AppContextType>({} as AppContextType);

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  // State to track app status
  const [isAppLoading, setisAppLoading] = useState(true);

  // State to check user status whether authenticated or not
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // State to set the user details
  const [user, setUser] = useState<User | undefined>(undefined);
  const [deviceDetails, setDeviceDetails] = useState<DeviceDetails | undefined>(undefined);
  const [menuItems, setMenuItems] = useState<MenuItems | undefined>(undefined);
  const [isAdmin, setIsAdmin] = useState(false);

  // State for pagination
  const [pageNo, setPageNo] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [totalCount, setTotalCount] = useState<number>(0);

  // States for blog
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [singleBlog, setSingleBlog] = useState<Blog | undefined>(undefined);

  const [loading, setLoading] = useState<boolean>(true);

  const navigate = useNavigate();

  const [snackbar, setSnackbar] = useState({
    open: false,
    vertical: 'bottom',
    horizontal: 'right',
    message: '',
  });

  const handleClose = () => {
    setSnackbar((prev) => {
      return { ...prev, open: false };
    });
  };

  // Function to fetch user profile on each page refresh
  const fetchMenuItems = async () => {
    axiosServices
      .get('/dashboard/menu')
      .then((res) => {
        setMenuItems(res.data?.data);
      })
      .catch((_err) => {
        setIsAuthenticated(false);
        navigate('/');
      });
  };

  const fetchProfile = async () => {
    axiosServices
      .get('/user')
      .then((res) => {
        setIsAuthenticated(true);
        setUser(res.data?.data);
        setisAppLoading(false);
        navigate('/home/blogs');
      })
      .catch((_err) => {
        setisAppLoading(false);
        navigate('/');
      });
  };

  // Function to fetch all blogs
  const fetchBlogs = async ({ title, sortBy, page, limit }: FetchBlogsParams) => {
    await axiosServices
      .get(`/blog/?title=${title}&sortBy=${sortBy}&page=${page}&limit=${limit}`)
      .then((response) => {
        setBlogs(response.data?.data);
        setTotalCount(response.data?.totalCount);
        setTotalPages(response.data?.totalPages);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        setSnackbar((prev) => {
          return { ...prev, open: true, message: err?.message };
        });
      });
  };

  const fetchSingleBlog = async ({ blogId }: { blogId: string }) => {
    await axiosServices
      .get(`/blog/${blogId}`)
      .then((response) => {
        setSingleBlog(response.data?.data);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        setSnackbar((prev) => {
          return { ...prev, open: true, message: err?.message };
        });
      });
  };

  // Function to fetch all blogs of user
  const fetchBlogsOfUser = async ({ title, sortBy, page, limit }: FetchBlogsParams) => {
    await axiosServices
      .get(`/blog/user?title=${title}&sortBy=${sortBy}&page=${page}&limit=${limit}`)
      .then((response) => {
        setBlogs(response.data?.data);
        setTotalCount(response.data?.totalCount);
        setTotalPages(response.data?.totalPages);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        setSnackbar((prev) => {
          return { ...prev, open: true, message: err?.message };
        });
      });
  };

  useLayoutEffect(() => {
    fetchProfile();
  }, []);

  useLayoutEffect(() => {
    async function fetch() {
      const deviceDetails = await getDeviceDetails();
      setDeviceDetails(deviceDetails);
    }
    fetch();
  }, []);

  useLayoutEffect(() => {
    if (user) {
      setIsAdmin(user?.role === 'ADMIN');
    }
  }, [user]);

  const handleLogOut = () => {
    navigate('/');

    new StorageManager('ACCESS_TOKEN', 'AUTH', true).deleteStorage();
    new StorageManager('SESSION_ID', 'SESSION', true).deleteStorage();
    new StorageManager('REFRESH_TOKEN', 'SESSION', true).deleteStorage();
  };

  return (
    <AppContext.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        user,
        setUser,
        snackbar,
        setSnackbar,
        handleClose,
        isAppLoading,
        setisAppLoading,
        loading,
        setLoading,
        pageNo,
        setPageNo,
        deviceDetails,
        setDeviceDetails,
        menuItems,
        setMenuItems,
        blogs,
        setBlogs,
        fetchMenuItems,
        fetchBlogs,
        totalPages,
        setTotalPages,
        totalCount,
        setTotalCount,
        fetchSingleBlog,
        fetchBlogsOfUser,
        singleBlog,
        setSingleBlog,
        handleLogOut,
        isAdmin,
        setIsAdmin,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
