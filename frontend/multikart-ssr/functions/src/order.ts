
const functions = require('firebase-functions');
const admin = require('firebase-admin');


const db = admin.firestore();

export const updateProductStock = functions.firestore
    .document('orders/{orderId}')
    .onCreate(async (snap : any, context: any) => {
        const order = snap.data();
        const productIds = order.productIds;
        for (const productId of productIds) {
            const productRef = db.doc(`products/${productId}`);
            const productSnap = await productRef.get();
            const productData = productSnap.data();
            if(productData.stock === 0){
                await productRef.delete();
            }
        }
    });
