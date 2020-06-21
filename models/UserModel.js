const crypto = require("crypto");
const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
//création Schema

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "please tell us your name !"]
  },
  email: {
    type: String,
    required: [true, "please provide us your email !"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Please provide a valid email"]
  },
  photo: String,
  role: {
    type: String,
    enum: ["admin", "createur", "user"],
    default: "user"
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
    minlength: 8
    //select: false
  },
  passwordConfirm: {
    type: String,
    required: [true, "Please confirm your password"],
    //it works only in create or save !!!
    validate: {
      validator: function(el) {
        return el === this.password;
      },
      message: "Passwords are not the same !"
    }
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date
});
//avant de sauvegarder ,il faut faire le cryptage de mdp
UserSchema.pre("save", async function(next) {
  if (!this.isModified) return next();
  //cryptage mdp par bcrypt
  this.password = await bcrypt.hash(this.password, 12);
  //pour ne pas sauvegarder le passwordConfirm
  this.passwordConfirm = undefined;
  next();
});

//fonction qui renvoi true si le mdp tapé par l'utilisateur == mdp crypté
UserSchema.methods.correctPassword = async function(
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};
//fonction qui renvoi true si le mdp est changé aprés le timestamp de token
UserSchema.methods.changePasswordAfter = async function(JWTTimeStamp) {
  if (this.passwordChangedAt) {
    const changedTimeStamp = parseInt(this.passwordChangedAt.getTime() / 1000);
    console.log(JWTTimeStamp, changedTimeStamp);
    return JWTTimeStamp < changedTimeStamp;
  }
  return false;
};

UserSchema.methods.createPasswordResetToken = function() {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  console.log({ resetToken }, this.passwordResetToken);
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  return resetToken;
};

//création model
const User = mongoose.model("User", UserSchema);
module.exports = User;
