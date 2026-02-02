const processHistory = require("../model/studentProcessHistory");


const addDeleteHistory = async ({
    studentId,
    event,
    value,
    userId,
    userName
}) => {
    await processHistory.updateOne(
        { studentId },
        {
            $push: {
                history: {
                    event,
                    value,
                    updatedBy: userId,
                    updatedByName: userName,
                    date: new Date(),   
                }
            }
        },
        {
            upsert: true
        }
    )
}

module.exports = addDeleteHistory;