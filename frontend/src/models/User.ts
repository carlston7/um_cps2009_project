export default interface User {
    name: String,
    surname: String,
    email_address: String,
    password: String,
    credit: Number,
    type: ['member', 'owner', 'admin']
}
