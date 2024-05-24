import Image from 'next/image';
import Link from 'next/link';
const HomeCTA =()=> {
    return(
    <div className="grid grid-cols-2 bg-sky-200 py-12">
       <div >
        <div className='mx-12'>
            <h1 className='text-6xl mx-24 text-center'>Lakeside Luxury with Cozy Comfort</h1>
            <p className='my-8'>The Blue Mystique Inn is a beautiful, 5-bedroom historic home in downtown Manistique - the heart of Manistique's Upper Peninsula. Built in the early 1900's, the recently renovated home is central to many of the UP's attractions - including Big Springs and Pictured Rocks - and just steps away from parks, trails, dining, shopping, and nightlife, After you're done hiking, biking, swimming, waterfall hunting, fall color touring, or enjoying snow sports, relax and make yourself at home.</p>
            <button className='bg-white rounded-2xl px-12 py-2'>Learn More</button>
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