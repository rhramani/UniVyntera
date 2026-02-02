const { getVoiceAIConfig } = require("../services/configuration");

let singletonClient = null;

async function getOmniClient() {
  if (singletonClient) return singletonClient;

  const { OMNIDIM_API_KEY } = await getVoiceAIConfig();

  if (!OMNIDIM_API_KEY) {
    throw new Error("OMNIDIM_API_KEY missing in configuration table");
  }

  singletonClient = new Client({ apiKey: OMNIDIM_API_KEY });
  return singletonClient;
}

module.exports = { getOmniClient, APIError };
