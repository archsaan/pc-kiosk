import React, { useState,useEffect } from "react";
import { formatEmail } from "../../utils/format";
import { FaSearch, FaTimes } from "react-icons/fa";
import useImageUrl from '../../hooks/useImageUrl';
import Avatar from '../common/Avatar';
import {API_BASE_URL} from '../../config/constants';
import Loader from '../common/Loader';

const Modal = ({ isOpen, members, onClose, onSelectMember, loading, loadMoreMembers,showMoreDisabled,searchLoading, bookingLoading,
  searchQuery, 
  setSearchQuery}) => {
  if (!isOpen) return null; 

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const clearSearch = () => {
    setSearchQuery(""); 
  };



  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-50"  onClick={onClose}>
      {bookingLoading && (
        <div onClick={(e) => e.stopPropagation()} className="absolute top-0 left-0 w-full h-full bg-white bg-opacity-60 z-50 flex items-center justify-center">
         <div className="loader border-4 border-gray-300 border-t-[#e00000] rounded-full w-10 h-10 animate-spin"></div>
        </div>
      )}
      
      <div className={`bg-white p-6 rounded-lg max-w-4xl max-h-[80vh] w-full overflow-auto relative ${bookingLoading ? 'pointer-events-none' : ''}`} onClick={(e) => e.stopPropagation()}>

        <div className="flex  w-full justify-end items-center">
          <button
            onClick={onClose}
            className="bg-none text-gray-700 text-2xl font-semibold cursor-pointer"
          >
            &times;
          </button>
        </div>
        <div className="mt-4">
        <div className="mt-4 mb-4 relative">
          {/* Search Icon */}
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
            <FaSearch className="text-gray-700 text-md" />
          </div>

          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search..."
            className="w-full px-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-transparent focus:border-[#e00000] "
            autoFocus
          />

          {/* Clear Button */}
          {searchQuery && (
            <button
              onClick={clearSearch}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-700"
            >
              <FaTimes className="text-gray-700 text-md" />
            </button>
          )}
        </div>
          <ul>
            {members.map((member, index) => (
              <AddMemberCard
                      key={member.id}
                      member={member}
                      onSelectMember={onSelectMember}
                    />
            ))}
          </ul>
        </div>
        {/* Show More Button */}
        {!showMoreDisabled && (
          <div className="mt-4 text-center">
            <button
              onClick={loadMoreMembers}
              className="border-solid border font-semibold border-[#e00000] py-1 px-4 rounded-md hover:bg-[#e00000] hover:text-white"
              disabled={loading}
            >
              {loading ? "Loading..." : "Show More"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const AddMemberCard = ({ member,onSelectMember}) => {
  const { firstname, lastname, email, status, id,img_src } = member;
  const [imageUrl, setImageUrl] = useState('');
  
  // Create initials for the avatar (first letter of first name and last name)
  const initials = `${firstname[0]}${lastname[0]}`;

  const [loading, setLoading] = useState(false);
  
  const [error, setError] = useState('');

  const { getUrl } = useImageUrl(imageUrl);
  useEffect(() => {
    
    const configImageUrl = API_BASE_URL; 
    setImageUrl(configImageUrl);
  }, []);


  return (
    <div className="flex items-center w-full justify-between p-4 gap-2">
      <div className="flex items-center "> 
          <Avatar img_src={getUrl(img_src)} initials={initials} />
  
        {/* Member Details */}
        <div >
          <h5 className="text-lg font-semibold w-[170px] text-left">{firstname} {lastname}</h5>
        </div>
       
        <div>
      </div>
      
      </div>
      <div>
          <p className="text-sm text-gray-600">{formatEmail(email)}</p>
      </div>
      {/* Avatar */}
      
      {status === 'Booked' ? (
          <p className="text-green-500 font-semibold">Booked</p>
        ) : (
          <div>
            <button
              onClick={() => onSelectMember(member)}
              className="border-solid border font-semibold border-[#e00000] hover:text-white py-1 px-4 rounded-md mt-2 hover:bg-[#e00000]"
              disabled={loading}
            >
              {loading ? 'Adding...' : 'Add'}
            </button>
            {error && <p className="text-red-500 mt-2">{error}</p>}
          </div>
        )}
    </div>
  );
};

export default Modal;
