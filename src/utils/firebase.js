import * as firebase from 'firebase';
import 'firebase/firestore';

const firebaseApp = firebase.initializeApp({ 
	apiKey: "AIzaSyAR_ULfU03Eg0kBulclzs56QX6ygMOyKLU",
    authDomain: "cookbook-54133.firebaseapp.com",
    databaseURL: "https://cookbook-54133.firebaseio.com",
    projectId: "cookbook-54133",
    storageBucket: "cookbook-54133.appspot.com",
    messagingSenderId: "894281401356",
});

firebaseApp.firestore().enablePersistence();

export default firebaseApp;

