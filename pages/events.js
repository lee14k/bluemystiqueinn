import Image from 'next/image';
import { Della_Respira } from 'next/font/google';
import Link from 'next/link';
const della = Della_Respira({ subsets: ['latin'], weight: '400' });

const FoodHeader = () => {

    return (
        <div>
        <div className={`fh-bg flex flex-col justify-center items-center pt-24 ${della.className}`}>
       
            <div className="flex flex-col justify-center items-center text-white text-timer pb-24">
                <h2 className="lg:text-4xl my-4">Celebrate your</h2>
                <h1 className="lg:text-8xl my-4">Events and Special Occasions</h1>
                <h2 className="lg:text-4xl my-4">At the Blue Mystique Inn in Manistique, Michigan</h2>
                <Link href="/book"> <button className="text-6xl my-2 bg-white rounded-2xl px-12 py-4 text-neutral-800">
                    Book your Stay
                </button></Link>
               
            </div>
            
        </div>
        <div className="grid lg:grid-cols-2 bg-sky-200 py-24">
      <div className="flex items-center justify-center mx-12">
        <div>
          <h1 className={`text-6xl  text-center ${della.className}`}>
        Boutique event space located in Manistique, Michigan
          </h1>
          <p className="my-8 text-2xl mx-12">
           We offer a variety of event spaces, including a large dining room, a cozy lounge, and a spacious outdoor patio. Our space is perfect for weddings, corporate events, birthday parties, and more. We also offer catering services, so you can enjoy delicious food and drinks at your event. Contact us today to book your event at The Blue Mystique Inn.
          </p>
          <div className={`${della.className}`}>
            <button className="bg-white rounded-2xl px-12 py-2 mx-16 my-10 text-4xl">
              <Link href="/contact">Contact Us</Link>
            </button>
          </div>
        </div>
      </div>
      <div className=" relative w-full h-full">
        <Image
          src="/keks.jpeg"
          alt="Crab Cakes"
          layout="fill"
          objectFit="cover"
          className="rounded-2xl"
        />
      </div>
    </div>
        </div>
    );
};

export default FoodHeader;