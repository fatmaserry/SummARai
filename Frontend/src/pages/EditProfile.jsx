import { useState, useRef, useContext } from "react";
import { AuthContext } from "../provider/auth/authProvider";

export default function EditProfile() {
  const { user } = useContext(AuthContext); 
  const [username, setUsername] = useState(user?.name || "");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [profileImage, setProfileImage] = useState("assets/images/profile.png");
  const fileInputRef = useRef(null);

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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) return alert("كلمتا المرور غير متطابقتين");
    console.log("Saved:", { username, password, profileImage });
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
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => document.getElementById('profileImageInput').click()}
            className="bg-[#765CDE] px-3 py-1.5 rounded"
          >
            تغير الصورة
          </button>
          <button
            type="button"
            onClick={handleDeleteImage}
            className="bg-[#6E7493] px-3 py-1.5 rounded"
          >
            حذف الصورة
          </button>
        </div>
        <input 
          type="file" 
          accept="image/*" 
          onChange={handleImageChange}
          ref={fileInputRef}
          className="hidden" 
          id="profileImageInput"
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
            />
          </div>

          <div className="space-y-2">
            <label className="block">تأكيد كلمة المرور</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-50 p-2 rounded text-black bg-white border border-[#3A3F50]"
            />
          </div>
        </div>

        <div className="flex justify-end"> {/* Added this container */}
          <button 
            type="submit" 
            className="w-30 bg-[#765CDE] p-3 rounded-lg mt-6 font-medium"
          >
            حفظ التغيرات
          </button>
        </div>
      </div>
    </form>
  );
}