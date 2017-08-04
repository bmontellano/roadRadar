
const
  // Post = require('./Post'),
  mongoose = require('mongoose'),
  bcrypt = require('bcrypt-nodejs'),
     postSchema = new mongoose.Schema({
        lat: {type: Number, required: true},
        lng: {type: Number, required: true},
        incident: {type: String, required: true},
        comment: String,
        timestamp: {type:Number, default: new Date().getTime()},
        active: {type: Boolean, default: true},
    }),
  userSchema = new mongoose.Schema({
    local: {
        name: String,
        email: String,
        password: String
     },
      posts: [postSchema]
    })

userSchema.methods.generateHash = function(password){
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8))
}

userSchema.methods.validPassword = function(password){
  return bcrypt.compareSync(password, this.local.password)
}

module.exports = mongoose.model('User', userSchema);
