import { useSelector, useDispatch } from "react-redux";
import { updateUserSuccess, updateUserStart,updateUserFailure } from "../redux/user/userSlice";
import { useEffect, useRef, useState } from "react";

export default function Profile() {
  const dispatch = useDispatch();
  const fileRef = useRef(null);
    const { loading, error } = useSelector((state) => state.user);
  const { currentUser } = useSelector((state) => state.user);
  const [file, setFile] = useState(undefined);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [formData, setFormData] = useState({});

  const [updateSuccess, setUpdateSuccess]= useState(false);


  const handleFileUpload = async () => {
  try {
    const formData = new FormData();
    formData.append("avatar", file);

    // 1. Upload image to Cloudinary
    const res = await fetch("/api/user/upload-avatar", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Image upload failed");
    }

    console.log("Cloudinary URL:", data.imageUrl);

    // 2. Save Cloudinary URL in MongoDB
    const updateRes = await fetch("/api/user/update-avatar", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: currentUser._id,
        avatar: data.imageUrl,
      }),
    });

    const updateData = await updateRes.json();

    if (!updateRes.ok) {
      throw new Error(updateData.message || "Avatar update failed");
    }

    console.log("User updated:", updateData.user);
    dispatch(updateUserSuccess(updateData.user));
    setUploadSuccess(true);

    setTimeout(() => {
      setUploadSuccess(false);
    }, 3000);
  } catch (error) {
    console.log(error);
  }
};
useEffect(() => {
  if (file) {
    handleFileUpload();
  }
}, [file]);
  
  const handleChange =(e)=>{
    setFormData({...formData , [e.target.id]: e.target.value});
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }

      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };
  return (
    <div className="p-3 max-w-lg  mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          onChange={(e) => setFile(e.target.files[0])}
          type="file"
          ref={fileRef}
          hidden
          accept="image/*"
        />
        <img
          onClick={() => fileRef.current.click()}
          src={currentUser.avatar}
          alt="profile"
          className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2"
        />
        {uploadSuccess && (
          <p className="text-green-600 text-center text-sm">
            Image uploaded successfully!
          </p>
        )}
        <input
          type="text"
          placeholder="username"
          defaultValue={currentUser.username}
          className="border p-3 rounded-lg"
          id="username"
          onChange={handleChange}
        />
        <input
          type="email"
          placeholder="email"
          defaultValue={currentUser.email}
          className="border p-3 rounded-lg"
          id="email"
          onChange={handleChange}
        />
        <input
          type="text"
          placeholder="password"
          className="border p-3 rounded-lg"
          id="password"
          onChange={handleChange}
        />
        <button
          disabled={loading}
          className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80"
        >
          {loading ? "Loading..." : "Update"}
        </button>
      </form>
      <div className="flex justify-between mt-5">
        <span className="text-red-800 cursor-pointer">Delete Account</span>
        <span className="text-red-800 cursor-pointer">Sign Out</span>
      </div>
      <p className="text-red-700 mt-5">{error ? error : ""}</p>
      <p className="text-green-700 mt-5">{updateSuccess? "User updated successfully" :"" }</p>
    </div>
  );
}
