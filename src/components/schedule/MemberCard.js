import Avatar from '../common/Avatar';
import { API_BASE_URL } from '../../config/constants';
import { toast } from 'react-toastify';
import { formatEmail } from "../../utils/format";
import useImageUrl from '../../hooks/useImageUrl';
import React, { useState, useEffect, useRef } from "react";
import axios from 'axios';
import { ReactComponent as Checked } from '../../assets/check-green-checkin.svg'
import { getFacilityId } from '../../utils/format';
import ConfirmModal from '../common/ConfirmModal';


const MemberCard = ({ member, facilityId, calendarScheduleId, disciplineId, handleCheckInCount }) => {
  const { firstname, lastname, email, checkedin, id, img_src, firsttimer } = member;
  const [imageUrl, setImageUrl] = useState('');
  const initials = `${firstname[0]}${lastname[0]}`;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  
    const handleOpenModal = () => setIsConfirmModalOpen(true);
    const handleCloseModal = () => setIsConfirmModalOpen(false);
  
    const handleConfirm = () => {
      console.log('Confirmed!');
      setIsConfirmModalOpen(false);
    };
  


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
        console.log(response)
        toast.success(response.data.message);
        // Optionally, update the member's check-in status locally
        member.checkedin = 'Yes'; // Update the member's check-in status locally
        // Step 2: Pay for Orders API call
        const payPayload = {
            member_id: id,
            facility_id: getFacilityId(),
            calendar_schedule_id:calendarScheduleId
        };

        const payResponse = await axios.post(
            'https://backend.profitconnect.co/crm/PrePostOrders/payForOrders',
            payPayload
        );

        if (payResponse.data.return === true) {
            console.log('Payment processed successfully.');
           
        } else {
            console.log(payResponse.data.message || 'Payment could not be processed.');
        }
         setIsConfirmModalOpen(false)

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
    <>
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
          <div className='w-full'>
            <button
              onClick={handleOpenModal}
              className="border-solid w-full border font-semibold border-[#e00000] hover:text-white py-2 px-4 rounded-md mt-2 text-[20px] hover:bg-[#e00000]"
              disabled={loading}
            >
              {loading ? 'Checking in...' : 'Check-in'}
            </button>
            {error && <p className="text-red-500 mt-2">{error}</p>}
          </div>
        )}

      </div>
    </div>
    
      <ConfirmModal
        isOpen={isConfirmModalOpen}
        title="Are you sure?"
        message={firstname}
        subTitle={formatEmail(email)}
        confirmText="Check-in"
        cancelText="Cancel"
        loading={loading}
        onConfirm={handleCheckIn}
        onCancel={handleCloseModal}
      />
    </>
    
  );
};

export default MemberCard;