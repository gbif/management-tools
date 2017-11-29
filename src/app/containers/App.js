var todoFilters = require('../constants/TodoFilters');
var todos = require('../todos/todos');

module.exports = {
  template: require('./App.html'),
  controller: App
};

function App() {
  this.todos = [todos.initialTodo];
  this.filter = todoFilters.SHOW_ALL;
}
