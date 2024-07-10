import React, { useRef, useState } from "react";
import { db, storage, auth } from "../../firebase";
import { ref, uploadBytesResumable } from "firebase/storage";
import { updateProfile } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";

function Setting() {
  const inputRef = useRef(null);
  // const [email, setEmail] = useState("");
  // const [password, setPassword] = useState("");
  const [companyName, setCompanyName] = useState(localStorage.getItem("user"));
  const [file, setFile] = useState(null);
  // const [error, setError] = useState(null);
  const [imageURL, setImageURL] = useState(localStorage.getItem("logo"));
  const [display, setDisplay] = useState(false);
  const [inputDisplay, setInputDisplay] = useState(false);

  //Functions to update logo
  const displayEditLogo = () => {
    inputRef.current.click();
    setDisplay(true);
  };
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setImageURL(URL.createObjectURL(e.target.files[0]));
  };
  const handleUpdateLogo = async (e) => {
    const fileRef = ref(storage, localStorage.getItem("logo"));
    const storageRef = ref(storage, fileRef._location.path_);
    uploadBytesResumable(storageRef, file).then((result) => {
      window.location.reload();
      setFile(null);
    });
    setDisplay(false);
  };

  // functions for updatind Company Name
  const handleCNameChange = () => {
    setInputDisplay(true);
  };

  const updateCompanyName = () => {
    const user = auth.currentUser;
    updateProfile(user, {
      displayName: companyName,
    }).then(async() => {
      setInputDisplay(false);
      localStorage.setItem("user", companyName);
      await updateDoc(doc(db, "users", user.uid), {
        displayName: companyName,
      });
      window.location.reload();
    });
  };

  return (
    <>
      <div className="container bg-white rounded-3xl">
        {/* Update Company Logo */}
        <div className="image-section flex flex-col items-center mb-5 sm:mt-5 py-3">
          <img
            onClick={displayEditLogo}
            src={imageURL}
            className="h-20 w-20 md:h-30 md:w-30 lg:h-44 lg:w-44 rounded-full shadow-lg cursor-pointer"
            alt="company-logo"
          />
          <input
            type="file"
            name="company-new-logo"
            id="new-logo"
            className="hidden"
            onChange={(e) => handleFileChange(e)}
            ref={inputRef}
          />
          {file && (
            <button
              onClick={handleUpdateLogo}
              className={`mt-4 bg-blue-700 p-2 rounded-md text-white ${
                display ? "block" : "hidden"
              }`}
            >
              Update Company Logo
            </button>
          )}
        </div>

        {/* Update comapany name */}
        <div className="name-section flex flex-col items-center">
          <div className="lg:flex lg:justify-center">
            <p className="text-xl">Company Name:</p>
            <p
              onClick={handleCNameChange}
              className={`text-2xl font-bold cursor-text ${
                inputDisplay ? "hidden" : "block"
              }`}
            >
              {companyName}
            </p>
            <input
              type="text"
              name="new-companyName"
              id="newCName"
              className={`bg-gray-200 ${inputDisplay ? "block" : "hidden"}`}
              onChange={(e) => setCompanyName(e.target.value)}
              value={companyName}
            />
          </div>

          <button
            onClick={updateCompanyName}
            className="bg-blue-700 rounded-lg p-2 my-3 text-white"
          >
            Update Company Name
          </button>
        </div>
      </div>
    </>
  );
}

export default Setting;
