const functions = require('firebase-functions');
const cors = require('cors')({ origin: true });
const { confirmationEmail, reminderEmail } = require('./emails.js');


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
            sendEmail([original], confirmationEmail.subject, confirmationEmail.body)
            return { data: { result: `Message with ID: ${writeResult.id} added.`, ex: doc.empty, doc: doc.size } } // 
        }
    });

    // })
});

exports.removeEmail = functions.https.onRequest(async (req, res) => {
    const original = req.query.text;
    const result = await admin.firestore().collection('emails').where('email', '==', original).delete();
    res.json({ result: `Delete email ran with result: ${result}` });
})

// exports.notifyPeople = functions.https.onCall(async (data, context) => {
//     remindPeopleOfElection(data.election)
// })

const remindPeopleOfElection = async (election) => {
    let users = await admin.firestore().collection('emails').get();
    let usersToSendEmailTo = [];
    users.forEach(user => usersToSendEmailTo.push(user.data().elections.includes(election.code) && user.data()));
    // console.log("remind people elections", usersToSendEmailTo[0], election.code)
    return await sendEmail(usersToSendEmailTo.map(user => user.email), "subject", election.code)//reminderEmail.subject, reminderEmail.body(election))
}

const remindersForDatesInMiliSeconds = [1814400000, 172800000]; //3 weeks; 2 days
exports.timer = functions.pubsub
    .schedule('every 1 minutes')
    .timeZone('Europe/Prague')
    .onRun(async context => {
        console.log("Hey, I ran, this is costing you money")
        let currentDate = new Date(context.timestamp);
        let elections = await admin.firestore().collection('elections').get();
        elections.forEach(res => {

            let election = res.data();
            let electionDate = new Date(election.dates[0].from);
            if (!election.reminded) election.reminded = [];
            // console.log("OMG this runs too", election.dates[0].from);

            remindersForDatesInMiliSeconds.forEach((val, i) => {

                if (!election.reminded[i]) {
                    if (currentDate.getTime() + remindersForDatesInMiliSeconds[i] >= electionDate.getTime()) {
                        // console.log(currentDate, "plus some amount of time", i, " is after ", electionDate);
                        remindPeopleOfElection(election).then(val => {
                            election.reminded[i] = true;
                            admin.firestore().collection('elections').doc(election.code).set({ reminded: election.reminded });
                            // console.log("sent the mail I guess.")
                        }, err => {
                            console.error(err)
                        })
                    }
                }
            })
        })
    })

const sendEmail = async (recipients, subject, body) => {
    console.log("Sending email", subject, body)
    await admin.firestore().collection('mail').add({
        to: recipients,
        message: {
            subject: subject,
            body: body
        }
    })
}

