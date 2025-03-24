import React, { useState } from "react";
import axios from 'axios';
import { ReactComponent as Checked } from './assets/check-green-checkin.svg'



const ScheduleTabs = ({ schedule }) => {
  // State to track the selected tab
  const [selectedTab, setSelectedTab] = useState(0); // Default to first tab

  return (
    <div className="flex space-x-8">
      {/* Vertical Tabs */}
      <div className="flex flex-col w-1/4 bg-gray-100 p-4 rounded-lg shadow-md space-y-4">
        <div className="space-y-2">
          {schedule && schedule.length >0 && schedule.map((daySchedule, index) => (
            <button
              key={index}
              onClick={() => setSelectedTab(index)} // Change the selected tab
              className={`w-full text-left p-3 rounded-md hover:bg-[#e0000010] ${
                selectedTab === index
                  ? "bg-[#e00000] text-white"
                  : "text-gray-700"
              }`}
            >
             {daySchedule?.start_time}
            </button>
          ))}
        </div>
      </div>

      {/* Schedule Details */}
      <div className="w-3/4 bg-white p-6 rounded-lg shadow-md">
        {schedule[selectedTab] ? (
          <div>
            <ul className="space-y-4">
              {schedule[selectedTab].members &&
              schedule[selectedTab].members.length > 0 ? (
                schedule[selectedTab].members.map((member) => (
                  <li
                    key={member.id}
                    className="flex items-center space-x-4 p-3 border-b border-gray-200 rounded-md"
                  >
                    <MemberCard
                      key={member.id}
                      member={member}
                      facilityId={2}
                      calendarScheduleId={schedule[selectedTab].id}
                      disciplineId={schedule[selectedTab].discipline_id}
                    />
                    {/* Member details */}
                    {/* <div className="flex-shrink-0 w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-lg font-semibold">
                      {member.firstname.charAt(0)}
                      {member.lastname.charAt(0)}
                    </div>
                    <div className="flex flex-col">
                      <h5 className="font-medium">{`${member.firstname} ${member.lastname}`}</h5>
                      <p className="text-gray-500">Email: {member.email}</p>
                      <p className="text-gray-500">Checked In: {member.checkedin}</p>
                    </div>
                    <button
                      onClick={() => handleCheckIn(member)}
                      className="ml-auto bg-green-500 text-white py-1 px-4 rounded-md hover:bg-green-600"
                    >
                      Check-in
                    </button> */}
                  </li>
                ))
              ) : (
                <p>No members scheduled</p>
              )}
            </ul>
          </div>
        ) : (
          <p>Select a schedule to view the members</p>
        )}
      </div>
    </div>
  );
};


// MemberCard Component
const MemberCard = ({ member, facilityId, calendarScheduleId,disciplineId }) => {
    const { firstname, lastname, email, checkedin, id } = member;
  
    // Create initials for the avatar (first letter of first name and last name)
    const initials = `${firstname[0]}${lastname[0]}`;
  
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
  
    const handleCheckIn = async () => {
      setLoading(true);
      setError('');
      
      const payload = {
        facility_id: facilityId, // This should be passed as a prop
        calendar_schedule_id: calendarScheduleId, // This should be passed as a prop
        member_id: id, // This is the member ID
        discipline_id:disciplineId
      };
  
      try {
        // Make the API call to check-in the member
        const response = await axios.post('https://backend.profitconnect.co/crm/calendar/checkin/member', payload);
        
        // Check if the response indicates success
        if (response.data.return === true) {
          alert('Check-in successful!');
          // Optionally, update the member's check-in status locally
          member.checkedin = 'Yes'; // Update the member's check-in status locally
        } else {
          // Handle error response (e.g., Invalid facility_id)
          setError(response.data.message || 'Something went wrong');
        }
      } catch (error) {
        setError('Failed to check-in. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
  
    return (
      <div className="flex items-center p-4 gap-2">
        {/* Avatar */}
        <div className="w-16 h-16 flex items-center justify-center bg-[#e00000] text-white rounded-full text-xl font-semibold mr-4">
          {initials}
        </div>
  
        {/* Member Details */}
        <div >
          <h5 className="text-lg font-semibold">{firstname} {lastname}</h5>
        </div>
        <div>
          <p className="text-sm text-gray-600">{email}</p>
        </div>
        <div>
        {checkedin === 'Yes' ? (
            <p className="text-green-500 font-semibold"><Checked width="20" height="20"/></p>
          ) : (
            <div>
              <button
                onClick={handleCheckIn}
                className="bg-[#e00000] text-white py-1 px-4 rounded-md mt-2 hover:bg-[#e0000090]"
                disabled={loading}
              >
                {loading ? 'Checking in...' : 'Check-in'}
              </button>
              {error && <p className="text-red-500 mt-2">{error}</p>}
            </div>
          )}
        </div>
      </div>
    );
  };
  

export default ScheduleTabs;
