const functions = require('firebase-functions');
const admin = require('firebase-admin');

const nodemailer = require('nodemailer');
// require('cors')({origin: true});

const fs = require('fs');

require.extensions['.html'] = function (module, filename) {
    module.exports = fs.readFileSync(filename, 'utf8');
};

const newsletterHTML = require("../../../../email-template/email-template.html");

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'drippyshopbg@gmail.com',
        pass: 'drippypass'
    }
});
const db = admin.firestore();

export const sendNewsletter = functions.pubsub.schedule('every 5 minutes').onRun(async() => {
    console.log('This will be run every 5 minutes!');
    console.log(newsletterHTML); // string

    const querySnapshot = await db.collection('newsletter').get();
    querySnapshot.forEach((doc: { data: () => any; }) =>{
        const documentData = doc.data();

        const mailOptions = {
            from: 'Drippy shop <drippyshopbg@gmail.com>', // Something like: Jane Doe <janedoe@gmail.com>
            to: documentData.email,
            subject: 'Special products this week', // email subject
            html: newsletterHTML // TODO: get html
        };
        transporter.sendMail(mailOptions);
    });
    return null;
});
