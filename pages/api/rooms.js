// pages/api/rooms.js

export default async function handler(req, res) {
    if (req.method === 'GET') {
      try {
        const rooms = await fetchRoomsFromDatabase(); // Implement this function to fetch room data
        res.status(200).json(rooms);
      } catch (error) {
        console.error('Fetch rooms error:', error);
        res.status(500).json({ message: 'Failed to fetch rooms' });
      }
    } else {
      // Handle any unsupported methods
      res.setHeader('Allow', ['GET']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  }
  