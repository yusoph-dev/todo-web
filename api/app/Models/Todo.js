'use strict';
const Model = use('Model')

// const Lucid = use('Lucid');

class Todo extends Model{

  static useTimestamps = true;

  static get primaryKey() {
    return 'id'; 
  }

}

module.exports = Todo;
