import Image from "next/image";
import Link from "next/link";

const HomeCTA = () => {
  return (
    <div className="grid grid-cols-2 bg-sky-200 py-12">
      <div className="flex items-center justify-center mx-12">
        <div>
          <h1 className="text-6xl mx-24 text-center">
            Lakeside Luxury with Cozy Comfort
          </h1>
          <p className="my-8 text-xl mx-12">
            The Blue Mystique Inn is a beautiful, 5-bedroom historic home in
            downtown Manistique - the heart of the Upper Peninsula. Built in the
            early 1900's, the recently renovated home is central to many of the
            UP's attractions - including Big Springs and Pictured Rocks - and
            just steps away from parks, trails, dining, shopping, and nightlife,
            After you're done hiking, biking, swimming, waterfall hunting, fall
            color touring, or enjoying snow sports, relax and make yourself at
            home.
          </p>
          <Link href="/book">
            <button className="bg-white rounded-2xl px-12 py-2 mx-12">
              Book your stay
            </button>
          </Link>
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
