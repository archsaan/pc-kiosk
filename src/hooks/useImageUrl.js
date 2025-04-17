
const useImageUrl = (imageUrl) => {
  const getUrl = (url) => {
    const timestamp = new Date().getTime();
    return `${imageUrl}/${url}?timestamp=${timestamp}`;
  };

  return { getUrl };
};

export default useImageUrl;
