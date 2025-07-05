import { useNavigate, Link } from "react-router-dom";
import useAuth from "../provider/auth/useAuth";
import React, { useState } from "react";
import FormLayout from "../components/form/layout";
import Form from "../components/form/form";
import { signup } from "../api/user/auth";
import toast from "react-hot-toast";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";


const Signup = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const { setToken, setUser } = useAuth();
    const navigate = useNavigate();

    const passwordRequirements = [
        { label: "8 أحرف على الأقل", test: (pw) => pw.length >= 8 },
        { label: "حرف كبير واحد على الأقل", test: (pw) => /[A-Z]/.test(pw) },
        { label: "حرف صغير واحد على الأقل", test: (pw) => /[a-z]/.test(pw) },
        { label: "رقم واحد على الأقل", test: (pw) => /[0-9]/.test(pw) },
        { label: "رمز خاص واحد على الأقل", test: (pw) => /[!@#$%^&*(),.?\":{}|<>]/.test(pw) },
    ];

    const PasswordChecklist = ({ password }) => (
        <ul className="text-xs space-y-1 grid grid-cols-2 m-2 mb-4 items-baseline">
            {passwordRequirements.map((req, idx) => {
                const passed = req.test(password);
                return (
                    <li key={idx} className={passed ? "text-green-600" : "text-gray-500"}>
                        <div className="flex items-center gap-2">
                            {passed ? (
                                <FaCheckCircle className="text-green-600" />
                            ) : (
                                <FaTimesCircle className="text-gray-400" />
                            )}
                            <span>
                                {req.label}
                            </span>
                        </div>

                    </li>
                );
            })}
        </ul>
    );

    const isStrongPassword = (pw) => passwordRequirements.every((req) => req.test(pw));

    const handleSignup = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            toast.error("كلمة المرور غير متطابقة!");
            return;
        }
        if (!isStrongPassword(password)) {
            toast.error("كلمة المرور يجب أن تحتوي على 8 أحرف على الأقل، وحرف كبير وصغير، ورقم، ورمز خاص.");
            return;
        }

        try {
            const userData = {
                name,
                email,
                password,
                role: "USER"
            };
            const response = await signup(userData);
            if (response.status === 200) {
                toast.success("تم إنشاء الحساب بنجاح! يرجى التحقق من بريدك الإلكتروني للتأكيد.");
                setTimeout(() => { navigate("/login", { replace: true }) }, 2000)
            } else if (response.status == 409) {
                toast.error("الايميل موجود بالفعل!");
            }
        } catch (error) {
            toast.error("حدث خطأ أثناء إنشاء الحساب!");
            console.log(error)
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
                    <div className="flex flex-col">
                        <PasswordChecklist password={password} />
                        <div className="text-sm text-center text-black">
                            لديك حساب بالفعل؟{" "}
                            <Link to="/login">
                                <span className="text-primary-400 hover:underline cursor-pointer">
                                    تسجيل الدخول
                                </span>
                            </Link>
                        </div>
                    </div>
                }
            />
        </FormLayout>
    );
};

export default Signup;
