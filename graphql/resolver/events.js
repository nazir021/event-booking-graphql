const Event = require('../../model/event')
const User = require('../../model/user')
const {returnEvent} = require('./merge')
const {dateToString} = require('../../helpers/date')




module.exports = {
    events: async ()=>{
        try{
        const events = await Event.find()
            return events.map(event=>{
                return returnEvent(event)
            })
        }
        catch(err){
            throw err
        }
    },
    createEvent: async (args,req)=>{
        if(!req.isAuth){
            throw new Error('Unathenticate')
        }
        const event = new Event({
            title: args.eventinput.title,
            description: args.eventinput.description,
            price: +args.eventinput.price,
            date: dateToString(args.eventinput.date),
            creator: req.userId
        })
        let createdEvent
        try{
        const result = await event
        .save()
            createdEvent = returnEvent(result)
            const creator = await User.findById(req.userId)
            if (!creator){
                throw new Error('Users not found')
            }
            creator.createdEvents.push(event)
            await creator.save()
            return createdEvent
        }
        catch(err){
            console.log(err)
            throw err
        }
    }
}

//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1ZTgwY2I0YWZiZTUzZDVlZTAzNzE3YzEiLCJlbWFpbCI6ImV4YW1wbGVAZ21haWwuY29tIiwiaWF0IjoxNTg2MDgxMzQxLCJleHAiOjE1ODYwODQ5NDF9.KJS_HOdxPrbWRfYSAnCMjtK2sTInZ6YQXv3L_88BQ9A