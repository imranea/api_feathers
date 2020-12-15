const contacts = require('./contacts/contacts.service.js');
const messages = require('./messages/messages.service.js')
// eslint-disable-next-line no-unused-vars
module.exports = function (app) {
  app.configure(contacts);
  app.configure(messages);
};
