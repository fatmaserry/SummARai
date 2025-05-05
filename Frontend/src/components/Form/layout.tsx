import React from "react";

const FormLayout = ({ children }) => {
  return (
    <div
      dir="rtl"
      className="min-h-screen flex flex-col items-center justify-center bg-auth-radial"
    >
      <img src="/assets/images/logo.png" alt="logo" className="h-24 w-40" />
      <div className="bg-white rounded-2xl shadow-lg px-10 py-8 w-full max-w-md">
        {children}
      </div>
    </div>
  );
};

export default FormLayout;
