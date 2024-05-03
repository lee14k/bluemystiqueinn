// pages/rooms/[slug].js
import { useRouter } from 'next/router';

const RoomPage = ({ room }) => {
    const router = useRouter();
    const { slug } = router.query;

    if (router.isFallback) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>{room.name}</h1>
            <p>{room.description}</p>
            {/* Add more room details here */}
        </div>
    );
};

export async function getServerSideProps(context) {
    const { slug } = context.params;
    const res = await fetch(`https://your-api/rooms/${slug}`);
    const room = await res.json();

    return { props: { room } };
};

export default RoomPage;
