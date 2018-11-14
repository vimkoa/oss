#!/usr/bin/env node

let OSS = require('ali-oss');
let path = require('path');
let fs = require('fs');
let program = require('commander');
let config = require('/etc/oss/config.json');

program.version('1.0.0', '-v, --version');

let client = OSS({
	accessKeyId: config.accessKeyId,
	accessKeySecret: config.accessKeySecret,
	bucket: config.bucket,
	region: config.region
});

program.command('put [path]')
	.description('Put a local file.')
	.action(function(path, options) {
		put(path);
	});

async function put(localPath) {
	if (!fs.existsSync(localPath)) {
		console.error('No such file or directory: ' + localPath);
		return;
	}

	let year = (new Date()).getFullYear();
	let name = path.basename(localPath);
	let object = year + '/' + name;

	try {
		let result = await client.put(object, localPath);
		console.log('http://' + config.domain + '/' + result.name);
	} catch(error) {
		console.error(error.message);
	}
}

program.parse(process.argv);

