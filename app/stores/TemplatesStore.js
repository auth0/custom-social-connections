var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter  = require('events').EventEmitter;
var Constants     = require('../constants/Constants');
var assign        = require('object-assign');
var client        = require('../apiClient').templates;

var CHANGE_EVENT = 'change';

var TemplatesStore = assign({}, EventEmitter.prototype, {
  getAll: function() {
    return client.getAll();
    // this.emit(CHANGE_EVENT, window.templates);
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
  }
});

AppDispatcher.register(function(action) {
  switch(action.actionType) {
    case Constants.TEMPLATES_GET_ALL:
      TemplateStore.emitChange();
      break;

    default:
      // no op
  }
});

module.exports = TemplatesStore;
