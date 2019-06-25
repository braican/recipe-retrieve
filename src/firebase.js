import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

import config from './config';

firebase.initializeApp(config);

export const db = firebase.firestore();
export const auth = firebase.auth();
export const authProvider = new firebase.auth.GoogleAuthProvider();
