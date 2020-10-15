import {Injectable} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';

@Injectable({
    providedIn: 'root'
})
export class EmailService {

    constructor(private db: AngularFirestore) {
    }

    addNewsletterEmail(email: string) {
        this.db.collection('newsletter').add(email);
    }

}
