import Image from 'next/image';
import { Della_Respira } from 'next/font/google';
import Link from 'next/link';
const della = Della_Respira({ subsets: ['latin'], weight: '400' });

const HomeHeader = () => {

    return (
        <div className={`hh-bg flex flex-col justify-center items-center  ${della.className}`}>
            <Image
                src="/bmlogov2.png"
                alt="Blue Mystique Inn logo"
                width={400}
                height={400}
                className="text-timer"
            />
            <div className="flex flex-col justify-center items-center text-white text-timer">
                <h2 className="text-2xl my-2">Welcome to</h2>
                <h1 className="text-8xl my-2">The Blue Mystique Inn</h1>
                <h2 className="text-2xl my-2">Boutique Inn in Manistique, Michigan</h2>
                <Link href="/book"> <button className="text-4xl my-2 bg-white rounded-2xl px-12 py-2 text-neutral-800">
                    Book your Stay
                </button></Link>
               
            </div>
        </div>
    );
};

export default HomeHeader;