import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "./firebase";
import { FcGoogle } from 'react-icons/fc';

function GoogleLogin() {

    const handleGoogleLogin = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);

            const user = result.user;

            console.log("Logged in:", user);
            console.log("Name:", user.displayName);
            console.log("Email:", user.email);
            console.log("Photo:", user.photoURL);

        } catch (error) {
            console.error("Google login failed:", error);
        }
    };

    return (
        <button onClick={handleGoogleLogin} className="w-full flex items-center justify-center gap-2 bg-white text-black py-2 rounded font-medium text-sm hover:bg-gray-100 transition">
            <FcGoogle className="text-lg" />
            Login with Google
        </button>

    );
}

export default GoogleLogin;