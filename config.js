'use strict';

exports.DATABASE_URL = process.env.DATABASE_URL ||
					  	'mongodb://localhost/blog-mongoose-api';

exports.TEST_DATABAS_URL = process.env.TEST_DATABAS_URL ||
							'mongodb://localhost/blog-mongoose-api';

exports.PORT = process.env.PORT || 8080;