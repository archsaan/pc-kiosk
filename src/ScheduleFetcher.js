
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ScheduleTabs from './ScheduleTabs';

const ScheduleFetcher = () => {
  const [facilityId, setFacilityId] = useState('2'); // You can dynamically set this
  const [rooms, setRooms] = useState([]);
  const [selectedRoomId, setSelectedRoomId] = useState('1');
  const [date, setDate] = useState('2025-03-21');
  const [schedule, setSchedule] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch rooms when component mounts
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await axios.post('https://backend.profitconnect.co/crm/space/get/categories',{
          facility_id: facilityId,
        });
        if (response.data && response.data.categories) {
          console.log(response.data.categories[0].room)
          setRooms(response.data.categories[0].room); // Set rooms to state
        }
      } catch (err) {
        setError('Failed to load rooms');
      }
    };
    fetchRooms();
  }, []);

  // Fetch schedule data when room is selected
  useEffect(() => {
    if (!selectedRoomId) return;

    const fetchSchedule = async () => {
      setLoading(true);
      try {
        const response = await axios.post('https://backend.profitconnect.co/crm/calendar/get/dayschedule', {
          facility_id: facilityId,
          room_id: selectedRoomId,
          date: date,
        });
        setSchedule(response.data.schedule || []);
      } catch (err) {
        setError('Error fetching schedule');
      } finally {
        setLoading(false);
      }
    };
    fetchSchedule();
  }, [selectedRoomId, date, facilityId]);

  const handleTabClick = (roomId) => {
    setSelectedRoomId(roomId); // Update selected room
    setSchedule(null); // Clear the previous schedule data
    setError(''); // Clear any previous error
  };

  return (
    <div className="container max-w-4xl mx-auto p-4">

      {/* Room Tabs */}
      <div className="flex space-x-4 mb-6">
        {rooms.map((room) => (
          <button
            key={room.id}
            onClick={() => handleTabClick(room.id)}
            className={`px-4 py-2 text-lg font-medium rounded-md focus:outline-none 
              ${selectedRoomId === room.id ? 'bg-[#e00000] text-white' : 'bg-gray-200 text-gray-700 hover:bg-[#e0000010]'}`}
          >
            {room.name}
          </button>
        ))}
      </div>

      {/* Input fields for dynamic data */}
      {/* <div className="space-y-4 mb-6">
        <div>
          <label htmlFor="facilityId" className="block text-lg font-medium text-gray-700">Facility ID:</label>
          <input
            type="text"
            id="facilityId"
            value={facilityId}
            onChange={(e) => setFacilityId(e.target.value)}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="date" className="block text-lg font-medium text-gray-700">Date:</label>
          <input
            type="date"
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <button
        onClick={() => handleTabClick(selectedRoomId)} // Trigger schedule fetch on button click
        disabled={loading}
        className="w-full bg-blue-500 text-white py-2 rounded-md mt-4 hover:bg-blue-600 disabled:bg-blue-300"
      >
        {loading ? 'Fetching...' : 'Fetch Schedule'}
      </button> */}

      {/* Display the result */}
      {error && <div className="text-red-500 mt-4 text-center">{error}</div>}
      {schedule && schedule.length > 0 && (
        <ScheduleTabs schedule={schedule} />
      )}

      {selectedRoomId && !loading && !error && schedule && schedule.length === 0 && (
        <div className="text-center text-gray-500">No schedules available for this room.</div>
      )}
    </div>
  );
};

export default ScheduleFetcher;
