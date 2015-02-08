var alt = require('app/lib/alt');

var AltTodoActions = function() {
  this.generateActions('create');
};

module.exports = alt.createActions(AltTodoActions);
