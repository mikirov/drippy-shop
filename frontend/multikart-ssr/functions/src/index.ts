import * as admin from 'firebase-admin';
admin.initializeApp();
export {indexProduct, unindexProduct, search, updateProduct, sendCollectionToAlgolia} from './algolia';
export {updateProductStock} from './order'
// export {sendNewsletter} from  './newsletter'
