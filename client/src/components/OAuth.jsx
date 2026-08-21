import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { app } from "../firebase";
import { FaGoogle } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { signInSuccess } from "../redux/user/userSlice.js";
import { useNavigate } from "react-router-dom";
export default function OAuth() {
  const dispatch = useDispatch();
  const navigate=useNavigate();
  const handleGoogleClick = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);
      const result = await signInWithPopup(auth, provider);
     const res = await fetch(
       `${import.meta.env.VITE_API_URL}/api/auth/google`,
       {
         method: "POST",
         headers: {
           "Content-Type": "application/json",
         },
         credentials: "include",
         body: JSON.stringify({
           name: result.user.displayName,
           email: result.user.email,
           photo: result.user.photoURL,
         }),
       },
     );
      const data = await res.json();
      dispatch(signInSuccess(data));
      navigate('/');
    } catch (error) {
      console.log("could not signIn withGoogle", error);
    }
  };
  return (
    <button
      onClick={handleGoogleClick}
      type="button"
      className="bg-red-700 text-white p-3 rounded-lg uppercase hover:opacity-85"
    >
      <FaGoogle className="flex flex-row align-middle" />
      Continue with google
    </button>
  );
}
