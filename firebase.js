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
    deleteDoc,
    FieldValue,
    arrayRemove,
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
      photoURL: user.photoURL,
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
        photoURL: 'https://i.pinimg.com/474x/f1/da/a7/f1daa70c9e3343cebd66ac2342d5be3f.jpg',
      })
      await updateProfile(user, {
        'displayName': firstName
      });
    } catch (err) {
      console.log(err);
    }
};

const storePfp = async (file) => {
  const user = getAuth().currentUser;
  const storage = getStorage();
  const pfpRef = ref(storage, user.uid + '.png');
  uploadBytes(pfpRef, file);
}

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

const getUserPhoto = async (uid) => {
  const q1 = query(collection(db, "users"), where("uid", "==", uid));
  const querySnapshot = await getDocs(q1);
  let photo = [];
  querySnapshot.forEach((doc) => {
    photo.push(doc.data().photoURL);
  })
  return photo;
}

const createMeetingTopic = async (meetingID, meetingTopicName, meetingTopicDescription, meetingTopicTimeEstimate) => {
  const user = getAuth().currentUser;
  const meetingTopicID = '_' + Math.random().toString(36).substr(2, 9);
  const meetingsRef = doc(db, "meetings", meetingID);
  try {
    await setDoc(doc(db, "meetingTopics", meetingTopicID), {
      meetingID: meetingID,
      meetingTopicID: meetingTopicID,
      name: meetingTopicName,
      description: meetingTopicDescription,
      duration: meetingTopicTimeEstimate,
      attachments: [],
    })
    await updateDoc(meetingsRef, {
        meetingTopics: arrayUnion(meetingTopicID)
    });
  } catch (err) {
    console.log(err);
  }
}

const getMeetingTopics = async (meetingID) => {
  const q1 = query(collection(db, "meetingTopics"), where("meetingID", "==", meetingID));
  const querySnapshot = await getDocs(q1);
  let meetingTopics = [];
  querySnapshot.forEach((doc) => {
    meetingTopics.push(doc.data());
  })
  return meetingTopics;
}

const updateMeetingDetails = async (meetingID, meetingName, meetingTime) => {
  const meetingsRef = doc(db, "meetings", meetingID);
  await updateDoc(meetingsRef, {
      meetingName: meetingName,
      time: meetingTime,
  });
}

const deleteMeetingTopic = async (meetingID, meetingTopicID) => {
  const meetingsRef = doc(db, "meetings", meetingID);
  const meetingTopicsRef = doc(db, "meetingTopics", meetingTopicID);
  await deleteDoc(meetingTopicsRef);
  await updateDoc(meetingsRef, {
    "meetingTopics": arrayRemove(meetingTopicID)
  })
}

const updateMeetingTopic = async (meetingTopicID, topicName, description, duration) => {
  const meetingsRef = doc(db, "meetingTopics", meetingTopicID);
  await updateDoc(meetingsRef, {
      name: topicName,
      description: description,
      duration: duration,
  });
}

const removeAttendee = async (meetingID, attendee) => {
  const meetingRef = doc(db, "meetings", meetingID);
  await updateDoc(meetingRef, {
    "attendees": arrayRemove(attendee)
  })
}

const deleteMeeting = async (meetingID) => {
  const meetingsRef = doc(db, "meetings", meetingID);
  await deleteDoc(meetingsRef);
}

const leaveMeeting = async (meetingID, attendee) => {
  const meetingsRef = doc(db, "meetings", meetingID);
  await updateDoc(meetingsRef, {
    "attendees": arrayRemove(attendee)
  })
}

const updateUserPfp = async (photoURL) => {
  const usersRef = doc(db, "users", user.uid);
  await updateDoc(usersRef, {
    "photoURL": photoURL
  })
}

const updateUserName = async (displayName) => {
  const user = getAuth().currentUser;
  const usersRef = doc(db, "users", user.uid);
  await updateDoc(usersRef, {
    "displayName": displayName
  })
}

const getPfpUrl = async() => {
  const user = getAuth().currentUser;
  const storage = getStorage();
  const lol = await getDownloadURL(ref(storage, user.uid + '.png'));
  return lol;
}

export {
    auth,
    db,
    logInWithEmailAndPassword,
    registerWithEmailAndPassword,
    sendPasswordReset,
    logout,
    getAuth,
    updateUserName,
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
    removeAttendee,
    getUserPhoto,
    createMeetingTopic,
    updateMeetingDetails,
    getMeetingTopics,
    deleteMeetingTopic,
    updateMeetingTopic,
    deleteMeeting,
    leaveMeeting,
    storePfp,
    getPfpUrl,
    updateUserPfp,
}