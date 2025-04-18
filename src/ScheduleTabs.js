import React, { useState, useEffect, useRef } from "react";
import axios from 'axios';
import { ReactComponent as Checked } from './assets/check-green-checkin.svg'
import AddMember from './components/AddMember';
import Avatar from './components/design/Avatar';
import { API_BASE_URL } from './config/constants';
import { toast } from 'react-toastify';
import { formatEmail } from "./utils/format";
import useImageUrl from './hooks/useImageUrl';
import { getFacilityId, convertTo24Hour } from './utils/format';


const ScheduleTabs = ({ schedule, onAddMember, onTabChange, onCheckinCountUpdated }) => {
  // State to track the selected tab
  const [selectedTab, setSelectedTab] = useState(0); // Default to first tab

  //===========Pull to refresh code======================
  const [startPoint, setStartPoint] = useState(0);
  const [pullChange, setPullChange] = useState();
  const refreshCont = useRef(0);

  const initLoading = () => {
    refreshCont.current.classList.add("loading");
    onCheckinCountUpdated()
  };

  const pullStart = (e) => {
    const { screenY } = e.targetTouches[0];
    setStartPoint(screenY);
  };

  useEffect(() => {

    window.addEventListener("touchstart", pullStart);
    window.addEventListener("touchmove", pull);
    window.addEventListener("touchend", endPull);
    return () => {
      window.removeEventListener("touchstart", pullStart);
      window.removeEventListener("touchmove", pull);
      window.removeEventListener("touchend", endPull);
    };
  });

  const pull = (e) => {
    /**
     * get the current user touch event data
     */
    const touch = e.targetTouches[0];
    /**
     * get the touch position on the screen's Y axis
     */
    const { screenY } = touch;
    /**
     * The length of the pull
     *
     * if the start touch position is lesser than the current touch position, calculate the difference, which gives the `pullLength`
     *
     * This tells us how much the user has pulled
     */
    let pullLength = startPoint < screenY ? Math.abs(screenY - startPoint) : 0;
    setPullChange(pullLength);
    console.log({ screenY, startPoint, pullLength, pullChange });
  };

  const endPull = (e) => {
    setStartPoint(0);
    setPullChange(0);
    if (pullChange > 220) initLoading();
  };

  //===========Pull to refresh code======================

  const checkedInMembersCount = schedule[selectedTab]?.members?.filter(member => member !== null && member.checkedin === 'Yes' && member.status === 'Booked').length || 0;
  const bookedCount = schedule[selectedTab]?.members?.filter(member => member !== null && member.status === 'Booked').length || 0;
  const waitingCount = schedule[selectedTab]?.members?.filter(member => member !== null && member.status === 'Waiting').length || 0;

  const handleTabChange = (index, className) => {
    setSelectedTab(index);
    if (onTabChange) {
      onTabChange(index, className);
    }
  };

  const sortedTimeSlots = schedule
    ? [...schedule]
      .filter((daySchedule) => daySchedule !== null)
      .sort((a, b) => convertTo24Hour(a.start_time) - convertTo24Hour(b.start_time))
    : [];

  useEffect(() => {
    if (schedule.length > 0) {
      handleTabChange(selectedTab, schedule[selectedTab]?.class_name || '');
    }
  }, [schedule, selectedTab]);

  

  return (
    <div className="">
      {/* Vertical Tabs */}
      <div className="mb-4 ">
        <div className=" flex flex-wrap pb-2 px-4 gap-4">
          {schedule && schedule.length > 0 && schedule.filter(daySchedule => daySchedule !== null).map((daySchedule, index) => (
            <button
              key={index}
              onClick={() => handleTabChange(index, daySchedule.class_name)} // Change the selected tab
              className={` text-left py-1 px-3 rounded-full hover:bg-[#e00000] hover:text-white ${selectedTab === index
                  ? "bg-[#e00000] text-white"
                  : "text-gray-700 bg-[#e0e1e2]"
                }`}
            >
              {daySchedule?.start_time}
            </button>
          ))}
        </div>
        {/* <div className="flex flex-wrap pb-2 px-4 gap-4">
          {sortedTimeSlots.length > 0 &&
            sortedTimeSlots.map((daySchedule, index) => (
              <button
                key={index}
                onClick={() => handleTabChange(index, daySchedule.class_name)} // Change the selected tab
                className={`text-left py-1 px-3 rounded-full hover:bg-[#e00000] hover:text-white ${
                  selectedTab === index
                    ? "bg-[#e00000] text-white"
                    : "text-gray-700 bg-[#e0e1e2]"
                }`}
              >
                {daySchedule?.start_time}
              </button>
            ))}
        </div> */}
      </div>

      {/* Schedule Details */}
      <div className="w-full bg-white p-6 rounded-lg shadow-md">
        <div
          ref={refreshCont}
          className="refresh-container w-fit -mt-10 hidden m-auto"
          style={{ marginTop: pullChange / 3.118 || "", display: pullChange > 0 ? "block" : "none" }}
        >
          <div className="refresh-icon p-2 rounded-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="#e00000"
              className="w-6 h-6"
              style={{ transform: `rotate(${pullChange}deg)` }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
              />
            </svg>
          </div>
        </div>
        {schedule[selectedTab] ? (

          <div className="px-4">
            <AddMember
              checkedInMembersCount={checkedInMembersCount}
              calendarScheduleTime ={schedule[selectedTab].start_time}
              calendarScheduleId={schedule[selectedTab].id}
              calendarDisciplineId={schedule[selectedTab].discipline_id}
              addMember={onAddMember}
              bookedCount={bookedCount}
              bookCapacity={schedule[selectedTab].capacity}
              waitingCount={schedule[selectedTab].waiting_list}
              waitingCapacity={schedule[selectedTab].waiting_capacity}
            />
            <ul className="space-y-4 pt-4">
              {schedule[selectedTab].members &&
                schedule[selectedTab].members.length > 0 ? (
                [...schedule[selectedTab].members] 
                  .filter((member) => member !== null && member.status === "Booked")
                  .sort((a, b) => a.firstname.localeCompare(b.firstname)) 
                  .map((member) => (
                    <li
                      key={member.id}
                      className="flex items-center space-x-4 rounded-md"
                    >
                      <MemberCard
                        key={member.id}
                        member={member}
                        facilityId={getFacilityId()}
                        calendarScheduleId={schedule[selectedTab].id}
                        disciplineId={schedule[selectedTab].discipline_id}
                        handleCheckInCount={onCheckinCountUpdated}
                      />
                    </li>
                  ))
              ) : (
                <p>No members scheduled</p>
              )}
            </ul>
          </div>
        ) : (
          <p></p>
        )}
      </div>
    </div>
  );
};


// MemberCard Component
const MemberCard = ({ member, facilityId, calendarScheduleId, disciplineId, handleCheckInCount }) => {
  const { firstname, lastname, email, checkedin, id, img_src, firsttimer } = member;
  const [imageUrl, setImageUrl] = useState('');
  const initials = `${firstname[0]}${lastname[0]}`;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { getUrl } = useImageUrl(imageUrl);
  useEffect(() => {

    const configImageUrl = API_BASE_URL;
    setImageUrl(configImageUrl);
  }, []);

  const handleCheckIn = async () => {
    setLoading(true);
    setError('');

    const payload = {
      facility_id: getFacilityId(), // This should be passed as a prop
      calendar_schedule_id: calendarScheduleId, // This should be passed as a prop
      member_id: id, // This is the member ID
      discipline_id: disciplineId
    };

    try {
      // Make the API call to check-in the member
      const response = await axios.post('https://backend.profitconnect.co/crm/calendar/checkin/member', payload);

      // Check if the response indicates success
      if (response.data.return === true) {
        toast.success(response.data.message);
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
      handleCheckInCount()
    }
  };

  return (
    <div className="flex items-center w-full justify-between py-1 gap-2">
      <div className="flex items-center ">
        <Avatar img_src={getUrl(img_src)} initials={initials} />
        {/* Member Details */}
        <div >
          <h5 className="text-lg font-semibold w-[170px] text-left">{firstname} {lastname}</h5>
          <div className="text-xs text-left">{firsttimer == "Yes" ? 'First Timer' : ""}</div>
        </div>

        <div>
        </div>

      </div>
      {/* Avatar */}
      <div>
        <p className="text-sm text-gray-600  no-underline">{formatEmail(email)}</p>
      </div>

      <div className="w-[170px] flex justify-center items-center">
        {checkedin === 'Yes' ? (
          <div className="text-green-500 font-semibold w-[96px] flex justify-center"><Checked width="40" height="40" /></div>
        ) : (
          <div>
            <button
              onClick={handleCheckIn}
              className="border-solid border font-semibold border-[#e00000] hover:text-white py-2 px-4 rounded-md mt-2 text-[20px] hover:bg-[#e00000]"
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
