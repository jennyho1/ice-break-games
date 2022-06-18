// [{
//   id: '',
//   username: '',
//   room: ''
// }]


class Users {
	constructor() {
	  this.users = [];
	}
  
	addUser(id, username, room) {
	  let user = {id, username, room};
	  this.users.push(user);
	  return user;
	}
  
	getUsers (room) {
	  let users = this.users.filter((user) => user.room === room);
	  let usernames = users.map((user) => user.username);
  
	  return users;
	}
  
	getUser(id) {
	  return this.users.filter((user) => user.id === id)[0];
	}
  
	removeUser(id) {
	  let user = this.getUser(id);
  
	  if(user){
		this.users = this.users.filter((user) => user.id !== id);
	  }
  
	  return user;
	}
  
  }
  
  module.exports = {Users};




// const mongoose = require('mongoose')

// const userSchema = new mongoose.Schema({
// 	firstName: String,
// 	lastName: String,
// 	username: String,
// 	email: String,
// 	password: String
// })

// module.exports = mongoose.model("User", userSchema)