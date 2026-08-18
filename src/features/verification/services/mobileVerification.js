const MOCK_DELAY = 2000;

const MOCK_OTP = "123456";

export function sendOTP(mobile, countryCode) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!mobile || mobile.length !== 10) {
        reject({
          success: false,
          message: "Enter a valid mobile number.",
        });

        return;
      }

      resolve({
        success: true,
        message: "OTP sent successfully.",
        data: {
          mobile,
          countryCode,
          otp: MOCK_OTP, // Mock only (remove when using backend)
        },
      });
    }, MOCK_DELAY);
  });
}

export function verifyOTP(otp) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (otp !== MOCK_OTP) {
        reject({
          success: false,
          message: "Invalid OTP.",
        });

        return;
      }

      resolve({
        success: true,
        message: "Mobile verified successfully.",
      });
    }, 1200);
  });
}