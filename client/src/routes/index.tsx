
// This component will serve all the routes 
import { useRoutes } from 'react-router-dom';
import HomePage from '../pages/HomePage'
import AuthPage from '../pages/AuthPage'

import Layout from '../layout/index'
import { AuthGuard, AdminGuard } from '../components/auth/Guard';  // Guards
import ManageBlogPage from '../pages/ManageBlog';
import BlogDetailsPage from '../components/reusable/BlogDetailsPage';

export default function Routes() {
    return useRoutes([
        {
            path: '/',
            children: [
                {
                    element: <AuthPage />,
                    index: true
                },
            ]
        },

        {
            path: 'home',
            element:
                <AuthGuard>
                    <Layout />
                </AuthGuard>,
            children: [
                {
                    path: 'blogs',
                    element: <HomePage />,
                },
                {
                    path: 'blog/:id',
                    element: <BlogDetailsPage />
                },
                {
                    path: 'manage-blog',
                    element:
                        <AdminGuard>
                            <ManageBlogPage />
                        </AdminGuard>
                },
                {
                    path: 'manage-blog/:id',
                    element:
                        <AdminGuard>
                            <ManageBlogPage />
                        </AdminGuard>
                },
            ]
        },
    ]);
}