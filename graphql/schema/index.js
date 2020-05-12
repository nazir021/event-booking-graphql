const {buildSchema} = require('graphql')

module.exports = buildSchema(`
type Booking {
    _id: ID!
    event: Event!
    user: User!
    createdAt: String!
    updatedAt: String!
}

type Event{
    _id: ID!
    title: String!
    description: String!
    price: Float!
    date: String!
    creator: User!
}
type User {
    _id: ID!
    email: String!
    password: String
    createdEvents: [Event!]
}

type authData { 
    userId: ID!
    token: String!
    tokenExpired: Int!
}

input eventInput{
    title: String!
    description: String!
    price: Float!
    date: String!
}
input userInput{
    email: String!
    password: String!
}
type rootQuery {
    events : [Event!]!
    bookings: [Booking!]!
    login(email: String!,password: String!): authData! 
}
type rootMutation{
    createEvent(eventinput: eventInput): Event
    createUser(userinput: userInput) : User
    bookEvent(eventId: ID!) : Booking!
    cancelEvent(bookingId: ID!) : Event!
}

schema {
    query: rootQuery
    mutation: rootMutation
}
`)