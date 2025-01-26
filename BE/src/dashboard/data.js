export const menuItems = {
    id: 'home',
    title: "",
    url: '/home',
    icon: 'IconDashboard',
    class: 'home_tab',
    children: [
        {
            id: 'blogs',
            title: "Blogs",
            url: '/home/blogs',
            icon: 'LibraryBooksIcon',
            class: 'blogs_tab',
        },
        {
            id: 'manage_blog',
            title: "Manage Blog",
            url: '/home/manage-blog',
            icon: 'GridViewIcon',
            class: 'manage_blog'
        },
    ]
};
