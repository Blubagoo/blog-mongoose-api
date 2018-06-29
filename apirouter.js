const express = require('express');
const router = express.Router();

const {Blog} = require('./models');

const ISE = "Internal Server Error";


router.get('/', (req,res) => {
	Blog
	.find()
	.then(blogs => {
		res.json(blogs.map(blog => blogs.serialize()));
	})
	.catch(err => {
		console.error(err);
		res.status(500).json({message: `${ISE}`});
	});
});

router.get('/:id', (req, res) => {
	Blog.findById(req.params.id)
	.then(restauran = res.json(restaurant.serialize()))
	.catch(err => {
		console.error(err);
		res.status(500).json({message: `${ISE}`});
	});
});

router.post('/', (req,res) => {
	const requiredFields = ['title', 'content', 'author'];

	for(let i=0; i<requiredFields.length; i++) {
		const field = requiredFields[i]

		if(!(field in req.body)) {
			const message = `Missing ${field} in request body`;
			console.error(message);

			return res.status(400).send(message);
		}
	}

	Blog.create({
		title: req.body.title,
		content: req.body.content,
		author: {
			firstName: req.body.author.split(/\s/)[0],
			lastName: req.body.author.split(/\s/)[1]
		}
	})
	.then(blog => res.status(201).json(blog.serialize()))
	.catch(err => {
		console.error(err);
		res.status(500).json({message: `${ISE}`});
	});
});

router.put('/:id', (req, res) => {
	
	if(!(req.params.id === req.body.id)) {
		const message = `Parameter id ${req.params.id} must match request body id ${req.body.id}`;
		console.error(message);
		
		return res.status(400).json({message: message});
	}

	const toUpdate = {};
	const updateableFields = ['title', 'content', 'author'];

	updateableFields.forEach(field => {

		if(field in req.body) {
			toUpdate[field] = req.body[field];
		}
	});

	Blog
	.findByIdAndUpdate(req.params.id, {$set: toUpdate})
	.then(blog => res.status(204).end())
	.catch(err => res.status(500).json({message: `${ISE}`}));
});


router.delete('/:id', (req, res) => {
	Blog.findByIdAndRemove(req.params.id)
		.then(() => console.log(`Deleted post with id ${req.params.id}`))
		.then(blog => res.status(204).end())
		.catch(err => res.status(500).json({message: `${ISE}`}));
});

module.exports = router;