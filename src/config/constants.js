
import { getFacilityId } from '../utils/format';
const API_BASE_URL = "https://backend.profitconnect.co/crm"; // Base URL for your API

// API Endpoints
const API = {
  GET_MEMBERS: `${API_BASE_URL}/members/get/members`,
  VALIDATE_MEMBER_BOOKING: `${API_BASE_URL}/calendar/validate/memberbooking`,
  BOOK_MEMBER: `${API_BASE_URL}/calendar/book/member`,
  GET_CATEGORIES:`${API_BASE_URL}/space/get/categories`,
  GET_DAY_SCHEDULE:`${API_BASE_URL}/calendar/get/dayschedule`,
  CHECKIN_MEMBER:`${API_BASE_URL}/calendar/checkin/member`
 
};

// Facility ID - Example
const FACILITY_ID = getFacilityId(); // Default Facility ID, change if needed
const BOOK_STATUS = {
    BOOKED: "Booked",
    WAITING: "Waiting",
  };

export { API_BASE_URL,API, FACILITY_ID,BOOK_STATUS };

