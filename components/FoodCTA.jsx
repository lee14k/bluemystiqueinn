import Image from "next/image";
import Link from "next/link";
import { Della_Respira } from "next/font/google";
const della = Della_Respira({ subsets: ["latin"], weight: "400" });

const FoodCTA = () => {
  return (
    <div>
    <div className="grid lg:grid-cols-2 bg-sky-200 py-24">
      <div className="flex items-center justify-center mx-12">
        <div >
          <h1 className={`text-6xl  text-center ${della.className}`}>
            Gourmet dining experiences in Manistique, Michigan
          </h1>
          <p className="my-8 text-2xl mx-12">
            Chefs Table is a dinner feature exclusive to our guests. “A culinary
            experience like no other! Featuring different worldly fusions in a
            tasting menu with an enhanced, modern twist. We are proud to
            showcase as many local ingredients to give you an organic U.P.
            dining experience that will make your stay at The Blue Mystique Inn
            a memorable one.” - Chef Joshua Questions? Feel free to call (906)
            221-5371
          </p>
          <div className={`${della.className}`}>
            <button className="bg-white rounded-2xl px-12 py-2 mx-16 my-10 text-4xl">
              <Link href="/book">Book your stay</Link>
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
      <div>
     

      </div>
    </div>
    <div className=" grid lg:grid-cols-2 bg-sky-200 py-24">
    <div className=" relative w-full h-full">
        <Image
          src="/char.jpg"
          alt="Crab Cakes"
          layout="fill"
          objectFit="cover"
          className="rounded-2xl"
        />
      </div>
      <div> <h1 className={`text-6xl  text-center ${della.className}`}>
            Arriving late and need a pick me up?
          </h1>
          <p className="my-8 text-2xl mx-12">
          Do your travels have you arriving a bit later? For the lighter fare we offer charcuterie boards $40  A variety of meats & cheeses. When available, locally smoked fish, and a selection of fruit. Please call ahead to request
          </p>
          <div className={`${della.className}`}>
            <button className="bg-white rounded-2xl px-12 py-2 mx-16 my-10 text-4xl">
              <Link href="/book">Book your stay</Link>
            </button>
          </div>
          </div>
         
     
        </div>
    </div>
 
  );
};

export default FoodCTA;


