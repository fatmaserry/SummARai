import { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import FormLayout from "../components/form/layout";
import Form from "../components/form/form";
import toast from "react-hot-toast";

const VerifyOtp = () => {
  const [otp, setOtp] = useState(Array(6).fill(""));
  const otpInputs = useRef([]);
  const { state } = useLocation();
  const navigate = useNavigate();


  useEffect(() => {
    if (otpInputs.current[0]) {
      otpInputs.current[0].focus();
    }
  }, []);

  const handleChange = (e, index) => {
    const value = e.target.value;

    // Only allow numbers
    if (/^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Auto-focus next input if a digit was entered
      if (value && index < 4 && otpInputs.current[index + 1]) {
        otpInputs.current[index + 1].focus();
      }
    }

    // Auto-submit if all digits are filled
    if (newOtp.every(digit => digit !== "")) {
      handleSubmit(newOtp.join(""));
    }
  };

  const handleKeyDown = (e, index) => {
    // Move focus to previous input on backspace if current is empty
    if (e.key === "Backspace" && !otp[index] && index > 0 && otpInputs.current[index - 1]) {
      otpInputs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text/plain").slice(0, 5);
    if (/^\d+$/.test(pasteData)) {
      const newOtp = [...otp];
      for (let i = 0; i < pasteData.length; i++) {
        if (i < 5) {
          newOtp[i] = pasteData[i];
        }
      }
      setOtp(newOtp);

      // Focus last input if OTP is complete
      if (pasteData.length === 5 && otpInputs.current[4]) {
        otpInputs.current[4].focus();
      }
    }
  };

  const handleSubmit = async (otpValue = otp.join("")) => {
    try {
      // await verifyOtp({ email: state?.email, otp: otpValue });
      toast.success("تم التحقق بنجاح");
      navigate("/reset-password", { state: { email: state?.email } });
    } catch (error) {
      toast.error("رمز التحقق غير صحيح");
    }
  };

  return (
    <FormLayout>
      <div className="w-full max-w-md mx-auto">
        <h1 className="text-3xl font-bold text-center mb-6">ادخل رمز ال OTP</h1>

        {/* OTP Input Boxes */}
        <div className="flex justify-center gap-3 mb-6" dir="ltr">
          {otp.map((digit, index) => (
            <input
              key={index}
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              onPaste={handlePaste}
              ref={(el) => (otpInputs.current[index] = el)}
              className="w-12 h-12 text-3xl text-center border border-gray-300 rounded-lg focus:border-primary-400 focus:outline-none"
              inputMode="numeric"
              pattern="[0-9]*"
            />
          ))}
        </div>

        {/* Submit Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
          className="w-full bg-[#765CDE] text-white py-3 rounded-lg hover:bg-primary-600 transition-colors mb-4"
        >
          تحقق
        </button>

        {/* Resend OTP Link */}
        <div className="text-center">
          <button
            onClick={() => toast.success("تم إعادة إرسال الرمز")}
            className="text-primary-400 hover:underline cursor-pointer"
          >
            اعادة ارسال الرمز
          </button>
        </div>
      </div>
    </FormLayout>
  );
};

export default VerifyOtp;