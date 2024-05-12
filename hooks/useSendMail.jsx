import { useState } from 'react';

const useSendMail = (accessToken) => {
  const [recipient, setRecipient] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');

  const sendMail = () => {
    // Construct the email message

    if (!recipient || !subject || !body) {
      console.error('Recipient, subject, and body cannot be empty');
      return;
    }
    const senderId = "hiruthikarajkumar27@gmail.com";

    const email = {
      raw: btoa(
        `From: ${senderId}\n` +
        `To: ${recipient}\n `+
        `Subject: ${subject}\n\n` +
        `${body}`
      )
    };

    console.log('hook recipient',recipient);
    console.log('hook subject',subject);
    // Set up request headers
    const headers = {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    };

    // Make a POST request to the Gmail API endpoint for sending emails
    fetch(`https://gmail.googleapis.com/gmail/v1/users/me/messages/send`, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(email)
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to send email');
        }
        return response.json();
      })
      .then(data => {
        console.log('Email sent:', data);
        // Optionally, reset the state variables for recipient, subject, and body
        setRecipient('');
        setSubject('');
        setBody('');
      })
      .catch(error => {
        console.error('Error sending email:', error);
      });
  };

  return { recipient, setRecipient, subject, setSubject, body, setBody, sendMail };
};

export default useSendMail;