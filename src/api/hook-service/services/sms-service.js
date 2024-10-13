'use strict';
const axios = require('axios');

/**
 * hook-service service
 */

module.exports = {
  async customFunction() {
    // Your custom logic goes here
    const result = 'This is data from the service!';
    return result;
  },
  async sendMessage(userId, message) {

    try {
      const response = await axios.post(
        'https://api.line.me/v2/bot/message/push',
        {
          to: userId,
          messages: [
            {
              type: 'text',
              text: message
            }
          ]
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.LINE_MSG_API_CHANNEL_ACCESS_TOKEN}`,
            'Content-Type': 'application/json'
          }
        }
      );
      console.log('Message sent:', response.data);
      return "OK"
    } catch (error) {
      console.error('Error sending message:', error.response.data);
      console.log(error.response);
    }
  },
};