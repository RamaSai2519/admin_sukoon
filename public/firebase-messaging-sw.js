importScripts('https://www.gstatic.com/firebasejs/9.0.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.2/firebase-messaging-compat.js');

firebase.initializeApp({
    apiKey: "AIzaSyAJTlUxbEndDBjZBvDJUXGJBelkQHXfNAI",
    authDomain: "for-everyone-2519.firebaseapp.com",
    projectId: "for-everyone-2519",
    storageBucket: "for-everyone-2519.appspot.com",
    messagingSenderId: "221608439000",
    appId: "1:221608439000:web:8d3b9e17733071addbbbad",
});

const messaging = firebase.messaging();
