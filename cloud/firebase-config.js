/*
  Firebase settings for cloud save and the parent page (cloud/sync.js, cloud/parent.js).
  Leave it as null and the site works exactly as before, with progress kept only on each device.

  To turn cloud save on:
    1. Create a Firebase project at https://console.firebase.google.com
    2. Build > Authentication > Sign-in method: enable "Google" (parents) and "Anonymous"
       (children's devices, linked with a pairing code).
    3. Authentication > Settings > Authorized domains: add the domain this site runs on.
    4. Build > Firestore Database: create a database, then paste cloud/firestore.rules into
       its Rules tab and Publish.
    5. Project settings > Your apps > Add a web app (</>), copy its config and paste it below
       in place of null, like:

  window.ANGLE_FIREBASE = {
    apiKey: "AIza...",
    authDomain: "your-project.firebaseapp.com",
    projectId: "your-project",
    appId: "1:1234567890:web:abc123"
  };

  These values are not secret: every Firebase website shows them. The security rules in
  cloud/firestore.rules are what keep each family's data private.

  Optional, for testing on a computer with the Firebase emulators only:
  window.ANGLE_FIREBASE_EMULATOR = { auth: "http://127.0.0.1:9099", host: "127.0.0.1", port: 8080 };
*/
window.ANGLE_FIREBASE = null;
