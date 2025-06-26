import { useNavigate, Link } from "react-router-dom";
import useAuth from "../provider/auth/useAuth";
import React, { useState } from "react";
import FormLayout from "../components/form/layout";
import Form from "../components/form/form";
import { signup } from "../api/user/auth";
import toast from "react-hot-toast";

const Signup = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const { setToken, setUser } = useAuth();
    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            toast.error("كلمة المرور غير متطابقة!");
            return;
        }
        try {
            const response = await signup({
                name,
                email,
                password,
                role: "USER"
            });
            if (response.access_token) {
                setToken(response.access_token);
                // setUser(response.user);
                toast.success("تم إنشاء الحساب بنجاح!");
                setTimeout(() => {
                    navigate("/", { replace: true });
                }, 1500);
            }
        } catch (error) {
            toast.error("حدث خطأ أثناء إنشاء الحساب!");
        }
    };

    return (
        <FormLayout>
            <Form
                title="مرحباً بِك في مكتبتنا 👋"
                onSubmit={handleSignup}
                submitLabel="إنشاء حساب جديد"
                fields={[
                    {
                        name: "name",
                        type: "text",
                        placeholder: "ادخل الاسم",
                        value: name,
                        onChange: (e) => setName(e.target.value),
                        required: true,
                    },
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
                    {
                        name: "confirmPassword",
                        type: "password",
                        placeholder: "تأكيد كلمة المرور",
                        value: confirmPassword,
                        onChange: (e) => setConfirmPassword(e.target.value),
                        required: true,
                    },
                ]}
                footer={
                    <div className="text-sm text-center text-black">
                        لديك حساب بالفعل؟{" "}
                        <Link to="/login">
                            <span className="text-primary-400 hover:underline cursor-pointer">
                                تسجيل الدخول
                            </span>
                        </Link>
                    </div>
                }
            />
        </FormLayout>
    );
};

export default Signup;
