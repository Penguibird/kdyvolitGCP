const functions = require('firebase-functions');
// const cors = require('cors')({ origin: true });

const admin = require('firebase-admin');
admin.initializeApp();

const emailFooter = `
    <p>Děkujeme, že se podílíte na demokracii naší země.</p>
    <a href="https://kdyvolit.cz">KdyVolit.cz</a>
    <img alt="KdyVolit.cz" src="data:image/png;base64,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" />
    <a href="https://kdyvolit.cz/unsubscribe.html"><i>Pokud nechcete dostávat tyto emaily, klikněte zde</i></a>`;

const confirmationEmail = {
    subject: "Děkujeme za odběr",
    body: `<p>Drahý voliči/voličko,</p>
    <br><br>
    <p>Tento email Ti přišel protože jsi se na naší stránce přihlásil/a k odběru upozornění o nadcházejících volbách a my Ti tímto chceme poděkovat za důvěru.</p>
    <br>
    <p>Zadáním svého emailu na naši stránce jsi se přihlásili k odběru. Na Tvou emailovou adresu Tě budeme informovat o datech voleb. 
    Na nadcházející volby Tě upozorníme nejprve tři týdny a poté dva dny před otevřením volebních místností.
    V emailu Tě také budeme informovat o jaké volby se jedná, kdy se konají a na stránce KdyVolit.cz, můžeš zjistit jestli se týkají i Tvého volebního obvodu.</p>
    <br>
    ${emailFooter}`
}

const translateTypes = {
    se: "senátní volby",
    sn: 'volby do poslanecké sněmovny'
}

const reminderEmail = {
    subject: "Upozornění na blížící se volby",
    body: (election, howFarAwayIsIt) => `
    <p>Drahý spoluúčastníku na demokracii,</p>
    <br><br>
    <p>tímto Vám připomínáme, že další volby se budou konat ${remindersForDatesInSpeech[howFarAwayIsIt]} dní. 
    Jedná se o ${translateTypes[election.type]}. Volit můžete 
    ${election.dates.map(date => {
        let dateDate = new Date(date.from);
        return `${dateDate.getDate()}. ${dateDate.getMonth() + 1}. od ${dateDate.getHours() + 1}:${dateDate.getMinutes()} do ${new Date(date.to).getHours() + 1}:${new Date(date.to).getMinutes()}`
    }).join(' a ')}.</p>
    <br>
    <p>Pokud chcete zjistit, jestli se volby týkají i Vašeho obvodu, klikněte <a href="https://kdyvolit.cz">zde</a> a vyplňte místo Vašeho bydliště.</p>
    <br>
    ${emailFooter}`

}

const remindersForDatesInMiliSeconds = [1814400000, 172800000]; //3 weeks; 2 days
const remindersForDatesInSpeech = ['za tři týdny', 'za dva dny'];
exports.timer = functions.pubsub
    .schedule('every 60 minutes')
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
                        remindPeopleOfElection(election, i).then(val => {
                            election.reminded[i] = true;
                            admin.firestore().collection('elections').doc(election.code).set(election);
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
            html: body
        }
    })
}


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

exports.removeEmail = functions.https.onCall(async (data, context) => {
    const original = data.email;
    return await admin.firestore().collection('emails').where('email', '==', original).get()
        .then(async doc => {
            if (doc.empty) {
                return { data: { error: 'No email like this', errorCode: 1 } }
            } else {
                return await doc.docs[0].ref.delete()
                    .then(async val => {
                        return { data: { result: `Deleted email with result: ${val}` } }
                    })
                    .catch(err => {
                        return { data: { error: err, errorCode: 2 } }
                    })
            }
        })
        .catch(error => {
            return { data: { error: error, errorCode: 2 } }
        })
        
    ;
})

// exports.notifyPeople = functions.https.onCall(async (data, context) => {
//     remindPeopleOfElection(data.election)
// })

const remindPeopleOfElection = async (election, howFarAwayIsIt) => {
    let users = await admin.firestore().collection('emails').get();
    let usersToSendEmailTo = [];
    users.forEach(user => usersToSendEmailTo.push(user.data())); //Dont care about what election is stored in the users data
    // users.forEach(user => usersToSendEmailTo.push(user.data().elections.includes(election.code) && user.data())); //care about what is stored in the user object
    // console.log("remind people elections", usersToSendEmailTo[0], election.code)
    return await sendEmail(usersToSendEmailTo.map(user => user.email), reminderEmail.subject, reminderEmail.body(election, howFarAwayIsIt))
}




