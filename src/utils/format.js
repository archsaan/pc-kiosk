export const formatEmail = (email) => {
    const [username, domain] = email.split('@');
    if (username && domain) {
      return `${username.charAt(0)}******@${domain}`;
    }
    return email;
  };


export const getFacilityId = () => {
  return localStorage.getItem('facility_id') || "2"; // Default to "2" if facility_id is not in localStorage
};

export const convertTo24Hour = (time) => {
  let [timePart, modifier] = time.split(" ");
  let [hours, minutes] = timePart.split(":").map((num) => parseInt(num, 10));
  if (hours === 12) {
    hours = 0; // Adjust 12 AM to 00 for sorting
  }
  if (modifier.toUpperCase() === "PM") {
    hours += 12; // Convert PM times to 24-hour format
  }
  return hours * 60 + minutes; // Convert to minutes for easier comparison
};
