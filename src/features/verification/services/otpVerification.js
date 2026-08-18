const MOCK_DELAY = 2000;
const MOCK_OTP = "123456";

export async function sendOTP() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        message: "OTP sent successfully.",
      });
    }, MOCK_DELAY);
  });
}

export async function verifyOTP(otp) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (otp === MOCK_OTP) {
        resolve({
          success: true,
          message: "OTP verified successfully.",
        });
      } else {
        reject({
          success: false,
          message: "Invalid OTP.",
        });
      }
    }, MOCK_DELAY);
  });
}

export async function resendOTP() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        message: "OTP resent successfully.",
      });
    }, 1000);
  });
}

