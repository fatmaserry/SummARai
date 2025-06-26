import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import FormLayout from "../components/form/layout";
import Form from "../components/form/form";
import toast from "react-hot-toast";
import { updatePassword } from "../api/user/auth";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { state } = useLocation();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("كلمة المرور غير متطابقة");
      return;
    }

    try {
      await updatePassword( state?.email, password );
      toast.success("تم تغيير كلمة المرور بنجاح");
      navigate("/login");
    } catch (error) {
      toast.error("حدث خطأ أثناء تغيير كلمة المرور");
    }
  };

  return (
    <FormLayout>
      <Form
        title="تجديد كلمة المرور"
        onSubmit={handleSubmit}
        submitLabel="تأكيد"
        fields={[
          {
            name: "password",
            type: "password",
            placeholder: "ادخل كلمة المرور الجديدة",
            value: password,
            onChange: (e) => setPassword(e.target.value),
            required: true,
          },
          {
            name: "confirmPassword",
            type: "password",
            placeholder: "اعد ادخال كلمة المرور الجديدة",
            value: confirmPassword,
            onChange: (e) => setConfirmPassword(e.target.value),
            required: true,
          },
        ]}
      />
    </FormLayout>
  );
};

export default ResetPassword;