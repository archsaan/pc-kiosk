
import React, { useState,useEffect } from 'react';
import Modal from './Modal'; // Import the Modal component
import { ReactComponent as AddIcon } from '../assets/add-checkin.svg'
import { ReactComponent as CheckedCount } from '../assets/checked-total.svg'
import axios from 'axios';
import { toast } from 'react-toastify';
import { API, FACILITY_ID,BOOK_STATUS } from '../config/constants';
import { getFacilityId } from '../utils/format';

const AddMember = ({ checkedInMembersCount,calendarScheduleTime, calendarScheduleId,calendarDisciplineId, addMember,bookedCount,bookCapacity,waitingCount,waitingCapacity }) => {

  const [members, setMembers] = useState([]); // State to store the members list
  const [isModalOpen, setIsModalOpen] = useState(false); // State to toggle modal visibility
  const [loading, setLoading] = useState(false); // State to show loading indicator
  const [bookingLoading, setBookingLoading] = useState(false);
  const [error, setError] = useState(null); // State to handle errors
  const [selectedMember, setSelectedMember] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1); // Track the current page
  const [totalPages, setTotalPages] = useState(1); // Track the total pages


   // Debounce logic
   useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      // if (searchQuery.trim() !== "") {
      //   searchMembers(searchQuery);
      // }
      searchMembers(searchQuery);
    },5); // Delay for 500ms

    return () => clearTimeout(debounceTimeout); // Cleanup on change
  }, [searchQuery]);

  const searchMembers = async (query) => {
    setSearchLoading(true);
    try {
      const payload = {
        facility_id: getFacilityId(), 
        page: 1, 
        status: "", 
        search:query
      };
    
      const response = await axios.post(API.GET_MEMBERS,payload);
      setCurrentPage(response.data.pagination.current_page);
      setTotalPages(response.data.pagination.total_pages);
      setMembers(response.data.members);
    } catch (error) {
      setError("Failed to search members.");
    } finally {
      setSearchLoading(false);
    }
  };

  const loadMembers = async () => {
    setLoading(true); // Start loading
    try {
      const payload = {
        facility_id: getFacilityId(), 
        page: 1, // This should be passed as a prop
        status: "", 
        search:""
      };
    
      const response = await axios.post(API.GET_MEMBERS,payload);
      setMembers(response.data.members); // Set the members in state (assuming the API returns members as an array)
      setCurrentPage(response.data.pagination.current_page);
      setTotalPages(response.data.pagination.total_pages);
    } catch (err) {
      setError('Failed to load members'); // Set error if the API call fails
    } finally {
      setLoading(false); // Stop loading
    }
  };

  const loadMoreMembers = async () => {
    if (loading) return; // Prevent loading if a request is in progress
    setLoading(true);
    try {
      const nextPage = currentPage + 1;
      const payload = {
        facility_id: getFacilityId(), 
        page: nextPage, 
        status: "", 
        search:""
      };
      const response = await axios.post(API.GET_MEMBERS,payload); 
      setMembers((prevMembers) => [...prevMembers, ...response.data.members]);
      setCurrentPage(response.data.pagination.current_page);
      setTotalPages(response.data.pagination.total_pages);
    } catch (err) {
      setError("Failed to load more members.");
    } finally {
      setLoading(false);
    }
  };

  const openModal = () => {
    setIsModalOpen(true); // Open the modal when "Add Yourself" is clicked
    loadMembers();
  };

  const closeModal = () => {
    setIsModalOpen(false); // Close the modal
  };

  
    const addMemberandAutoCheckin = async(member) => {
      if (hasClassStarted(calendarScheduleTime)) {
        const payload = {
          facility_id: getFacilityId(), 
          calendar_schedule_id: calendarScheduleId,
          member_id: member.id, 
          discipline_id: calendarDisciplineId
        };

        try {
         
          const response = await axios.post(API.CHECKIN_MEMBER, payload);
          if (response.data.return === true) {
            // toast.success(response.data.message);
          } else {
            
          }
        } catch (error) {
          toast.error("Something went wrong!");
          
        } finally {
          addMember(member)
        }
      }
      else{
        addMember(member)
      }
    }

    const hasClassStarted = (startTimeStr) => {
      const now = new Date();
      const classTime = parseTimeToDate(startTimeStr);
      return now >= classTime;
    };

    const parseTimeToDate = (timeStr) => {
      const now = new Date();
    
      // Updated regex to allow optional space between time and AM/PM
      const match = timeStr.match(/(\d{1,2}:\d{2})\s*(AM|PM)/i);
    
      if (!match) {
        throw new Error(`Invalid time format: "${timeStr}"`);
      }
    
      const [_, time, modifier] = match;
    
      let [hours, minutes] = time.split(':').map(Number);
    
      if (modifier.toUpperCase() === 'PM' && hours !== 12) hours += 12;
      if (modifier.toUpperCase() === 'AM' && hours === 12) hours = 0;
    
      return new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        hours,
        minutes
      );
    };
    
    

  const handleAddMember = async (member) => {
    setBookingLoading(true);
    setSelectedMember(member); // Store the selected member
    console.log(calendarScheduleTime)

  
    // Step 1: Call first API to validate the booking
    try {
      const validationResponse = await axios.post(
        API.VALIDATE_MEMBER_BOOKING,
        {
          facility_id: getFacilityId(), // Pass the facility_id
          member_id: member.id, // Pass the selected member's ID
          calendar_schedule_id: calendarScheduleId, // Pass the calendar_schedule_id
        }
      );

      // Step 2: Check if the validation response is successful
      if (validationResponse.data.return === true) {
        // Validation passed, call the second API to book the member

        const bookingStatus = bookedCount < Number(bookCapacity)? BOOK_STATUS.BOOKED : BOOK_STATUS.WAITING;
        if(bookedCount < Number(bookCapacity)){
          const bookingResponse = await axios.post(
            API.BOOK_MEMBER,
            {
              facility_id: getFacilityId(), // Pass the facility_id
              member_id: [member.id], // Member ID array
              calendar_schedule_id: calendarScheduleId, // Pass the calendar_schedule_id
              status: bookingStatus, // Booking status
              validateBy: validationResponse.data.validateBy, // ValidateBy from the validation response
              planStatus: validationResponse.data.planStatus, // Plan status from the validation response
            }
          );
  
        
          if (bookingResponse.data.return === true ) {
            toast.success(bookingResponse.data.message)
            addMemberandAutoCheckin(member); 
            setIsModalOpen(false)
          }
          else{
            toast.error(bookingResponse.data.message||'Something went wrong!');
          }

        }
        else{
          if(waitingCount == waitingCapacity){
            toast("This class/event is fully booked (including waitlist).")

          }
          else if(waitingCount < waitingCapacity){
            const bookingResponse = await axios.post(
              API.BOOK_MEMBER,
              {
                facility_id: getFacilityId(), // Pass the facility_id
                member_id: [member.id], // Member ID array
                calendar_schedule_id: calendarScheduleId, // Pass the calendar_schedule_id
                status: bookingStatus, // Booking status
                validateBy: validationResponse.data.validateBy, // ValidateBy from the validation response
                planStatus: validationResponse.data.planStatus, // Plan status from the validation response
              }
            );
    
            // Handle booking response here
            if (bookingResponse.data.return === true ) {
              // Booking was successful, you can update your state or perform other actions
              console.log('Member booked successfully:', bookingResponse.data);
              toast.success(bookingResponse.data.message)
              addMember(member); // Call your addMember function (or whatever logic you want)
            }
            else{
              toast.error(bookingResponse.data.message||'Something went wrong!');
            }
  

          }
          else{
            toast("Something went wrong!")
          }
        }
        
      } else {
        toast.error(validationResponse.data.message||'Something went wrong!');
        setError('Invalid Booking'); // Handle validation failure
      }
    } catch (err) {
      console.error('Error during API calls:', err);
      setError('An error occurred while booking the member');
    }finally {
      setBookingLoading(false); // Stop loader
    }
  };

  return (
    <div className="flex justify-between">
      {/* Add New Member Section */}
      <div className=" cursor-pointer w-16 h-16 flex items-center justify-center " onClick={openModal}>
        <AddIcon width="50" height="50"/>
      </div>

      {/* Image and Total Section */}
      <div className="w-[170px] flex justify-center items-center">
        <div>
         <CheckedCount width="34" height="30" />
        </div>
        <div className="pl-4">
          <span className="small-title-bold span-total text-[36.56px] font-bold">
            {checkedInMembersCount}/
          </span>
          <span className="text-[22px]">{bookedCount}</span>
        </div>
      </div>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        members={members} // Pass the loaded members to the modal
        onClose={closeModal} // Function to close the modal
        onSelectMember={handleAddMember} // Handle selecting a member
        loading={loading} // Pass loading state to show loading indicator
        error={error} // Pass error state to show error message
        loadMoreMembers={loadMoreMembers}
        showMoreDisabled={currentPage >= totalPages}
        searchLoading={searchLoading}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        bookingLoading={bookingLoading}
      />
    </div>
  );
};

export default AddMember;
