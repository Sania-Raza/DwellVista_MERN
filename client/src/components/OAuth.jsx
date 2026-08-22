import {
  GoogleAuthProvider,
  getAuth,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
} from "firebase/auth";

import { app } from "../firebase";
import { FaGoogle } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { signInSuccess } from "../redux/user/userSlice.js";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function OAuth() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const auth = getAuth(app);
  const provider = new GoogleAuthProvider();

  // Handle Google login after mobile redirect
  useEffect(() => {
    const handleRedirectResult = async () => {
      try {
        const result = await getRedirectResult(auth);

        if (!result) return;

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
          }
        );

        const data = await res.json();

        if (data.success === false) {
          console.log(data.message);
          return;
        }

        dispatch(signInSuccess(data));
        navigate("/");
      } catch (error) {
        console.log("Google redirect login error:", error);
      }
    };

    handleRedirectResult();
  }, [auth, dispatch, navigate]);

  const handleGoogleClick = async () => {
    try {
      // Detect mobile device
      const isMobile = /Android|iPhone|iPad|iPod/i.test(
        navigator.userAgent
      );

      if (isMobile) {
        // Mobile → redirect
        await signInWithRedirect(auth, provider);
        return;
      }

      // Desktop → popup
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
        }
      );

      const data = await res.json();

      if (data.success === false) {
        console.log(data.message);
        return;
      }

      dispatch(signInSuccess(data));
      navigate("/");
    } catch (error) {
      console.log("Could not sign in with Google:", error);
    }
  };

  return (
    <button
      onClick={handleGoogleClick}
      type="button"
      className="bg-red-700 text-white p-3 rounded-lg uppercase hover:opacity-85 flex items-center justify-center gap-2"
    >
      <FaGoogle />
      Continue with Google
    </button>
  );
}
