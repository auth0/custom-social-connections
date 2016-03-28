var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter  = require('events').EventEmitter;
var Constants     = require('../constants/Constants');
var assign        = require('object-assign');
var client        = require('../apiClient').connections;

var CHANGE_EVENT  = 'change';
var ERROR_EVENT   = 'error';

var ClientsStore  = require('./ClientsStore');

var ConnectionsStore = assign({}, EventEmitter.prototype, {
  getAll: function() {
    client.getAll()
      .then(function (connections) {
        this.emit(CHANGE_EVENT, connections);
      }.bind(this))
      .fail(function () {
        this.emit(ERROR_EVENT);
      }.bind(this));
  },

  create: function (connection) {
    return client.create(connection)
      .then(function (connection) {
        this.getAll();
        ClientsStore.getAll();
        return connection;
      }.bind(this));
  },

  update: function (id, connection) {
    return client.update(id, connection)
      .then(function (connection) {
        this.getAll();
        return connection;
      }.bind(this));
  },

  remove: function (id, connection) {
    return client.remove(id)
      .then(function (connection) {
        this.getAll();
        return connection;
      }.bind(this));
  },

  share: function (body) {
    return client.share(body);
  },

  emitChange: function() {
    this.emit(CHANGE_EVENT);
  },

  /**
   * @param {function} callback
   */
  addChangeListener: function(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  /**
   * @param {function} callback
   */
  removeChangeListener: function(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },

  /**
   * @param {function} callback
   */
  addErrorListener: function(callback) {
    this.on(ERROR_EVENT, callback);
  },

  /**
   * @param {function} callback
   */
  removeErrorListener: function(callback) {
    this.removeListener(ERROR_EVENT, callback);
  }
});

AppDispatcher.register(function(action) {
  switch(action.actionType) {
    case Constants.CONNECTION_GET_ALL:
      ConnectionsStore.emitChange();
      break;

    default:
      // no op
  }
});

ConnectionsStore.setMaxListeners(20);

module.exports = ConnectionsStore;
