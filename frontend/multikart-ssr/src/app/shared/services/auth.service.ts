import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {User} from '../models/user';
import {AngularFireAuth} from '@angular/fire/auth';
import {AngularFirestore, AngularFirestoreDocument} from '@angular/fire/firestore';
import {Router} from '@angular/router';
import {first, shareReplay, switchMap} from 'rxjs/operators';
import {auth} from 'firebase';
import * as firebase from 'firebase';
import OAuthCredential = firebase.auth.OAuthCredential;

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    user$: Observable<User>;
    private snapshotUser: User;

    constructor(private afs: AngularFireAuth,
                private db: AngularFirestore,
                private router: Router) {

        this.user$ = this.afs.authState.pipe(
            switchMap(user => {
                if (user) {
                    console.log('logged in');
                    this.updateUserData(user);
                    return this.db.doc<User>(`users/${user.uid}`).valueChanges();
                } else {
                    return of(null);
                }
            }),
            shareReplay(1)
        );
        this.user$.subscribe(user => {
            this.snapshotUser = user;
        });
    }


    getUser() {
        return this.user$.pipe(first()).toPromise();
    }

    getSnapshotUser() {
        return this.snapshotUser;
    }

    private updateUserData(user) { // todo providerData is a quickfix
        // Sets user data in firestore on login
        console.log(user);
        const userRef: AngularFirestoreDocument<User> = this.db.doc(`users/${user.uid}`);
        const customUserData = {
            uid: user.uid,
            photoURL: user.providerData[0].photoURL,
            displayName: user.displayName,
            email: user.email,
            phoneNumber: user.phoneNumber,
        };
        // console.log('hello');
        return userRef.set(customUserData, {merge: true});
    }

    async signOut() {
        await this.afs.signOut();
        return this.router.navigate(['/']);
    }

    async googleSignin() {
        const provider = new auth.GoogleAuthProvider();
        const credential = await this.afs.signInWithPopup(provider);
        return this.updateUserData(credential.user);
    }

    isAdmin(): boolean {
        return this.snapshotUser.admin;
    }

    async facebookSignin() {
        const provider = new firebase.auth.FacebookAuthProvider();
        firebase.auth().useDeviceLanguage();
        provider.setCustomParameters({
            display: 'popup'
        });
        const result = await firebase.auth().signInWithPopup(provider);
        const credential: OAuthCredential = result.credential;
        console.log(credential.accessToken);
        return this.updateUserData(result.user);
    }
}
