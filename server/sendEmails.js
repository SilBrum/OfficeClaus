require('dotenv').config();
const nodemailer = require('nodemailer');
const { google } = require('googleapis');

// Load environment variables
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
const EMAIL_ADDRESS = process.env.EMAIL_ADDRESS;

const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

const sendEmail = async (pairings, clientAccessToken) => {
  try {
    // Set the access token received from the client
    oAuth2Client.setCredentials({ access_token: clientAccessToken });

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: EMAIL_ADDRESS, // Use email from the environment variables
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        accessToken: clientAccessToken, // Use the client-provided access token
      },
    });

    for (const pair of pairings) {
      const mailOptions = {
        from: `"Secret Santa App" <${EMAIL_ADDRESS}>`, // Use email from environment variables
        to: pair.email, // Recipient's email
        subject: '🎅 Your Secret Santa Pairing 🎁',
        html: `
          <h1>Hi ${pair.giver},</h1>
          <p>You're the Secret Santa for <strong>${pair.receiver}</strong>!</p>
          <p>Happy gifting! 🎉</p>
        `,
      };

      // Send the email
      await transporter.sendMail(mailOptions);
    }

    console.log('Emails sent successfully!');
  } catch (error) {
    console.error('Failed to send emails:', error);
    throw new Error('Failed to send emails');
  }
};

module.exports = { sendEmail };
