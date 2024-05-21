import Image from 'next/image';
import Link from 'next/link';
const HomeCTA =()=> {
    return(
    <div className="grid grid-cols-2 bg-sky-200">
       <div >
        <div>
            <h1>Lakeside Luxury with Cozy Comfort</h1>
            <p>The Blue Mystique Inn is a beautiful, 5-bedroom historic home in downtown Manistique - the heart of Manistique's Upper Peninsula. Built in the early 1900's, the recently renovated home is central to many of the UP's attractions - including Big Springs and Pictured Rocks - and just steps away from parks, trails, dining, shopping, and nightlife, After you're done hiking, biking, swimming, waterfall hunting, fall color touring, or enjoying snow sports, relax and make yourself at home.</p>
            <button>Learn More</button>
        </div>
       </div>
       <div>
        <Image
            src="/Blue-Mystique-8487.jpg"
            alt="Blue Mystique Inn Room"
            width={500}
            height={500}
            />
       </div>
    </div>
    )
}

export default HomeCTA;