const waDaddyCredentials  = require("../model/waDaddy/credentials");

const getApiSetup = async () => {
    const data = await waDaddyCredentials.findOne();
    return {
        phoneNumberId: data?.phoneNumberId,
        wabaId: data?.wbaId,
        token: data?.accessToken,
        baseUrl: 'https://graph.facebook.com',
        apiVersion: 'v19.0',
        registeredNumber: data?.registerdPhoneNumber,
    }
}


module.exports = {
    getApiSetup
}