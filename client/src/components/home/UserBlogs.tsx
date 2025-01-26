//This component will show all Blogs videos
import { useContext, useEffect, useState } from 'react'
import SkeletonLoader from '../reusable/SkeletonLoader';
import PaginationComponent from '../reusable/Pagination';
import NothingToShow from '../reusable/NothingToShow';
import { Blog } from '../../types/types'
import { AppContext } from '../../context/AppContext';
import EditableBlogCard from '../reusable/EditableBlogCard';

//Defining the type of props that he can accept
interface propType {
    searchInput: string;
    pageNo: number,
    setPageNo: React.Dispatch<React.SetStateAction<number>>;
}

function UserBlogs({ searchInput, pageNo, setPageNo }: propType) {

    const { loading, blogs, fetchBlogsOfUser, totalPages } = useContext(AppContext)

    const [allBlogs, setAllBlogs] = useState<Blog[]>([])

    //Fetching all the Blogs  on component mount
    //This user effect will run whenever change in pageNo and searchInput
    useEffect(() => {
        setAllBlogs(blogs)
    }, [blogs])

    useEffect(() => {
        fetchBlogsOfUser({
            title: searchInput,
            sortBy: 'asc',
            page: pageNo,
            limit: 10
        })
    }, [searchInput, pageNo])


    return (
        <section className=''>
            <h1 className='text-xl'>
                {!searchInput ? "Your blogs" : `Found ${allBlogs?.length * totalPages} results of '${searchInput}'`}
            </h1>
            {!loading ?

                <div className='flex items-center justify-center sm:container sm:block'>
                    {allBlogs?.length > 0 ?
                        <>
                            <div className='grid bdsm:grid-cols-2 md:grid-cols-3 bdmd:grid-cols-4 xl:grid-cols-4  gap-x-4 gap-y-10 mt-4'>
                                {allBlogs && allBlogs.map((blog) => {
                                    return (
                                        <EditableBlogCard
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

export default UserBlogs