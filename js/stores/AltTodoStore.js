/* jshint esnext:true */
var alt = require('app/lib/alt');
var AltTodoActions = require('app/actions/AltTodoActions');

class AltTodoStore {
  constructor() {
    this.bindAction(AltTodoActions.create, this.onCreate);

    this.todos = {};
  }

  onCreate(text) {
    console.log('Alt: TodoStore.onCreate: ', text);
    var id = (+new Date() + Math.floor(Math.random() * 999999)).toString(36);
    this.todos[id] = {
      id: id,
      complete: false,
      text: text
    };
  }

  static getAll() {
    var { todos } = this.getState();
    return Object.keys(todos).map(function (todo) {
      return todos[todo];
    });
  }
}

module.exports = alt.createStore(AltTodoStore);
