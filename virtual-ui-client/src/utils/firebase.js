
import { initializeApp } from "firebase/app";
import {getAuth, GoogleAuthProvider} from "firebase/auth"

const firebaseConfig = {
  apiKey: "AIzaSyCksq5LYK-1LXpA1KMkGdbk_Dc_axcEt2c",
  authDomain: "virtual-20f5f.firebaseapp.com",
  projectId: "virtual-20f5f",
  storageBucket: "virtual-20f5f.firebasestorage.app",
  messagingSenderId: "86188149443",
  appId: "1:86188149443:web:21b423ba4dcdde10c3f076"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app)

const provider = new GoogleAuthProvider()

export {auth , provider}