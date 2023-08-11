import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: 'AIzaSyBldF_7It5ChQK2jYfX6VOhiJ9Shs9Iptw',
  authDomain: 'whatsapp-clone-4e8ea.firebaseapp.com',
  projectId: 'whatsapp-clone-4e8ea',
  storageBucket: 'whatsapp-clone-4e8ea.appspot.com',
  messagingSenderId: '179891876105',
  appId: '1:179891876105:web:68b496ff106ef1726d63d8'
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

export const firebaseAuth = getAuth(app)
