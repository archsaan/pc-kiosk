
import React, { useState, useEffect,useRef } from 'react';
import axios from 'axios';
import ScheduleTabs from './ScheduleTabs';
import { API } from './config/constants';
import { getFacilityId } from './utils/format';

const ScheduleFetcher = () => {
  const [rooms, setRooms] = useState([]);
  const [selectedRoomId, setSelectedRoomId] = useState('1');
  
  const [date, setDate] = useState("");
  const [schedule, setSchedule] = useState(null);
  const [error, setError] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [selectedClass, setSelectedClass] = useState('');
  const [loading, setLoading] = useState(false);
  const facilityId = getFacilityId()

 

  useEffect(() => {
    
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];
    setDate(formattedDate);
  }, []);

  // Fetch rooms when component mounts
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await axios.post(API.GET_CATEGORIES,{
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
        const response = await axios.post(API.GET_DAY_SCHEDULE, {
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
  }, [selectedRoomId, date]);

  const handleTabClick = (roomId) => {
    setSelectedRoomId(roomId); // Update selected room
    setSchedule(null); // Clear the previous schedule data
    setError(''); // Clear any previous error
  };

  const handleTimeTabChange = (selectedIndex,selectedClassName) => {
    setSelectedClass(selectedClassName)
    setSelectedIndex(selectedIndex)
  };

  const handleAddMember = () => {
    const fetchSchedule = async () => {
      setLoading(true);
      try {
        const response = await axios.post(API.GET_DAY_SCHEDULE, {
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
    fetchSchedule(); // Refresh the schedule data after adding a member
  };

  const customStyles = {
    container: {
      maxWidth: '1200px', // For example, max-width of 1200px
      margin: '0 auto',
      padding: '16px',
      position: 'relative',
      marginTop: '-56px',
    },
    button: {
      padding: '8px 30px',
      // backgroundColor: 'white',
      borderRadius: '25px 25px 0 0',
      fontWeight: '500',
      fontSize: '14px',
      color: 'black',
      boxShadow: '0 -4px 10px rgba(0, 0, 0, 0.1)',
      clipPath: 'polygon(0% 100%, 10% 0%, 0% 0%, 0% 0%, 90% 0%, 100% 100%)',
    }
  };

  return (
    <>
      
        <div className="w-full bg-[#e00000] text-white py-5 pt-5  relative">
          <div className="max-w-4xl mx-auto flex justify-between items-center relative mb-20 pl-4">
            {schedule && schedule.length > 0 && schedule[selectedIndex] != null && (
                 <div className="text-[36.56px] font-bold">{selectedClass} <span className="font-normal text-[22px]">({schedule[selectedIndex].start_time} - {schedule[selectedIndex].end_time})</span> </div>
            )}
             
          </div>
        </div>
        <div className="container max-w-4xl mx-auto p-4 relative mt-[-59px]">
          {/* Room Tabs */}
          <div className="flex  mb-6">
            {rooms.map((room) => (
              <button
                style={customStyles.button}
                key={room.id}
                onClick={() => handleTabClick(room.id)}
                className={`px-4 py-2 text-lg font-medium focus:outline-none 
                  ${selectedRoomId === room.id ? 'bg-white' : 'bg-[#e0e1e2] text-red '}`}
              >
                {room.name}
              </button>
            ))}
          </div>



          {/* Display the result */}
          {error && <div className="text-red-500 mt-4 text-center">{error}</div>}
          {schedule && schedule.length > 0 && (
            <ScheduleTabs schedule={schedule} onAddMember={handleAddMember} onTabChange={handleTimeTabChange}/>
          )}

          {selectedRoomId && !loading && !error && schedule && schedule.length === 0 && (
            <div className="text-center text-gray-500">No schedules available for this room.</div>
          )}
          </div>
    </>

  );
};

export default ScheduleFetcher;
