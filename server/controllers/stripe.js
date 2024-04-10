const StripeSession = require('../models/stripe_session'); 

exports.saveStripeSession = async (session_id, email, amount) => {
  const session = new StripeSession({ session_id, email, amount });
  await session.save();
  return session;
}

exports.getStripeSessionsBySessionID = async (session_id) => {
    try {
      const sessions = await StripeSession.find({ session_id });
      return sessions;
    } catch (error) {
      console.error("Error retrieving Stripe sessions by session_id:", error);
      throw error;
    }
}

