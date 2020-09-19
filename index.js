const functions = require('firebase-functions');


const admin = require('firebase-admin');
admin.initializeApp();

exports.addEmail = functions.https.onRequest(async (req, res) => {
    const original = req.query.text;
    const snapshot = await admin.firestore().collection('emails').where('email', '==', 'original').get();
    if (!/[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/.test(original)) {
        res.json({ error: `${original} is not a valid email!`, errorCode: 1 })
    } else if (!snapshot.empty) {
        res.json({ error: `${original} already exists in the database`, errorCode: 2})
    } else {
        const writeResult = await admin.firestore().collection('emails').add({ email: original });
        res.json({ result: `Message with ID: ${writeResult.id} added.` });
    }
});

exports.removeEmail = functions.https.onRequest(async (req,res) => {
    const original = req.query.text;
    const result = await admin.firestore().collection('emails').where('email', '==', 'original').delete();
    res.json({result: `Delete email ran with result: ${result}`});
})