'use strict';

const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const {Blog} = require('./models');
const {DATABASE_URL, PORT} = require('./config');
// const apiRouter = require('./apiRouter');


const app = express();

app.use(morgan('common'));
app.use(express.json());
// app.use('/posts', apiRouter);

app.get('/posts', (req,res) => {
	console.log("about to find");
	Blog
	.find()
	.then(posts => {
		console.log('after find')
		res.json(posts.map(post => post.serialize()));
	})
	.catch(err => {
		console.error(err);
		res.status(500).json({message: `${ISE}`});
	});
});

app.get('/posts/:id', (req, res) => {
	Blog.findById(req.params.id)
	.then(post => res.json(post.serialize()))
	.catch(err => {
		console.error(err);
		res.status(500).json({message: `${ISE}`});
	});
});

app.post('/posts', (req,res) => {
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

app.put('/posts/:id', (req, res) => {
	
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


app.delete('/posts/:id', (req, res) => {
	Blog.findByIdAndRemove(req.params.id)
		.then(() => console.log(`Deleted post with id ${req.params.id}`))
		.then(blog => res.status(204).end())
		.catch(err => res.status(500).json({message: `${ISE}`}));
});



// let server;

// function runServer(databaseUrl, port = PORT) {

// 	return new Promise((resolve, reject) => {
// 		mongoose.connect(databaseUrl, 
// 			err => {
// 					if(err) {
// 					return
// 				}
				
// 				server = app.listen(PORT, () => {
// 					console.log(`Your app is listening in on port ${PORT}`);
// 					resolve(server);
// 					})
				
// 				.on('error', err => {
// 					mongoose.disconnect();
// 					reject(err);
// 				});
// 			});
// 	});
// }

// function closeServer() {

// 	return mongoose.disconnect().then(() => {
		
// 		return new Promise((resolve, reject) => {
// 			console.log('Closing Server');
// 			server.close(err => {
// 				if(err) {
// 					reject(err);
// 					return
// 				}

// 				resolve();
// 			});
// 		});
// 	});
// }

// if(require.main === module) {
// 	runServer().catch(err => console.error(err));
// }

// module.exports = {app, runServer, closeServer}

let server;

// this function connects to our database, then starts the server
function runServer(databaseUrl, port = PORT) {
  return new Promise((resolve, reject) => {
    mongoose.connect(databaseUrl, err => {
      if (err) {
        return reject(err);
      }
      server = app.listen(port, () => {
        console.log(`Your app is listening on port ${port}`);
        resolve();
      })
        .on('error', err => {
          mongoose.disconnect();
          reject(err);
        });
    });
  });
}

// this function closes the server, and returns a promise. we'll
// use it in our integration tests later.
function closeServer() {
  return mongoose.disconnect().then(() => {
    return new Promise((resolve, reject) => {
      console.log('Closing server');
      server.close(err => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
  });
}

// if server.js is called directly (aka, with `node server.js`), this block
// runs. but we also export the runServer command so other code (for instance, test code) can start the server as needed.
if (require.main === module) {
  runServer(DATABASE_URL).catch(err => console.error(err));
}

module.exports = { runServer, app, closeServer };