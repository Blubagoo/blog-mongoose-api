'use strict';

const mongoose = require('mongoose');

const blogSchema = mongoose.Schema({
	"title": {type: String, required: true},
	"content": {type: String, require: true},
	"author": {
		firstName: {type: String, required: true},
		lastName: String
	} 
});

blogSchema.methods.serialize = function() {

	return{
		id: this._id,
		title: this.title,
		content: this.content,
		author: `${this.author.firstName}${this.author.lastName}`
	};
}


const Blog = mongoose.model('Blog', blogSchema);

module.exports = {Blog};