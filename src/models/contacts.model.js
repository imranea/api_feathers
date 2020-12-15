require('mongoose-type-email');
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
// contacts-model.js - A mongoose model
// 
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const modelName = 'contacts';
  const mongooseClient = app.get('mongooseClient');
  const { Schema } = mongooseClient;
  const schema = new Schema({
    name : {
      first: {
        type: String,
        required: [true, 'First Name is required']
      },
      last: {
        type: String,
        required: false
      }
    },
    email : {
      type: mongooseClient.SchemaTypes.Email,
      required: [true, 'Email is required'],
      unique:true
    },
    password:{
      type:String,
      required:true,
      trim:true
    },
    phone : {
      type: String,
      required: [true, 'Phone is required'],
      validate: {
        validator: function(v) {
          return /^\+(?:[0-9] ?){6,14}[0-9]$/.test(v);
        },
        message: '{VALUE} is not a valid international phone number!'
      }
    },
    tokens:[{
      token:{
        type:String,
        required:true
      }
    }]
  }, {
    timestamps: true
  });

  schema.methods.generateAuthToken = async function(){
    const contact = this
    const token = jwt.sign({_id:contact._id.toString()},"thisismystringforjwt")
    contact.tokens = contact.tokens.concat({token})

    await contact.save()
    return token
  }

  schema.pre("save", async function(next){  // before save, hash of password
    const contact = this
    if(contact.isModified("password")){
      contact.password = await bcrypt.hash(contact.password,10)
    }

    next()
})

  // This is necessary to avoid model compilation errors in watch mode
  // see https://mongoosejs.com/docs/api/connection.html#connection_Connection-deleteModel
  if (mongooseClient.modelNames().includes(modelName)) {
    mongooseClient.deleteModel(modelName);
  }
  return mongooseClient.model(modelName, schema);
  
};
