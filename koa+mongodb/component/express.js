const http = require('http');
const url = require('url');
const fs = require('fs');
const queryString = require('querystring');
const path = require('path');
const express = require('express');
const gameJs = require('./component/event');

const app = express();

app.use(express.static(path.join(__dirname, 'static')));

app.all("*", function (req, res, next) {
	//设置允许跨域的域名，*代表允许任意域名跨域
	res.header("Access-Control-Allow-Origin", req.headers.origin || '*');
	// //允许的header类型
	res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");
	// //跨域允许的请求方式 
	res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
	// 可以带cookies
	res.header("Access-Control-Allow-Credentials", true);
	if (req.method == 'OPTIONS') {
		res.sendStatus(200);
	} else {
		next();
	}
})

app.get('/', function (req, res) {
	res.writeHead(200);
	fs.createReadStream(__dirname + '/index.html').pipe(res);
})
let num = 0;
app.get('/game',function (req, res, next) {

	if (num >= 3) {
		res.writeHead(500);
		return;
	}
		const parseUrl = url.parse(req.url);
		let query = queryString.decode(parseUrl.query);
		let result = gameJs(query.userActive);
		res.userAcitve = result;
	
	next();

}, function (req, res) {
	let result = res.userAcitve;
	console.log(result);
	if (result == 0) {
		res.send('平局');
	} else if (result == -1) {
		res.send('输');
	} else {
		num++;
		res.send('你赢了');
	}
})

app.listen(3000, '127.0.0.1', function () {
	var host = this.address().address;
	var port = this.address().port;
	console.log(host, port);
})