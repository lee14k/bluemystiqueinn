import RoomCard from "@/components/RoomCard"

const fetchRooms = async () => {
    try {
      const response = await fetch("/api/get-rooms");
      const roomsData = await response.json();
      if (response.ok) {
        setRooms(roomsData);
      } else {
        console.error("Error fetching rooms:", roomsData.error);
      }
    } catch (error) {
      console.error("Error fetching rooms:", error);
    }
  };
  useEffect(() => {
    fetchRooms();
  }, []);
export default function rooms () {
    return (
        <div>
            <h1>Our Rooms</h1>
            <p>All of our rooms are located on a second floor, please call or contact us if you have further questions.</p>
            <p>Click each card to learn more about our rooms.</p>
        </div>
    )
}