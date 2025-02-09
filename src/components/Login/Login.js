import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";

function Login() {
  const [email, setEmail] = new useState("");
  const [password, setPassword] = new useState("");
  const [isLoading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log(userCredential.user);
        localStorage.setItem("user", userCredential.user.displayName);
        localStorage.setItem("logo", userCredential.user.photoURL);
        localStorage.setItem("email", userCredential.user.email);
        navigate("/dashboard");
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        const errorMsg = document.querySelector(".invalid");
        errorMsg.innerHTML = "Invalid Credential";
        errorMsg.classList.add("text-red-700");
        setTimeout(() => {
          errorMsg.innerHTML = ""; // Clear the message
        }, 3000);
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
        {/* <!-- Right: Login Form --> */}
        <div className="lg:p-36 md:p-52 sm:20 p-8 w-full lg:w-1/2">
          <h1 className="text-4xl mb-5 font-bold">Invoice Management</h1>
          <form onSubmit={handleSubmit}>
            {/* <!-- Username Input --> */}
            <div className="mb-4">
              <label htmlFor="username" className="block text-gray-600">
                Email
              </label>
              <input
                required
                type="email"
                id="username"
                name="username"
                onChange={(e) => {
                  setEmail(e.target.value);
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
                required
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
            <p className="invalid"></p>

            {/* <!-- Forgot Password Link --> */}
            {/* <div className="mb-6 text-blue-500">
              <a href="#" className="hover:underline">
                Forgot Password?
              </a>
            </div> */}
            {/* <!-- Login Button --> */}
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-md py-2 px-4 w-full"
            >
              {isLoading && (
                <i className="fa-solid fa-spinner fa-spin-pulse"></i>
              )}
              Login
            </button>
          </form>
          {/* <!-- Sign up  Link --> */}
          <div className="mt-6 text-blue-500 text-center">
            <Link to="/signup" className="hover:underline">
              Don't have an account? Sign up Here
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
