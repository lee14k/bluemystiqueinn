const RoomCard =({availability, roomName, occupancy, rate})=> {
    return (
        <div>
            <span>{availability}</span>
            <h1>{roomName}</h1>
            <p>{occupancy}</p>
            <p>{rate}</p>

        </div>
    )
}