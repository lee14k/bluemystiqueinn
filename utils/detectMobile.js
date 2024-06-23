// utils/detectMobile.js
export const isMobileUserAgent = (userAgent) => {
    return /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
  };
  