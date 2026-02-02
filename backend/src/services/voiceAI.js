const  { getVoiceAIConfig } = require("../services/configuration");



const BASE_URL = process.env.OMNIDIM_BASE_URL || "https://backend.omnidim.io/api/v1";
const API_KEY = process.env.OMNIDIM_API_KEY;
// const DEBUG = String(process.env.OMNIDIM_DEBUG || '').toLowerCase() === 'true';

// if (!API_KEY) {
  // Defer throwing to runtime usage to not crash import, but warn early
  // eslint-disable-next-line no-console
//   console.warn("OMNIDIM_API_KEY is not set. Voice AI requests will fail until it is configured.");
// }

async function request(path, { method = "GET", body, query } = {}) {
    const { OMNIDIM_BASE_URL, OMNIDIM_API_KEY } = await getVoiceAIConfig();

  const url = new URL(`${OMNIDIM_BASE_URL}${path}`);

  if (query) {
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        url.searchParams.set(key, String(value));
      }
    });
  }

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${OMNIDIM_API_KEY}`,
  };


  // if (DEBUG) {
  //   const debugHeaders = { ...headers, Authorization: headers.Authorization ? 'Bearer ***' : undefined };
  //   // eslint-disable-next-line no-console
  //   console.log('[OmniDim][request] →', {
  //     method,
  //     url: url.toString(),
  //     headers: debugHeaders,
  //     body,
  //   });
  // }

  const res = await fetch(url.toString(), {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const isJson = (res.headers.get("content-type") || "").includes("application/json");
  const payload = isJson ? await res.json().catch(() => ({})) : await res.text();

  if (!res.ok) {
    const err = new Error((payload && payload.message) || `HTTP ${res.status}`);
    err.status = res.status;
    err.details = payload && payload.errors ? payload.errors : payload;
    // if (DEBUG) {
    //   // eslint-disable-next-line no-console
    //   console.error('[OmniDim][request] ← ERROR', {
    //     status: res.status,
    //     payload,
    //   });
    // }
    throw err;
  }
  // if (DEBUG) {
  //   // eslint-disable-next-line no-console
  //   console.log('[OmniDim][request] ←', {
  //     status: res.status,
  //     payload,
  //   });
  // }
  return payload;
}

const dispatchCall = async (agentId, toNumber,fromNumberId, context = {}) => {

  // Validate and coerce types expected by API
  if (agentId === undefined || agentId === null || agentId === "") {
    const err = new Error('agentId is required');
    err.status = 400;
    throw err;
  }
  const numericAgentId = Number(agentId);
  if (!Number.isFinite(numericAgentId)) {
    const err = new Error('agentId must be a number or numeric string');
    err.status = 400;
    throw err;
  }

  if (typeof toNumber !== 'string' || !/^\+\d{6,15}$/.test(toNumber)) {
    const err = new Error('toNumber must be an E.164 phone string like +15551234567');
    err.status = 400;
    throw err;
  }

  const safeContext = (context && typeof context === 'object' && !Array.isArray(context)) ? context : {};

  let numericFromId;
  if (fromNumberId !== undefined && fromNumberId !== null && fromNumberId !== "") {
    numericFromId = Number(fromNumberId);
    if (!Number.isFinite(numericFromId)) {
      const err = new Error('fromNumberId must be a number or numeric string');
      err.status = 400;
      throw err;
    }
  }

  const payload = {
    agent_id: numericAgentId,
    to_number: toNumber,
    call_context: safeContext,
  };
  if (numericFromId !== undefined) payload.from_number_id = numericFromId;

  const result = await request("/calls/dispatch", { method: "POST", body: payload });
  if (DEBUG) {
    // eslint-disable-next-line no-console
    console.log('[OmniDim][dispatchCall] result', result);
  }
  return result;
};

const getCallLogs = async ({
  page = 1,
  page_size = 30,
  agent_id,
  call_status,
}) => {
  const query = { page, page_size };
  if (agent_id) query.agent_id = agent_id;
  if (call_status) query.call_status = call_status;

  return await request("/calls/logs", { method: "GET", query });
};



// ==============================
// Bulk Call APIs
// Docs: https://www.omnidim.io/docs/bulk-call
// ==============================

async function fetchBulkCalls( page = 1, page_size = 10, status ) {
  const query = { pageno: page, pagesize: page_size };
  if (status) query.status = status;
  return await request('/calls/bulk_call', { method: 'GET', query });  
}

async function createBulkCall(bulkCallData) {

  return await request('/calls/bulk_call/create', { method: 'POST', body: bulkCallData });
}

async function bulkCallActions({ bulk_call_id, action, new_scheduled_datetime, new_timezone }) {
  const body = { bulk_call_id, action };
  if (new_scheduled_datetime) body.new_scheduled_datetime = new_scheduled_datetime;
  if (new_timezone) body.new_timezone = new_timezone;
  return await request('/calls/bulk_call/actions', { method: 'POST', body });
}

async function cancelBulkCall({ bulk_call_id }) {
  return await request('/calls/bulk_call/cancel', { method: 'POST', body: { bulk_call_id } });
}

async function detailBulkCall({ bulk_call_id }) {
  return await request('/calls/bulk_call/detail', { method: 'GET', query: { bulk_call_id } });
}




module.exports = {
  dispatchCall,
  getCallLogs,
  // Bulk Call
  fetchBulkCalls,
  createBulkCall,
  bulkCallActions,
  cancelBulkCall,
  detailBulkCall,
};