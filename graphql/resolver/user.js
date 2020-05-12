const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../../model/user')
module.exports = {
    createUser: async (args)=>{
        try{
        const existingUser = await User.findOne({email: args.userinput.email})
            if (existingUser){
                throw new Error('Users Already Exits')
            }
            const hashedPassword = await bcrypt.hash(args.userinput.password,12)
            const user  = new User({
                email : args.userinput.email,
                password: hashedPassword
            })
            const result = await user.save()
                return {...result._doc, password:null, _id: result.id}
        }    
        catch(err){
            throw err
        }
    },
    login: async ({email,password})=>{
        const user = await User.findOne({email:email})
        if(!user){
            throw new Error('User does not Exit!')
        }
        const isEqual = await bcrypt.compare(password,user.password)
        if(!isEqual){
            throw new Error('Password does not match')
        }
        let token = jwt.sign({userId: user.id,email: user.email},'keepitsecret',{expiresIn :'1h'})
        return {userId:user.id,token: token, tokenExpired:1}
    }
}