import { useState } from "react";
import { useNavigate } from "react-router-dom";
import FormLayout from "../components/form/layout";
import Form from "../components/form/form";
import toast from "react-hot-toast";
import { forgetPassword } from "../api/user/auth"; 

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await forgetPassword( email );
      toast.success("تم إرسال رمز التحقق إلى بريدك الإلكتروني");
      navigate("/verify-otp", { state: { email } });
    } catch (error) {
      toast.error("حدث خطأ أثناء إرسال رمز التحقق");
    }
  };

  return (
    <FormLayout>
      <Form
        title="نسيت كلمة المرور"
        onSubmit={handleSubmit}
        submitLabel="إرسال رمز التحقق"
        fields={[
          {
            name: "email",
            type: "email",
            placeholder: "ادخل البريد الإلكتروني",
            value: email,
            onChange: (e) => setEmail(e.target.value),
            required: true,
          },
        ]}
        footer={
          <div className="text-sm text-center text-black">
            تذكرت كلمة المرور؟{" "}
            <span
              className="text-primary-400 hover:underline cursor-pointer"
              onClick={() => navigate("/login")}
            >
              تسجيل الدخول
            </span>
          </div>
        }
      />
    </FormLayout>
  );
};

export default ForgotPassword;