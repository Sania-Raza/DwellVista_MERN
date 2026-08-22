import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import {
  updateUserSuccess,
  updateUserStart,
  updateUserFailure,
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signOutUserStart,
} from "../redux/user/userSlice";
import { useEffect, useRef, useState } from "react";

export default function Profile() {
  const dispatch = useDispatch();
  const fileRef = useRef(null);
  const { loading, error } = useSelector((state) => state.user);
  const { currentUser } = useSelector((state) => state.user);
  const [file, setFile] = useState(undefined);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [formData, setFormData] = useState({});
  const [showListingsError, setShowListingsError]= useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
   const [userListings, setUserListings] = useState([]);
  const handleFileUpload = async () => {
    try {
      const formData = new FormData();
      formData.append("avatar", file);

      // 1. Upload image to Cloudinary
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/user/upload-avatar`,
        {
          method: "POST",
          body: formData,
        },
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Image upload failed");
      }

      console.log("Cloudinary URL:", data.imageUrl);

      // 2. Save Cloudinary URL in MongoDB
      const updateRes = await fetch(
        `${import.meta.env.VITE_API_URL}/api/user/update-avatar`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
           credentials: "include",
          body: JSON.stringify({
            userId: currentUser._id,
            avatar: data.imageUrl,
          }),
        },
      );

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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/user/update/${currentUser._id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(formData),
        },
      );
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

  // delete user
  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/user/delete/${currentUser._id}`,
        {
          method: "DELETE",
          
        },
      );
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };
  //signout
  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/signout`,
        {
          
          credentials: "include",
       }
      );
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(data.message));
    }
  };

  // show listings
  const handleShowListings = async () => {
    try {
      setShowListingsError(false);
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/user/listings/${currentUser._id}`,
        {
          
    credentials: "include",
  }
      );
      const data = await res.json();
      if (data.success === false) {
        setShowListingsError(true);
        return;
      }

      setUserListings(data);
    } catch (error) {
      setShowListingsError(true);
    }
  };

  //delete listings
   const handleListingDelete = async (listingId) => {
     try {
       const res = await fetch(
         `${import.meta.env.VITE_API_URL}/api/listing/delete/${listingId}`,
         {
           method: "DELETE",
           
         },
       );
       const data = await res.json();
       if (data.success === false) {
         console.log(data.message);
         return;
       }

       setUserListings((prev) =>
         prev.filter((listing) => listing._id !== listingId),
       );
     } catch (error) {
       console.log(error.message);
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
        <Link
          className="bg-green-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-95"
          to={"/create-listing"}
        >
          Create Listing
        </Link>
      </form>
      <div className="flex justify-between mt-5">
        <span
          onClick={handleDeleteUser}
          className="text-red-800 cursor-pointer"
        >
          Delete Account
        </span>
        <span onClick={handleSignOut} className="text-red-800 cursor-pointer">
          Sign Out
        </span>
      </div>
      <p className="text-red-700 mt-5">{error ? error : ""}</p>
      <p className="text-green-700 mt-5">
        {updateSuccess ? "User updated successfully" : ""}
      </p>
      <button onClick={handleShowListings} className="text-green-700 w-full">
        Show Listings
      </button>
      <p className="text-red-700 mt-5">
        {showListingsError ? "Error showing listings" : ""}
      </p>
      {userListings && userListings.length > 0 && (
        <div className="flex flex-col gap-4">
          <h1 className="text-center mt-7 text-2xl font-semibold">
            Your Listings
          </h1>
          {userListings.map((listing) => (
            <div
              key={listing._id}
              className="border rounded-lg p-3 flex justify-between items-center gap-4"
            >
              <Link to={`/listing/${listing._id}`}>
                <img
                  src={listing.imageUrls[0]}
                  alt="listing cover"
                  className="h-16 w-16 object-contain"
                />
              </Link>
              <Link
                className="text-slate-700 font-semibold  hover:underline truncate flex-1"
                to={`/listing/${listing._id}`}
              >
                <p>{listing.name}</p>
              </Link>

              <div className="flex flex-col item-center">
                <button
                  onClick={() => handleListingDelete(listing._id)}
                  className="text-red-700 uppercase"
                >
                  Delete
                </button>
                <Link to={`/update-listing/${listing._id}`}>
                  <button className="text-green-700 uppercase">Edit</button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
