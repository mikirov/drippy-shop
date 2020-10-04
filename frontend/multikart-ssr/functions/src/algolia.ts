

const functions = require('firebase-functions');
const algoliasearch = require('algoliasearch');
const admin = require('firebase-admin');

// const env = functions.config();

const db = admin.firestore();

// Initialize the Algolia Client
const client = algoliasearch("D8SHSLF83H", "c172375a9e7a0b5ba9d1cc1509b9580d");
const index = client.initIndex('products');

export const indexProduct = functions.firestore
    .document('products/{productId}')
    .onCreate((snap: { data: () => any; id: any; }, context: any) => {
        const data = snap.data();
        const objectID = snap.id;

        // Add the data to the algolia index
        return index.addObject({
            objectID,
            ...data
        });
    });

export const updateProduct = functions.firestore
    .document('products/{productId}')
    .onUpdate((statechange: { after: any; }) => {
        const snap = statechange.after;
        const data = snap.data();
        const objectID = snap.id;

        // Add the data to the algolia index
        return index.saveObject({
            objectID,
            ...data
        });
    });

export const unindexProduct = functions.firestore
    .document('products/{productId}')
    .onDelete((snap: { id: any; }, context: any) => {
        const objectId = snap.id;

        // Delete an ID from the index
        return index.deleteObject(objectId);
    });


export const search = functions.https.onCall(async (data: { [x: string]: any; }, context: any) => {
    const query = data['query'];
    const page = data['page'];
    return await index.search({query, page});
});

// Create a HTTP request cloud function.
export const sendCollectionToAlgolia = functions.https.onRequest(async (req : Request, res: { status: (arg0: number) => { (): any; new(): any; send: { (arg0: string): void; new(): any; }; }; }) => {

    // This array will contain all records to be indexed in Algolia.
    // A record does not need to necessarily contain all properties of the Firestore document,
    // only the relevant ones.
    const algoliaRecords : any[] = [];

    // Retrieve all documents from the COLLECTION collection.
    const querySnapshot = await db.collection('products').get();

    querySnapshot.docs.forEach(function (doc: { data: () => any; id: any; } ) {
        const document = doc.data();
        // Essentially, you want your records to contain any information that facilitates search,
        // display, filtering, or relevance. Otherwise, you can leave it out.
        const record = {
            objectID: doc.id,
            ...document
        };

        algoliaRecords.push(record);
    });

    // After all records are created, we save them to
    index.saveObjects(algoliaRecords, (_error: any, content: any) => {
        res.status(200).send("products was indexed to Algolia successfully.");
    });

});
