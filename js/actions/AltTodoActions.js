/* jshint esnext:true */
var alt = require('app/lib/alt');

var AltTodoActions = class AltTodoActions {
  constructor() {
    this.generateActions('create', 'updateText', 'toggleCompleteAll', 'destroy',
      'destroyCompleted');
  }

  toggleComplete(todo) {
    var id = todo.id;
    if (todo.complete) {
      this.dispatch({id: id, complete: false});
    } else {
      this.dispatch({id: id, complete: true});
    }
  }
};

module.exports = alt.createActions(AltTodoActions);
