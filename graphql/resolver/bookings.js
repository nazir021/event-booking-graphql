const Event = require('../../model/event')
const Booking = require('../../model/booking')
const {dateToString} = require('../../helpers/date')
const {returnBooking,returnEvent} = require('./merge')



module.exports = {
    bookings: async (args,req)=>{
        if(!req.isAuth){
            throw new Error('Unathenticate')
        }
        try{
            const bookings = await Booking.find({user: req.userId})
            return bookings.map(booking=>{
                return returnBooking(booking)
            })
        }
        catch(err){
            throw err
        }
    },
    bookEvent: async (args,req) =>{
        if(!req.isAuth){
            throw new Error('Unathenticate')
        }
        const fetchedEvent  = await Event.findOne({_id: args.eventId})
        const booking = new Booking({
            event: fetchedEvent,
            user: req.userId
        })
        const result = await booking.save()
        return returnBooking(result)
    },
    cancelEvent: async (args,req)=>{
        if(!req.isAuth){
            throw new Error('Unathenticate')
        }
        try{
            const booking = await Booking.findById(args.bookingId).populate('event')
            const event = returnEvent(booking.event)
            await Booking.deleteOne({_id: args.bookingId})
            return event
        }
        catch(err){
            throw err
        }
    }
}
