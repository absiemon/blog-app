import { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';
import { Blog } from '../../types/types';
import BlogDetailsLoader from './BlogDetailsLoader';
import moment from 'moment';
import ExpandableContent from './ExpndableContent';

function BlogDetailsPage() {
  const { singleBlog, fetchSingleBlog, loading } = useContext(AppContext)

  const params = useParams();
  const blogId = params.id || '';

  const [blog, setBlog] = useState<Blog>()

  useEffect(() => {
    setBlog(singleBlog)
  }, [singleBlog])

  useEffect(() => {
    fetchSingleBlog({
      blogId: blogId,
    })
  }, [])

  return (

    <main className='xs:block bdmd:flex w-full gap-20'>

      {loading ? (
        <BlogDetailsLoader />
      ) : (
        <>

          <section className=' flex flex-col gap-4 w-full h-full bdmd:justify-between px-3 xs:mt-5 bdmd:mt-0'>
            <h1 className='text-3xl font-semibold'>
              {blog?.title || "No title provided"}
            </h1>

            <ul className="text-xs sm:text-sm flex flex-wrap gap-4" style={{ listStyleType: 'disc' }} >
              <li>{blog?.category?.name}</li>
              <li className='ml-4'>{blog?.author?.name || "No Author Name"}</li>
              <li className='ml-4'>{moment(blog?.updatedAt).format('MMMM D yyyy')}</li>
            </ul>

            <div className='text-justify sm:text-ellipsis'>
              <ExpandableContent
                content={blog?.content || ''}
                maxLength={4000}
              />
            </div>

          </section>
        </>
      )}

    </main>
  )
}

export default BlogDetailsPage