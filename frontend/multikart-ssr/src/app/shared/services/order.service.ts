import {Injectable} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {Order} from '../models/order';
import {Product} from '../models/product';
import {User} from '../models/user';

@Injectable({
    providedIn: 'root'
})
export class OrderService {

    constructor(private db: AngularFirestore) {
    }

    async create(productIds: string[]) {
        const orderId = this.db.createId();
        const order: Order = {
            orderId,
            productIds,
        };

        const documentReference = this.db.doc<Order>(`/orders/${orderId}`);
        await documentReference.set(Object.assign({}, order), {merge: true});
        return orderId;
    }

    delete(id) {
        this.db.doc(`/orders/{id}`).delete();
    }

    get(id) {
      return this.db.doc<Order>(`/orders/{id}`).valueChanges();
    }

    getAll() {
      return this.db.collection<Order>('orders').valueChanges();
    }
}
