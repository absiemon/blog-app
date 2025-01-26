//This component will show empty box if Nothing is present
import box from '../../assets/box.png'

function NothingToShow() {
  return (
    <div className='flex w-full flex-col items-center justify-center mt-14'>
        <img src={box} alt='box icon' className='w-[70px] h-[70px]'/>
        <p className='text-primary'>Nothing to show here</p>
    </div>
  )
}

export default NothingToShow