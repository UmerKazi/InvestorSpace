// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

import {
    GoogleAuthProvider,
    getAuth,
    signInWithPopup,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    sendPasswordResetEmail,
    signOut,
    updateProfile,
    onAuthStateChanged,
} from "firebase/auth";
import {
    getFirestore,
    query,
    getDocs,
    setDoc,
    addDoc,
    collection,
    where,
    getDoc,
    doc,
    updateDoc,
    arrayUnion,
} from "firebase/firestore";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBMgZ83HuoenVovKe0G3Js_JimRtgdVVz8",
  authDomain: "investorspace.firebaseapp.com",
  projectId: "investorspace",
  storageBucket: "investorspace.appspot.com",
  messagingSenderId: "555650304342",
  appId: "1:555650304342:web:51252727ed4dd4e209aef7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();
provider.addScope('https://www.googleapis.com/auth/contacts.readonly');

const signUpWithGoogle = async () => {
  try {
    const res = await signInWithPopup(auth, provider);
    const user = res.user;
    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      displayName: user.displayName,
      email: user.email,
    })
    await updateProfile(user, {
      'displayName': user.displayName
    });
  } catch (err) {
    console.log(err);
  }
}

const signInWithGoogle = async () => {
  try {
    const res = await signInWithPopup(auth, provider);
    const user = res.user;
  } catch (err) {
    console.log(err);
  }
}



const logInWithEmailAndPassword = async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      if (err == 'FirebaseError: Firebase: Error (auth/wrong-password).') {
        alert("Incorrect Password, Please Try Again");
      } else if (err == "FirebaseError: Firebase: Access to this account has been temporarily disabled due to many failed login attempts. You can immediately restore it by resetting your password or you can try again later. (auth/too-many-requests).") {
        alert("Too Many Failed Login Attempts, Please Reset Your Password or Try Again Later");
      } else {
        alert(err);
      }
    }
};

const registerWithEmailAndPassword = async (email, password, firstName, lastName) => {
    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      const user = res.user;
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        displayName: firstName + ' ' +  lastName,
        firstName,
        lastName,
        email,
      })
      await updateProfile(user, {
        'displayName': firstName
      });
    } catch (err) {
      console.log(err);
    }
};

const sendPasswordReset = async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
      alert("Password reset link sent!");
    } catch (err) {
        console.log(err);
    }
};

const logout = () => {
    signOut(auth);
}

const getUserData = async (uid) => {
  const usersRef = collection(db, "users");
  const q = query(usersRef, where("uid", "==", uid));
  const querySnapshot = await getDocs(q);
  let userData = [];
  querySnapshot.forEach((doc) => {
    userData = doc.data();
  })
  return userData;
}

const setProfilePicture = async (pic) => {
  const user = getAuth().currentUser;
  try {
    await updateProfile(user, {
      'photoURL': pic
    })
  } catch (err) {
    console.log(err);
  }
}

const setDisplayName = async (name) => {
  const user = getAuth().currentUser;
  try {
    await updateProfile(user, {
      'displayName': name
    })
  } catch (err) {
    console.log(err);
  }
}

// uid : string, meetingName: string, time: timeStamp
const createMeeting = async (uid, meetingName, time) => {
  const user = getAuth().currentUser;
  const meetingID = '_' + Math.random().toString(36).substr(2, 9);
  try {
    await setDoc(doc(db, "meetings", meetingID), {
      organizer: uid,
      organizerName: user.displayName,
      meetingID: meetingID,
      meetingName: meetingName,
      time: time,
      attendees: [],
    })
  } catch (err) {
    console.log(err);
  }
}

const joinMeeting = async (meetingID, uid) => {
  const meetingsRef = doc(db, "meetings", meetingID);
  await updateDoc(meetingsRef, {
      attendees: arrayUnion(uid)
  });
}

const getUserMeetings = async (uid) => {
  const q1 = query(collection(db, "meetings"), where("organizer", "==", uid));
  const q2 = query(collection(db, "meetings"), where("attendees", "array-contains", uid));
  const querySnapshot1 = await getDocs(q1);
  const querySnapshot2 = await getDocs(q2);
  let userMeetings = [];
  querySnapshot1.forEach((doc) => {
    userMeetings.push(doc.data());
  })
  querySnapshot2.forEach((doc) => {
    userMeetings.push(doc.data());
  })
  return userMeetings;
}

const getMeetingData = async (meetingID) => {
  const q1 = query(collection(db, "meetings"), where("meetingID", "==", meetingID));
  const querySnapshot = await getDocs(q1);
  let meetingData = [];
  querySnapshot.forEach((doc) => {
    meetingData.push(doc.data());
  })
  return meetingData;
}

const getUserName = async (uid) => {
  const q1 = query(collection(db, "users"), where("uid", "==", uid));
  const querySnapshot = await getDocs(q1);
  let displayName = [];
  querySnapshot.forEach((doc) => {
    displayName.push(doc.data().displayName);
  })
  return displayName;
}

const createMeetingTopic = async (meetingID, meetingTopicName, meetingTopicDescription, meetingTopicTimeEstimate, meetingTopicAttachements) => {
  
}

// const removeAttendee = async (meetingID, attendee) => {
//   const meetingRef = doc(db, "meetings", meetingID);
//   await updateDoc(meetingRef, {
//     "attendees": FirebaseFirestore.FieldValue.arrayRemove({"attendees": attendee});
//   })
// }

export {
    auth,
    db,
    logInWithEmailAndPassword,
    registerWithEmailAndPassword,
    sendPasswordReset,
    logout,
    getAuth,
    onAuthStateChanged,
    getUserData,
    setProfilePicture,
    setDisplayName,
    signUpWithGoogle,
    signInWithGoogle,
    createMeeting,
    joinMeeting,
    getUserMeetings,
    getMeetingData,
    getUserName,
}