const { getOmniClient, APIError } = require('./voiceAIClient');

async function dispatchCall({ agentId, toNumber, fromNumberId, callContext }) {
  const client = getOmniClient();

  if (!toNumber || !/^\+\d{6,15}$/.test(toNumber)) {
    const error = new Error('Invalid toNumber. Expect E.164 format like +15551234567');
    error.status = 400;
    throw error;
  }

  if (!agentId) {
    const error = new Error('agentId is required');
    error.status = 400;
    throw error;
  }

  try {
    const response = await client.call.dispatch({
      agentId,
      toNumber,
      fromNumberId,
      callContext: callContext || {},
    });
    return response;
  } catch (err) {
    if (err instanceof APIError) {
      const apiErr = new Error(err.message);
      apiErr.status = err.statusCode || 502;
      apiErr.details = err.details;
      throw apiErr;
    }
    throw err;
  }
}

async function getCallLogs({ page = 1, pageSize = 30, agentId, callStatus }) {
  const client = getOmniClient();
  try {
    const logs = await client.call.logs({ page, pageSize, agentId, callStatus });
    return logs;
  } catch (err) {
    if (err instanceof APIError) {
      const apiErr = new Error(err.message);
      apiErr.status = err.statusCode || 502;
      apiErr.details = err.details;
      throw apiErr;
    }
    throw err;
  }
}

module.exports = { dispatchCall, getCallLogs };


