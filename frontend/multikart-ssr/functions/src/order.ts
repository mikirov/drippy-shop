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
            const shouldBeArchived = productData.stock === 1;
            await productRef.update({
                archived: shouldBeArchived,
                stock: productData.stock - 1 > 0 ? productData.stock - 1 : 0
            });
        }
    });
//
// export const createOrder = functions.https.onRequest(async (request: { query: { productIds: string[]; uid: any; }; }, response: { status: (arg0: number) => { (): any; new(): any; send: { (arg0: string): void; new(): any; }; }; send: (arg0: string) => void; }) => {
//
//     const productIds: string[] = request.query.productIds;
//     const userId = request.query.uid;
//     if(!userId){
//         response.status(400).send('ERROR you must supply a user id');
//
//     }
//     console.log("user id:" + userId);
//     if (!productIds || productIds.length === 0) {
//         response.status(400).send('ERROR you must supply a product ids');
//     }
//     console.log(productIds);
//     for(const productId of productIds){
//         const productRef = db.doc(`products/${productId}`);
//         const productSnap = await productRef.get();
//         const productData = productSnap.data();
//         if(productData.stock === 0){
//             productIds.splice(productIds.indexOf(productId),1);
//         }
//     }
//     console.log(productIds);
//     const orderId = db.createId();
//     const order: Order = {
//         orderId,
//         productIds,
//         userId: userId
//     };
//
//     const documentReference = db.doc(`/orders/${orderId}`);
//     await documentReference.set(Object.assign({}, order), {merge: true});
//     return orderId;
//     response.send(`orderId`);
// });
