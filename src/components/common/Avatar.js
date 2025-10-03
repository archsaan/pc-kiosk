import React, { useState,useEffect } from 'react';
import {API_BASE_URL} from '../../config/constants';

const Avatar = ({ img_src, initials }) => {
  const [imageError, setImageError] = useState(false);
  const handleImageError = () => {
    setImageError(true); 
  };


  return (
    <div className="w-16 h-16 flex items-center justify-center bg-[#e0e1e2] text-white rounded-full text-xl font-semibold mr-4">
      
      {imageError || !img_src ? (
        <span>{initials}</span>
      ) : (
        <img
          src={img_src}
          alt="Avatar"
          className="w-full h-full object-cover rounded-full"
          onError={handleImageError} 
        />
      )}
    </div>
  );
};

export default Avatar;
