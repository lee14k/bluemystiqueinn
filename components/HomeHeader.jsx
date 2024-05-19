import Image from 'next/image';
const HomeHeader = () => {
    return(
    <div className='hh-bg' >
        <Image
        src="/bmlogo.png"
        alt="Blue Mystique Inn logo"
        width={200}
        height={200}
        />
        <h2 className="text-2xl">Welcome to</h2>
        <h1>The Blue Mystique Inn</h1>
        <h2>Boutique Inn in Manistique, Michigan</h2>
        <button>Book your Stay</button>
    </div>
    )
}

export default HomeHeader;