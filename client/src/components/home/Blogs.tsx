//This component will show all Blogs videos
import { useContext, useEffect, useState } from 'react'
import BlogCard from '../reusable/BlogCard';
import SkeletonLoader from '../reusable/SkeletonLoader';
import PaginationComponent from '../reusable/Pagination';
import NothingToShow from '../reusable/NothingToShow';
import { Blog } from '../../types/types'
import { AppContext } from '../../context/AppContext';

//Defining the type of props that he can accept
interface propType {
    searchInput: string;
    sortBy: string;
    pageNo: number,
    setPageNo: React.Dispatch<React.SetStateAction<number>>;
}

function Blogs({ searchInput, pageNo, setPageNo, sortBy }: propType) {

    const { loading, blogs, fetchBlogs, totalPages } = useContext(AppContext)

    const [allBlogs, setAllBlogs] = useState<Blog[]>([])

    useEffect(() => {
        setAllBlogs(blogs)
    }, [blogs])

    useEffect(() => {
        fetchBlogs({
            title: searchInput,
            sortBy: sortBy,
            page: pageNo,
            limit: 10
        })
    }, [searchInput, pageNo, sortBy])


    return (
        <section className=''>
            <h1 className='text-xl'>
                {!searchInput ? "Blogs for you" : `Found ${allBlogs?.length * totalPages} results of '${searchInput}'`}
            </h1>
            {!loading ?

                <div className='flex items-center justify-center sm:container sm:block'>
                    {allBlogs?.length > 0 ?
                        <>
                            <div className='grid bdsm:grid-cols-2 md:grid-cols-3 bdmd:grid-cols-4 xl:grid-cols-4  gap-x-4 gap-y-10 mt-4'>
                                {allBlogs && allBlogs.map((blog) => {
                                    return (
                                        <BlogCard
                                            imageUrl={""}
                                            title={blog.title}
                                            id={blog._id}
                                            category={blog.category}
                                            releaseDate={blog.updatedAt}
                                        />
                                    )
                                })}
                            </div>
                        </>
                        :
                        <NothingToShow />
                    }
                </div>
                :
                <SkeletonLoader />
            }

            <PaginationComponent count={totalPages} setPageNo={setPageNo} />

        </section>
    )
}

export default Blogs