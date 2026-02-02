const crypto = require("crypto");

const generateOTP = (length = 6) => {
    return crypto.randomInt(100000, 999999).toString();
}

const storeOTP = async (email, model) => {
    const otp = generateOTP();
    const expiry = new Date(Date.now() + 5 * 60 * 1000); // 5 min

    await model.findOneAndUpdate(
        { email },
        { otp, otpExpires: expiry },
        { new: true}
    );

    return otp;
}

const verifyOTP = async (email , enteredOTP , model) => {
    const user = await model.findOne({ email });
    if(!user) {
        throw { status: false, message: "User not found"}
    }
    if(user.otp !== enteredOTP){
        throw { status: false, message: "Invalid OTP"}
    }
    if(user.otpExpires < new Date()){
        throw { status: false, message: "OTP expired"}
    }

    await model.updateOne({ email } , { $unset: { otp:1, otpExpires: 1} });

    return user;
}
    
module.exports = { generateOTP, storeOTP, verifyOTP };