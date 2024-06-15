import Image from "next/image";
import Link from "next/link";
import { Della_Respira } from "next/font/google";
const della = Della_Respira({ subsets: ["latin"], weight: "400" });

const FoodCTA = () => {
  return (
    <div className="grid lg:grid-cols-2 bg-sky-200 py-24">
      <div className="flex items-center justify-center mx-12">
        <div>
          <h1 className={`text-6xl  text-center ${della.className}`}>
            Gourmet dining experiences in Manistique, Michigan
          </h1>
          <p className="my-8 text-2xl mx-12">
            Discover the refined ambiance and exceptional dining at the Blue
            Mystique Inn in Manistique. This stunning venue offers the perfect
            setting for your next gathering, whether it's a special event or a
            business meeting. Chef Joshua will work closely with you to custom
            design a mouthwatering menu that caters to your tastes and
            preferences, ensuring an unforgettable culinary experience for you
            and your guests. When you host your event at the Blue Mystique Inn,
            you'll have exclusive access to the entire property, providing an
            unparalleled level of privacy and sophistication. The elegant
            surroundings, coupled with the exquisite cuisine, create an upscale
            catered dining experience that will leave a lasting impression on
            your guests. Don't miss the opportunity to elevate your next
            gathering to new heights. Book your event at the Blue Mystique Inn
            today and prepare to be enchanted by the sheer elegance and culinary
            excellence that await you.
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
          src="/ribgs.jpeg"
          alt="Blue Mystique Inn Room"
          layout="fill"
          objectFit="cover"
          className="rounded-2xl"
        />
      </div>
    </div>
  );
};

export default FoodCTA;
