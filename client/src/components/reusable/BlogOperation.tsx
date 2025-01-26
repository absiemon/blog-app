import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Drawer,
    TextField,
    TextareaAutosize,
    MenuItem,
    Select,
    Typography,
    FormControl,
    FormHelperText,
} from '@mui/material';
import { Close } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import axiosServices from '../../utills/axios';
import { AppContext } from '../../context/AppContext';
import { Category } from '../../types/types';

interface queryParamsType {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>; // Type for setOpen
    handleClose: () => void; // Type for handleClose;
}

const BlogOperation = ({ open, setOpen, handleClose }: queryParamsType) => {

    const { setBlogs, blogs } = useContext(AppContext)

    const { id } = useParams(); // Get blog ID from URL params (for edit mode)
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [category, setCategory] = useState('');
    const [categories, setCategories] = useState<Category[]>([]); // List of categories from backend

    // Error states
    const [titleError, setTitleError] = useState(false);
    const [contentError, setContentError] = useState(false);
    const [categoryError, setCategoryError] = useState(false);

    // Loading state
    const [loading, setLoading] = useState(false);

    // Fetch categories from backend
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axiosServices.get('/blog/category');
                setCategories(response.data?.data);
            }
            catch (error) {
                console.error('Failed to fetch categories:', error);
            }
        };
        fetchCategories();
    }, []);

    // Fetch blog data if in edit mode
    useEffect(() => {
        if (id) {
            const fetchBlog = async () => {
                try {
                    const response = await axiosServices.get(`/blog/${id}`);
                    const { title, content, category } = response.data?.data;
                    setTitle(title);
                    setContent(content);
                    setCategory(category?._id);
                }
                catch (error) {
                    console.error('Failed to fetch blog:', error);
                }
            };
            fetchBlog();
        }
        else {
            setTitle('');
            setContent('');
            setCategory('');
        }
    }, [id]);

    // Validate form fields
    const validateForm = () => {
        let isValid = true;

        if (!title.trim()) {
            setTitleError(true);
            isValid = false;
        } else {
            setTitleError(false);
        }

        if (!content.trim()) {
            setContentError(true);
            isValid = false;
        } else {
            setContentError(false);
        }

        if (!category) {
            setCategoryError(true);
            isValid = false;
        } else {
            setCategoryError(false);
        }

        return isValid;
    };

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate form fields
        if (!validateForm()) {
            return;
        }

        const blogData = { title, content, category };

        setLoading(true); // Start loading

        try {
            if (id) {
                // Update blog
                const res = await axiosServices.put(`/blog/${id}`, blogData);

                const index = blogs?.findIndex(blog => blog._id === id);
                const newData = { ...blogs[index], ...res?.data?.data };
                blogs[index] = newData
            }
            else {
                // Create blog
                const res = await axiosServices.post('/blog', blogData);
                setBlogs([...blogs, res.data?.data]); // Add new blog to the list
            }

            // Close the drawer and reset form on success
            setOpen(false);
            setTitle('');
            setContent('');
            setCategory('');
            navigate('/home/manage-blog'); // Redirect to blogs page
        }
        catch (error) {
            console.error('Failed to save blog:', error);
        }
        finally {
            setLoading(false); // Stop loading
        }
    };


    return (
        <Drawer
            anchor="top"
            open={open}
            onClose={handleClose}
            PaperProps={{
                style: {
                    backgroundColor: '#161D2F',
                    color: '#5A698F',
                    fontFamily: 'Poppins, sans-serif',
                    padding: '20px',
                },
            }}
        >
            <div className="flex justify-between items-center mb-4">
                <Typography variant="h6" className='text-white'>
                    Blog Operation
                </Typography>
                <Close
                    className="cursor-pointer"
                    onClick={handleClose}
                />
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Title Field */}
                <TextField
                    id="title"
                    label="Title"
                    variant="filled"
                    type="text"
                    sx={{
                        marginTop: '30px',
                        width: '100%',
                        '& .MuiFilledInput-root': {
                            backgroundColor: titleError ? '#FFEBEE' : 'inherit', // Red background if error
                        },
                        border: '1px solid white !important'
                    }}
                    value={title}
                    onChange={(e) => {
                        setTitle(e.target.value);
                        setTitleError(false); // Clear error when user types
                    }}
                    error={titleError}
                    helperText={titleError ? 'Title is required' : ''}
                />

                {/* Content Field */}
                <TextareaAutosize
                    minRows={5}
                    placeholder="Content"
                    value={content}
                    onChange={(e) => {
                        setContent(e.target.value);
                        setContentError(false); // Clear error when user types
                    }}
                    style={{
                        width: '100%',
                        backgroundColor: contentError ? '#FFEBEE' : '#161D2F', // Red background if error
                        color: 'white',
                        border: `1px solid ${contentError ? '#FF1744' : 'white'}`, // Red border if error
                        borderRadius: '4px',
                        padding: '10px',
                    }}
                />
                {contentError && (
                    <FormHelperText error style={{ marginTop: '5px' }}>
                        Content is required
                    </FormHelperText>
                )}

                {/* Category Field */}
                <FormControl variant="filled" sx={{ marginTop: '20px', width: '100%' }}>
                    <Select
                        labelId="category-label"
                        id="category"
                        value={category}
                        onChange={(e) => {
                            setCategory(e.target.value);
                            setCategoryError(false); // Clear error when user selects
                        }}
                        error={categoryError}
                        displayEmpty
                        sx={{
                            backgroundColor: categoryError ? '#FFEBEE' : 'inherit', // Red background if error
                            border: '1px solid white !important',
                            '&.MuiMenu-list': {
                                color: 'white !important',
                            },
                            '&.MuiMenuItem-root': {
                                fontSize: '16px !important',
                            }
                        }}
                    >
                        <MenuItem value="" disabled>
                            Select Category
                        </MenuItem>
                        {categories?.map((cat) => (
                            <MenuItem key={cat?._id} value={cat?._id}>
                                {cat?.name}
                            </MenuItem>
                        ))}
                    </Select>
                    {categoryError && (
                        <FormHelperText error style={{ marginTop: '5px' }}>
                            Category is required
                        </FormHelperText>
                    )}
                </FormControl>

                {/* Submit Button */}
                <LoadingButton
                    loadingPosition="start"
                    loading={loading}
                    style={{
                        marginTop: '20px',
                        width: '20%',
                    }}
                    onClick={handleSubmit}
                >
                    Publish
                </LoadingButton>
            </form>
        </Drawer>
    );
};

export default BlogOperation;