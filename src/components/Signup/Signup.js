import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, storage, db } from "../../firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { setDoc, doc } from "firebase/firestore";

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);
  const [imageURL, setImageURL] = useState(null);
  const navigate = useNavigate();

  const handleSetFile = (e) => {
    setFile(e.target.files[0]);
    setImageURL(URL.createObjectURL(e.target.files[0]));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newUser = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const date = new Date().getTime();
      const storageRef = ref(storage, `${companyName + date}`);
      await uploadBytesResumable(storageRef, file);
      const url = await getDownloadURL(storageRef);

      await updateProfile(newUser.user, {
        displayName: companyName,
        photoURL: url,
      });

      await setDoc(doc(db, "users", newUser.user.uid), {
        uid: newUser.user.uid,
        displayName: companyName,
        email: email,
        photoURL: url,
      });

      localStorage.setItem("user", companyName);
      localStorage.setItem("logo", url);
      localStorage.setItem("email", email);
      navigate("/dashboard");
    } catch (err) {
      console.error("Error during sign up:", err);
      setError("Failed to create an account. Please try again.");
    }
  };

  return (
    <div className="bg-gray-100 flex justify-center items-center h-screen">
      {/* Left: Image */}
      <div className="w-1/2 h-screen hidden lg:block">
        <img
          src="https://imgs.search.brave.com/a_aQJaRJN7zEwdK2BhhFobzn1ML4IJf6ZySgbcQukwg/rs:fit:860:0:0/g:ce/aHR0cHM6Ly9jcmVh/dGUubWljcm9zb2Z0/LmNvbS9fbmV4dC9p/bWFnZT91cmw9aHR0/cHM6Ly9kc2dyY2Ru/YmxvYnByb2Q1dTMu/YXp1cmVlZGdlLm5l/dC9pbWFnZXMvY29s/bGVjdGlvbnMvaW52/b2ljZS53ZWJwJnc9/MTkyMCZxPTc1"
          alt="Placeholder"
          className="object-cover w-full h-full"
        />
      </div>
      {/* Right: Signup Form */}
      <div className="lg:p-36 md:p-52 sm:20 p-8 w-full lg:w-1/2">
        <h1 className="text-4xl mb-5 font-bold">Invoice Management</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          {/* Email Input */}
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-600">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
              autoComplete="off"
              required
            />
          </div>
          {/* Organization Name Input */}
          <div className="mb-4">
            <label htmlFor="companyName" className="block text-gray-600">
              Organization Name
            </label>
            <input
              type="text"
              id="companyName"
              name="companyName"
              onChange={(e) => setCompanyName(e.target.value)}
              className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
              autoComplete="off"
              required
            />
          </div>
          {/* Password Input */}
          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-600">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
              autoComplete="off"
              required
            />
          </div>
          {/* Logo Input */}
          <div className="mb-4">
            <label htmlFor="file" className="block text-gray-600">
              Logo
            </label>
            <input
              type="file"
              id="file"
              name="logo"
              onChange={(e) => handleSetFile(e)}
              className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
              autoComplete="off"
              required
            />
          </div>
          <img
            className={`rounded-md mb-3 ${imageURL ? "block" : "hidden"}`}
            src={imageURL}
            alt="company-logo"
          />
          {/* Sign Up Button */}
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-md py-2 px-4 w-full"
          >
            Sign Up
          </button>
        </form>
        {/* Sign up Link */}
        <div className="mt-6 text-blue-500 text-center">
          <Link to="/login" className="hover:underline">
            Already have an account? Login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Signup;
