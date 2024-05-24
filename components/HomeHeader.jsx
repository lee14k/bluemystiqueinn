import Image from 'next/image';
const HomeHeader = () => {
    return(
    <div className='hh-bg flex flex-col justify-center items-center' >
        <Image
        src="/bmlogov2.png"
        alt="Blue Mystique Inn logo"
        width={400}
        height={400}
        className='text-timer'
        />
        <div className='flex flex-col justify-center items-center text-white text-timer'>
        <h2 className="text-2xl my-2">Welcome to</h2>
        <h1 className='text-8xl my-2'>The Blue Mystique Inn</h1>
        <h2 className="text-2xl my-2">Boutique Inn in Manistique, Michigan</h2>
        <button className="text-4xl my-2">Book your Stay</button>
    </div>
    </div>
    )
}

export default HomeHeader;