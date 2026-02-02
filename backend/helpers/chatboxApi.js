const waDaddyCredentials  = require("../model/chatbox/credentials");

const getApiSetup = async () => {
    const data = await waDaddyCredentials.findOne();
    return {
        phoneNumberId: data?.facebookAppId,
        chatboxChoneNumberId: data?.phoneNumberId,
        wabaId: data?.wbaId,
        token: data?.accessToken,
        baseUrl: 'https://graph.facebook.com',
        apiVersion: 'v23.0',
        registeredNumber: data?.registerdPhoneNumber,
        apikey: data?.apikey,
        chatboxUrl: 'https://api.chatbox.biz/v3',
    }
}


module.exports = {
    getApiSetup
}