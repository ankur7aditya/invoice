import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, storage, db } from "../../firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { setDoc ,doc} from "firebase/firestore";

function Signup() {
  const [email, setEmail] = new useState("");
  const [password, setPassword] = new useState("");
  const [companyName, setCompanyName] = new useState("");
  const [file, setFile] = new useState(null);
  const navigate = useNavigate();

  const handleSumbit = (e) => {
    e.preventDefault();
    console.log(email, password);
    createUserWithEmailAndPassword(auth, email, password)
      .then((newUser) => {
        console.log(newUser);
        const date = new Date().getTime();
        const storageRef = ref(storage, `${companyName + date}`);
        uploadBytesResumable(storageRef, file).then((res) => {
          getDownloadURL(storageRef).then((url) => {
            console.log(url);
            updateProfile(newUser.user, {
              displayName: companyName,
              photoURL: url,
            });
            setDoc(doc(db, "users", newUser.user.uid), {
              uid: newUser.user.uid,
              displayName: companyName,
              email: email,
              photoURL: url,
            });
            navigate('dashboard');
          });
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <>
      <div className="bg-gray-100 flex justify-center items-center h-screen">
        {/* <!-- Left: Image --> */}
        <div className="w-1/2 h-screen hidden lg:block">
          <img
            src="https://imgs.search.brave.com/a_aQJaRJN7zEwdK2BhhFobzn1ML4IJf6ZySgbcQukwg/rs:fit:860:0:0/g:ce/aHR0cHM6Ly9jcmVh/dGUubWljcm9zb2Z0/LmNvbS9fbmV4dC9p/bWFnZT91cmw9aHR0/cHM6Ly9kc2dyY2Ru/YmxvYnByb2Q1dTMu/YXp1cmVlZGdlLm5l/dC9pbWFnZXMvY29s/bGVjdGlvbnMvaW52/b2ljZS53ZWJwJnc9/MTkyMCZxPTc1"
            alt="Placeholder"
            className="object-cover w-full h-full"
          />
        </div>
        {/* <!-- Right: Signup Form --> */}
        <div className="lg:p-36 md:p-52 sm:20 p-8 w-full lg:w-1/2">
          <h1 className="text-4xl mb-5 font-bold">Invoice Management</h1>
          <form onSubmit={handleSumbit}>
            {/* <!-- Username Input --> */}
            <div className="mb-4">
              <label htmlFor="username" className="block text-gray-600">
                Email
              </label>
              <input
                type="text"
                id="username"
                name="username"
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
                autoComplete="off"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="username" className="block text-gray-600">
                Organization Name
              </label>
              <input
                type="text"
                id="companyName"
                name="companyName"
                onChange={(e) => {
                  setCompanyName(e.target.value);
                }}
                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
                autoComplete="off"
              />
            </div>
            {/* <!-- Password Input --> */}
            <div className="mb-4">
              <label htmlFor="password" className="block text-gray-600">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
                autoComplete="off"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="file" className="block text-gray-600">
                Logo
              </label>
              <input
                type="file"
                id="file"
                name="logo"
                onChange={(e) => {
                  setFile(e.target.files[0]);
                }}
                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
                autoComplete="off"
              />
            </div>

            {/* <!-- Sign Up Button --> */}
            <button
              type="submit"
              //   onClick={handleSumbit}
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-md py-2 px-4 w-full"
            >
              Sign Up
            </button>
          </form>
          {/* <!-- Sign up  Link --> */}
          <div className="mt-6 text-blue-500 text-center">
            <Link to="/login" className="hover:underline">
              Already have an account? Login
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default Signup;
