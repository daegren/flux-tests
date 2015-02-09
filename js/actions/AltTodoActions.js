var alt = require('app/lib/alt');

var AltTodoActions = function() {
  this.generateActions('create', 'updateText');
};

module.exports = alt.createActions(AltTodoActions);
