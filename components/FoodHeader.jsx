import Image from 'next/image';
import { Della_Respira } from 'next/font/google';
import Link from 'next/link';
const della = Della_Respira({ subsets: ['latin'], weight: '400' });

const FoodHeader = () => {

    return (
        <div className={`fh-bg flex flex-col justify-center items-center pt-24 ${della.className}`}>
       
            <div className="flex flex-col justify-center items-center text-white text-timer pb-24">
                <h2 className="lg:text-4xl my-4">Experience</h2>
                <h1 className="lg:text-8xl my-4">The Chef's Table</h1>
                <h2 className="lg:text-4xl my-4">Only at the Blue Mystique Inn in Manistique, Michigan</h2>
                <Link href="/book"> <button className="text-6xl my-2 bg-white rounded-2xl px-12 py-4 text-neutral-800">
                    Book your Stay
                </button></Link>
               
            </div>
        </div>
    );
};

export default FoodHeader;