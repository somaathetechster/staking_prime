import axios from 'axios';

const TATUM_API_KEY = process.env.TATUM_API_KEY;
const TATUM_URL = 'https://api.tatum.io/v3';

export const generateUserWallet = async (userId, currency) => {
  try {
    // 1. Generate an Extended Public Key (xPub) or Address
    // Note: For a "Private Desk," we usually generate a new address from 
    // a pre-configured virtual account in Tatum to simplify tracking.
    
    const response = await axios.post(`${TATUM_URL}/ledger/account`, {
      currency: currency, // e.g., 'BTC', 'ETH', 'USDT_TRON'
      customer: {
        externalId: userId // Link directly to your DB User ID
      },
      accountingCurrency: 'USD'
    }, {
      headers: { 'x-api-key': TATUM_API_KEY }
    });

    // 2. Generate the actual deposit address for this account
    const addressResponse = await axios.post(`${TATUM_URL}/offchain/account/${response.data.id}/address`, {}, {
      headers: { 'x-api-key': TATUM_API_KEY }
    });

    return {
      tatumAccountId: response.data.id,
      address: addressResponse.data.address
    };
  } catch (error) {
    console.error("Wallet Generation Failed:", error.response?.data || error.message);
    throw new Error("Could not initialize secure wallet.");
  }
};