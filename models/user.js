const
  mongoose = require('mongoose'),
  bcrypt = require('bcrypt-nodejs'),
  userSchema = new mongoose.Schema({
    local: {
      name: String,
      email: String,
      password: String
    },
      posts: [{type: mongoose.Schema.Types.ObjectId, ref: 'Post'}]
    }),
    User = mongoose.model('User', userSchema)

module.exports = User

userSchema.methods.generateHash = function(password){
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8))
}

userSchema.methods.validPassword = function(password){
  return bcrypt.compareSync(password, this.local.password)
}
