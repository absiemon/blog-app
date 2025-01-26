import { roles } from '../config/appConfig.js';
import User from '../schema/user.js';
import { AppError } from '../utills/errorHandlers.js';
import { menuItems } from './data.js';

/**
 * @type {expressParams}
 */
export const getSidebarMenuItems = async (req, res, next) => {
    try {
        const userId = req?.user?._id;

        // Fetch user role
        const userData = await User.findById(userId).select('role');

        // Deconstruct children from menu items
        const { children, ...restData } = menuItems;

        // Filter menu items based on role
        const filteredMenuItems = children.reduce((acc, item) => {
            const { id, children: subChildren, ...itemData } = item;
            let newItem = null;

            // Determine if each item should be added based on permissions
            if ((id === 'manage_blog' && userData.role === roles.ADMIN) || ['blogs'].includes(id)) {
                newItem = { ...itemData, id };
            }

            if (newItem && (!newItem.children || newItem.children.length > 0)) {
                acc.push(newItem);
            }
            return acc;
        }, []);

        // Send filtered menu items in response
        return res.status(200).json({
            data: {
                ...restData,
                children: filteredMenuItems
            },
        });
    }
    catch (error) {
        return next(error);
    }
};


// /**
//  * Fetch sidebar menu items based on user role
//  * @type {expressParams}
//  */
// export const getSidebarMenuItems = async (req, res, next) => {
//     try {
//         const userId = req?.user?._id;

//         // Fetch user role
//         const userData = await User.findById(userId).select('role');
//         if (!userData) {
//             return next(new AppError(
//                 "NOT_FOUND",
//                 404,
//                 "User not found."
//             ));
//         }

//         const { children, ...restData } = menuItems;

//         // Filter menu items based on role
//         const filteredMenuItems = children.filter((item) => {
//             // Always show the 'blogs' tab
//             if (item.id === 'blogs') {
//                 return true;
//             }

//             // Show 'manage_blog' tab only for admin users
//             if (item.id === 'manage_blog' && userData.role === roles.ADMIN) {
//                 return true;
//             }

//             // Hide other tabs that don't match the conditions
//             return false;
//         });

//         // Send filtered menu items in response
//         return res.status(200).json({
//             data: { ...restData, children: filteredMenuItems },
//         });
//     }
//     catch (error) {
//         return next(error);
//     }
// };