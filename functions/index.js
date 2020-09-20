const functions = require('firebase-functions');
const cors = require('cors')({ origin: true });



const admin = require('firebase-admin');
admin.initializeApp();

exports.addEmail = functions.https.onCall(async (data, context) => {
    // cors(req, res, async () => {
    const original = data.email;
    const elections = data.elections
    // console.log("Email: ", original, "data: ", data);
    return await admin.firestore().collection('emails').where('email', '==', original).get().then(async doc => {
        console.log("Function execution")
        if (!/[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/.test(original)) {
            // res.status(200).send({ data: { error: `${original} is not a valid email!`, errorCode: 1 } })
            return { data: { error: `${original} is not a valid email!`, errorCode: 1 } }
        } else if (!doc.empty) {
            // res.status(200).send({ data: { error: `${original} already exists in the database`, errorCode: 2 } })
            return { data: { error: `${original} already exists in the database`, errorCode: 2 } }
        } else {
            const writeResult = await admin.firestore().collection('emails').add({ email: original, elections: elections });
            // res.status(200).send({ data: { result: `Message with ID: ${writeResult.id} added.` } });
            return { data: { result: `Message with ID: ${writeResult.id} added.`, ex: doc.empty, doc: doc.size} } // 
        }
    });

    // })
});

exports.removeEmail = functions.https.onRequest(async (req, res) => {
    const original = req.query.text;
    const result = await admin.firestore().collection('emails').where('email', '==', 'original').delete();
    res.json({ result: `Delete email ran with result: ${result}` });
})