import { useState, useRef, useContext } from "react";
import { AuthContext } from "../provider/auth/authProvider";
import { updateProfile } from "../api/user/auth";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function EditProfile() {
  const { user, token, setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [username, setUsername] = useState(user?.name || "");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [profileImage, setProfileImage] = useState("assets/images/profile.png");
  const fileInputRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(URL.createObjectURL(file));
    }
  };

  const handleDeleteImage = () => {
    setProfileImage("assets/images/profile.png");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword)
      return alert("كلمتا المرور غير متطابقتين");
    setIsLoading(true);
    try {
    const payload = {
      name: username,
      ...(password && { password })
    };

    const updatedUser = await updateProfile(payload, token);
    
    setUser(updatedUser);
    toast.success("تم تحديث الملف الشخصي بنجاح");
    navigate("/profile");
  } catch (error) {
    console.error("Update error details:", {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    toast.error("حدث خطأ أثناء تحديث الملف الشخصي");
  } finally {
    setIsLoading(false);
  }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-full mx-auto mt-10 p-6 bg-[#131627] text-white rounded-lg"
    >
      {/* Profile Image Section */}
      <div className="flex gap-4 items-center mb-8">
        <img
          src={profileImage}
          alt="profile"
          className="w-24 h-24 rounded-full object-cover mb-4"
        />
      </div>

      {/* Form Fields Section */}
      <div className="space-y-6 text-right">
        <div className="space-y-2">
          <label className="block">اسم المستخدم</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-50 p-2 rounded text-black bg-white border border-[#3A3F50]"
            required
          />
        </div>

        <div className="flex gap-2">
          <div className="space-y-2">
            <label className="block">كلمة المرور</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-50 p-2 rounded text-black bg-white border border-[#3A3F50]"
              placeholder="اتركه فارغاً إذا لم ترد التغيير"
            />
          </div>

          <div className="space-y-2">
            <label className="block">تأكيد كلمة المرور</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-50 p-2 rounded text-black bg-white border border-[#3A3F50]"
              placeholder="اتركه فارغاً إذا لم ترد التغيير"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="w-30 bg-[#765CDE] p-3 rounded-lg mt-6 font-medium"
            disabled={isLoading}
          >
            {isLoading ? "جاري الحفظ..." : "حفظ التغيرات"}
          </button>
        </div>
      </div>
    </form>
  );
}
