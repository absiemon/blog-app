import SearchIcon from '@mui/icons-material/Search';
import Recommended from '../components/home/Blogs';
import { useState } from 'react';
import { FormControl, MenuItem, Select } from '@mui/material';

function HomePage() {

  //===================States for searching and pagination 
  const [searchQuery, setSearchQuery] = useState<string>(""); //state for onChange of input box
  const [searchInput, setSearchInput] = useState<string>("");  //state for searching blogs
  const [sortBy, setSortBy] = useState<string>("asc");  //state for searching blogs
  const [pageNo, setPageNo] = useState<number>(1)


  const handleSearch = async () => {
    setPageNo(1)
    setSearchInput(searchQuery)
  }

  return (
    <main className='flex flex-col xs:w-[100%] sm:w-[100%] md:w-[88vw] gap-6'>

      <div className='sm:flex gap-4 items-center w-full'>

        <FormControl variant="filled" className='w-full sm:w-[20%]'>
          <Select
            labelId="role-label"
            id="Published At"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            sx={{
              '& .MuiFilledInput-input': {
                backgroundColor: '#161D2F !important',
                borderRadius: '11px !important'
              }
            }}
          >
            <MenuItem value="asc">Asc</MenuItem>
            <MenuItem value="desc">Desc</MenuItem>
          </Select>
        </FormControl>

        <header className='bg-secondary h-[50px] rounded-xl flex gap-2 items-center px-3 w-full sm:w-[80%]'>
          <SearchIcon sx={{ color: 'white' }} />
          <input
            type='text'
            placeholder='Search for blogs by titles'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSearch();
              }
            }}
          />
        </header>
      </div>


      <section className=''>
        <Recommended searchInput={searchInput} pageNo={pageNo} setPageNo={setPageNo} sortBy={sortBy} />
      </section>

    </main >
  )
}

export default HomePage