import Image from "next/image";
import Link from "next/link";
import { Della_Respira } from "next/font/google";
const della = Della_Respira({ subsets: ["latin"], weight: "400" });
const AboutFill = () => {
  return (
    <div className="grid lg:grid-cols-2 bg-orange-100 py-24">
      <div className="mx-24">
        <h1 className={`text-6xl ${della.className}`}>About the Innkeeper</h1>
        <p className="">
          Hello and welcome, I am Elizabeth, your host, and the owner of The
          Blue Mystique Inn. I love to travel and am excited to share with you
          my favorite spot on the map, Manistique, Michigan. I am dedicated to
          creating a memorable experience for every guest; ensuring your comfort
          is my top priority. As a former salon and day spa owner, I am well
          versed in bringing to you a warm and inviting atmosphere where you can
          relax and celebrate your time away from home. I enjoy meeting new
          people and look forward to introducing you to this wonderful community
          I have called home for many years. On the lighter side, I love top
          hats, music, art, and the movie Groundhog Day. I look forward to
          meeting you and having you experience that “on the water state of
          mind” feeling.
        </p>
        <Image src="/lizsig.png" alt="Elizabeth" width={200} height={200} />{" "}
        <Link href="/book">
          {" "}
          <button className="text-xl text-sky-900 my-2 bg-sky-300 rounded-2xl px-12 py-2 text-neutral-800">
            Book your Stay
          </button>
        </Link>{" "}
      </div>
      <div className="grid grid-cols-1">
        <div>
          <Image src="/bmliz.png" alt="Elizabeth" width={400} height={400} />
        </div>
      </div>
    </div>
  );
};
export default AboutFill;
