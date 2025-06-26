import { useNavigate, Link } from "react-router-dom";
import useAuth from "../provider/auth/useAuth";
import React, { useState } from "react";
import FormLayout from "../components/form/layout";
import Form from "../components/form/form";
import { login } from "../api/user/auth";
import toast from "react-hot-toast";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setToken, setUser } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await login({
        email,
        password,
      });
      if (response.access_token) {
        setToken(response.access_token);
        setUser(response.user);
        toast.success("تم تسجيل الدخول بنجاح!");
        setTimeout(() => {
          navigate("/", { replace: true });
        }, 1500);
      }
    } catch (error) {
      toast.error("البريد الإلكتروني أو كلمة المرور غير صحيحة!");
    }
  };

  return (
    <FormLayout>
      <Form
        title="مرحباً بك مرة اخرى"
        onSubmit={handleLogin}
        submitLabel="تسجيل الدخول"
        fields={[
          {
            name: "email",
            type: "email",
            placeholder: "ادخل البريد الإلكتروني",
            value: email,
            onChange: (e) => setEmail(e.target.value),
            required: true,
          },
          {
            name: "password",
            type: "password",
            placeholder: "ادخل كلمة المرور",
            value: password,
            onChange: (e) => setPassword(e.target.value),
            required: true,
          },
        ]}
        footer={
          <>
            {/* {error && <p className="text-red-500 text-sm">
              {error}
            </p>} */}
            <div
              className="text-sm text-primary-400 text-left mb-2 cursor-pointer hover:underline"
              onClick={() => navigate("/forgot-password")}
            >
              نسيت كلمة المرور؟
            </div>
            <div className="text-sm text-center text-black">
              ليس لديك حساب؟{" "}
              <Link to="/register">
                <span className="text-primary-400 hover:underline cursor-pointer">
                  إنشاء حساب جديد
                </span>
              </Link>
            </div>
          </>
        }
      />
    </FormLayout>
  );
};

export default Login;
