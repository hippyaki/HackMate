// src/services/authService.js
import { initializeApp } from 'firebase/app';

import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  sendEmailVerification, 
  sendPasswordResetEmail,
  updateProfile,
  signOut 
} from 'firebase/auth';

import { 
  getStorage, 
  ref, 
  uploadBytes, 
  getDownloadURL 
} from "firebase/storage";


// Firebase configuration 
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
// const storage = getFirestore(app);
const storage = getStorage();
// const analytics = getAnalytics(app);
const googleProvider = new GoogleAuthProvider();

class AuthService {
  // Google Sign-In
  

  static async signInWithGoogle() {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      return {
        success: true,
        user: {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL
        }
      };
    } catch (error) {
      console.error('Google Sign-In Error:', error);
      return {
        success: false,
        error: {
          code: error.code,
          message: error.message
        }
      };
    }
  }

  // Email and Password Login
  static async loginWithEmail(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      if (!user.emailVerified) {
        throw new Error('Email not verified. Please check your inbox.');
      }
      
      return {
        success: true,
        user: {
          uid: user.uid,
          email: user.email
        }
      };
    } catch (error) {
      console.error('Email Login Error:', error);
      return {
        success: false,
        error: {
          code: error.code,
          message: error.message
        }
      };
    }
  }

  // Email and Password Sign Up
  static async signUpWithEmail(email, password) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      await sendEmailVerification(user);

      return {
        success: true,
        message: 'Signup successful! Please check your email to verify your account.',
        user: {
          uid: user.uid,
          email: user.email,
          emailVerified: user.emailVerified
        }
      };
    } catch (error) {
      console.error('Email Sign Up Error:', error);
      return {
        success: false,
        error: {
          code: error.code,
          message: error.message
        }
      };
    }
  }

  // Resend Verification Email
  static async resendVerificationEmail() {
    try {
      const user = auth.currentUser;
      if (user) {
        await sendEmailVerification(user);
        return { success: true, message: 'Verification email sent again.' };
      } else {
        throw new Error('No user is currently logged in.');
      }
    } catch (error) {
      console.error('Resend Verification Email Error:', error);
      return {
        success: false,
        error: {
          code: error.code,
          message: error.message
        }
      };
    }
  }

  // Logout
  static async logout() {
    try {
      await signOut(auth);
      return { success: true };
    } catch (error) {
      console.error('Logout Error:', error);
      return {
        success: false,
        error: {
          code: error.code,
          message: error.message
        }
      };
    }
  }

  static async forgotPassword(email) {
    try {
      await sendPasswordResetEmail(auth, email);
      return {
        success: true,
        message: "Password reset email sent successfully!",
      };
    } catch (error) {
      console.error("Forgot Password Error:", error);
      return {
        success: false,
        error: {
          code: error.code,
          message: error.message,
        },
      };
    }
  }

  // Get Current User
  static getCurrentUser() {
    return auth.currentUser;
  }

  // Listen for Authentication State Changes
  static onAuthStateChanged(callback) {
    return auth.onAuthStateChanged(callback);
  }

  async updateUserProfile({ displayName, photoFile }) {
    const user = this.auth.currentUser;
    if (!user) {
      throw new Error("No authenticated user");
    }

    try {
      // Upload photo if provided
      let photoURL;
      if (photoFile) {
        const storageRef = ref(
          this.storage, 
          `profile_photos/${user.uid}/${photoFile.name}`
        );
        
        const snapshot = await uploadBytes(storageRef, photoFile);
        photoURL = await getDownloadURL(snapshot.ref);
      }

      // Update profile
      await updateProfile(user, {
        displayName: displayName || undefined,
        photoURL: photoURL || undefined
      });

      return {
        displayName: user.displayName,
        photoURL: user.photoURL
      };
    } catch (error) {
      console.error("Profile update error:", error);
      throw error;
    }
  }

  // async updateUserEmail({ newEmail, currentPassword }) {
  //   const user = this.auth.currentUser;
  //   if (!user) {
  //     throw new Error("No authenticated user");
  //   }

  //   try {
  //     // Reauthenticate user
  //     const credential = EmailAuthProvider.credential(
  //       user.email || '', 
  //       currentPassword
  //     );
      
  //     await reauthenticateWithCredential(user, credential);

  //     // Update email
  //     await updateEmail(user, newEmail);

  //     return { email: user.email };
  //   } catch (error) {
  //     console.error("Email update error:", error);
  //     throw error;
  //   }
  // }
  

}

export default AuthService;