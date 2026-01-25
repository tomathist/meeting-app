export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
  const { phone } = body;

  if (!phone) {
    return res.status(400).json({ error: "Missing phone number" });
  }

  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const serviceSid = process.env.TWILIO_VERIFY_SERVICE_SID;

  try {
    const response = await fetch(
      `https://verify.twilio.com/v2/Services/${serviceSid}/Verifications`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': 'Basic ' + Buffer.from(`${accountSid}:${authToken}`).toString('base64')
        },
        body: new URLSearchParams({
          To: `+82${phone.slice(1)}`,
          Channel: 'sms'
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return res.status(400).json({ error: data.message || 'SMS 발송 실패' });
    }

    return res.status(200).json({ success: true, status: data.status });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
