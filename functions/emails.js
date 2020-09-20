const confirmationEmail = {
    subject: "",
    body: ``
}

const translateTypes = {
    se: "Senátní volby",
    sn: 'Volby do poslanecké sněmovny'
}

const reminderEmail = {
    subject: "Volby se blizi",
    body: (election) => `
        Dobry den dovoljeme si vas upozornit ze se blizi ${translateTypes[election.type]}
    `
}

module.exports = [confirmationEmail, reminderEmail]