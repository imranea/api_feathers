const { Service } = require('feathers-mongoose');

exports.Contacts = class Contacts extends Service {
    async find(params) {
       console.log(params)
       return Promise.resolve([])
    }
};
