// pages/import-ics.js
import { useState } from 'react';

const ImportICS = () => {
    const [calendarUrl, setCalendarUrl] = useState('');
    const [message, setMessage] = useState('');

    const handleImport = async (e) => {
        e.preventDefault();
        if (!calendarUrl) return;

        try {
            // Fetch the .ics data directly from the Airbnb calendar URL
            const response = await fetch(calendarUrl);
            if (!response.ok) throw new Error('Failed to fetch calendar data.');

            const icsData = await response.text();

            // Send the .ics data to the API
            const result = await fetch('/api/store-ics', {
                method: 'POST',
                headers: { 'Content-Type': 'text/plain' },
                body: icsData,
            });

            const json = await result.json();
            setMessage(json.message || 'Unknown response');
        } catch (error) {
            setMessage(`Error: ${error.message}`);
        }
    };

    return (
        <div>
            <h1>Import Airbnb Calendar</h1>
            <form onSubmit={handleImport}>
                <label>
                    Airbnb Calendar URL:
                    <input
                        type="url"
                        value={calendarUrl}
                        onChange={(e) => setCalendarUrl(e.target.value)}
                        required
                    />
                </label>
                <button type="submit">Import</button>
            </form>
            <p>{message}</p>
        </div>
    );
};

export default ImportICS;
