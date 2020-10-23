
const functions = require('firebase-functions');
const admin = require('firebase-admin');


const db = admin.firestore();

export const updateProductStock = functions.firestore
    .document('orders/{orderId}')
    .onCreate(async (snap : any, context: any) => {
        const order = snap.data();
        const products = order.products;
        for (const product of products) {
            const productRef = db.doc(`products/${product.id}`);
            const productSnap = await productRef.get();
            const productData = productSnap.data();
            if(productData.stock === 1){
                await productRef.delete();
            }
            else {
                await productRef.update({
                    stock: productData.stock - 1
                });
            }
        }
    });
