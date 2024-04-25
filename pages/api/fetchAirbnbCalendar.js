// pages/api/syncAirbnbCalendars.js
import axios from 'axios';
import { fromURL } from 'node-ical';

const airbnbIcalUrls = [
    'https://www.airbnb.com/calendar/ical/1101512343384815926.ics?s=bb32f23311402755c2e0f6fcca34d32d',
    'https://www.airbnb.com/calendar/ical/1101626413125793653.ics?s=638266da6c5d6a5b2ca1580e687905a9',
    'https://www.airbnb.com/calendar/ical/1101602891589896306.ics?s=a5427b26514f7ffb487e24658c2e5a0b',
    'https://www.airbnb.com/calendar/ical/1101569789363825898.ics?s=289fdd4756bb016c43fbe120eb3890ae',
    'https://www.airbnb.com/calendar/ical/1101570113624777524.ics?s=6b903e0cdc730694e245fee886dc8204'
];

export default async function handler(req, res) {
    if (req.method === 'GET') {
        try {
            const eventsArray = await Promise.all(airbnbIcalUrls.map(async url => {
                const response = await axios.get(url);
                const events = await fromURL(response.data);
                return events;
            }));

            // Here, you would process these events to update your database
            // For now, we just return them as a JSON response
            res.status(200).json(eventsArray);
        } catch (error) {
            console.error('Failed to fetch or parse the Airbnb calendars:', error);
            res.status(500).json({ error: 'Failed to sync calendars' });
        }
    } else {
        res.setHeader('Allow', ['GET'])
        res.status(405).end(`Method ${req.method} Not Allowed`)
    }
}
