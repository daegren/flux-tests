/* jshint esnext:true */
var alt = require('app/lib/alt');
var AltTodoActions = require('app/actions/AltTodoActions');

var assign = require('object-assign');

function _areAllComplete(todos) {
  return Object.keys(todos).reduce(function (memo, id) {
    return memo && todos[id].complete;
  }, true);
}

var AltTodoStore = alt.createStore(class AltTodoStore {
  constructor() {
    this.bindAction(AltTodoActions.create, this.onCreate);
    this.bindAction(AltTodoActions.updateText, this.onUpdateText);
    this.bindAction(AltTodoActions.toggleComplete, this.onToggleComplete);
    this.bindAction(AltTodoActions.toggleCompleteAll, this.onToggleCompleteAll);
    this.bindAction(AltTodoActions.destroy, this.onDestroy);

    this.todos = {};
  }

  onCreate(text) {
    text = text.trim();
    console.log('Alt: TodoStore.onCreate: ', text);
    if (!this._validText(text)) { return false; }
    var id = (+new Date() + Math.floor(Math.random() * 999999)).toString(36);
    this.todos[id] = {
      id: id,
      complete: false,
      text: text
    };
  }

  onUpdateText( { id, updatedText} ) {
    console.log('Alt: TodoStore.onUpdateText: ', id, updatedText);
    updatedText = updatedText.trim();
    if (!this._validText(updatedText)) { return false; }

    this._update(id, {text: updatedText});
  }

  onToggleComplete( { id, complete } ) {
    this._update(id, {complete: complete});
  }

  onToggleCompleteAll() {
    if (_areAllComplete(this.todos)) {
      this._updateAll({complete: false});
    } else {
      this._updateAll({complete: true});
    }
  }

  onDestroy(id) {
    console.log('Alt: TodoStore.onDestroy: ', id);
    delete this.todos[id];
  }

  _update(id, updates) {
    this.todos[id] = assign({}, this.todos[id], updates);
  }

  _updateAll(updates) {
    Object.keys(this.todos).forEach(function(id) {
      this._update(id, updates);
    }, this);
  }

  _validText(text) {
    return (text !== '');
  }

  _areAllComplete(todos) {
    Object.keys(todos).forEach(function(id) {
      if (!this.todos[id].complete) { return false; }
    });
    return true;
  }

  static getAll() {
    var { todos } = this.getState();
    return Object.keys(todos).map(function (todo) {
      return todos[todo];
    });
  }

  /**
   * Tests whether all the remaining TODO items are marked as completed.
   * @return {boolean}
   */
  static areAllComplete() {
    var { todos } = this.getState();
    return _areAllComplete(todos);
  }
});

module.exports = AltTodoStore;
