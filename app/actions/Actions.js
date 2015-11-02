var AppDispatcher = require('../dispatcher/AppDispatcher');
var Constants     = require('../constants/Constants');

var Actions = {
  createConnection: function (Connection) {
    AppDispatcher.dispatch({
      actionType: Constants.CONNECTION_CREATE,
      Connection: Connection
    });
  }
};

module.exports = Actions;
