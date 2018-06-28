'use strict';

const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const {DATABASE_URL, PORT} = require('./config');
const apiRouter = require('./apiRouter');
const databaseUrl = DATABASE_URL;


const app = express();
app.use(morgan('common'));
app.use(express.json());
app.use('/posts', apiRouter);

let server;

function runServer(databaseUrl, port = PORT) {

	return new Promise((resolve, reject) => {
		mongoose.connect(databaseUrl, 
			err => {
					if(err) {
					return
				}
				
				server = app.listen(PORT, () => {
					console.log(`Your app is listening in on port ${PORT}`);
					resolve(server);
					})
				
				.on('error', err => {
					mongoose.disconnect();
					reject(err);
				});
			});
	});
}

function closeServer() {

	return mongoose.disconnect().then(() => {
		
		return new Promise((resolve, reject) => {
			console.log('Closing Server');
			server.close(err => {
				if(err) {
					reject(err);
					return
				}

				resolve();
			});
		});
	});
}

if(require.main === module) {
	runServer().catch(err => console.error(err));
}

module.exports = {app, runServer, closeServer}