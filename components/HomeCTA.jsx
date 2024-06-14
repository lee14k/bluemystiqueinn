import Image from "next/image";
import Link from "next/link";
import { Della_Respira } from "next/font/google";
const della = Della_Respira({ subsets: ["latin"], weight: "400" });

const HomeCTA = () => {
  return (
    <div className="grid lg:grid-cols-2 bg-sky-200 py-24">
      <div className="flex items-center justify-center mx-12">
        <div>
          <h1 className={`text-6xl  text-center ${della.className}`}>
            Lakeside Luxury with Cozy Comfort
          </h1>
          <p className="my-8 text-2xl mx-12">
            The Blue Mystique Inn is a beautiful, 5-bedroom historic home in
            downtown Manistique - the heart of the Upper Peninsula. Built in the
            early 1900's, the recently renovated home is central to many of the
            UP's attractions - including Big Springs and Pictured Rocks - and
            just steps away from parks, trails, dining, shopping, and nightlife,
            After you're done hiking, biking, swimming, waterfall hunting, fall
            color touring, or enjoying snow sports, relax and make yourself at
            home.
          </p>
          <div className={`${della.className}`}>
            <button className="bg-white rounded-2xl px-12 py-2 mx-16 my-10 text-4xl">
              <Link href="/book">Book your stay</Link>
            </button>
          </div>
        </div>
      </div>
      <div className="relative w-full h-full">
        <Image
          src="/Blue-Mystique-8487.jpg"
          alt="Blue Mystique Inn Room"
          layout="fill"
          objectFit="cover"
          className="rounded-2xl"
        />
      </div>
    </div>
  );
};

export default HomeCTA;
