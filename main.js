const path = require('path');
const fs = require('fs');
const Koa = require('koa');
const mount = require('koa-mount');
const cors = require('koa2-cors');
const static = require('koa-static');
const request = require('request');
const getPostData = require('koa-bodyparser');
const mongoDB = require('mongodb').MongoClient;


const mongoUrl = 'mongodb://127.0.0.1:27017';



const app = new Koa();
const gameLogic = new Koa();
const requestJZS = new Koa();
const mongoTest = new Koa();

app.use(cors());//设置跨域请求
app.use(getPostData());//设置post解析
app.use(static(path.join(__dirname + "/static/")))

app.use(
	mount('/favicon.ico', function (ctx) {
		ctx.status = 200;
	})
)

app.use(mount('/juzi', requestJZS))
requestJZS.use(
	async (ctx, next) => {
		await next();
		ctx.status = 200;
		ctx.body = {
			code: 200,
			message: "不玩了",
			data: {
				user: JSON.parse(ctx.jz)
			}
		}
	}
)
requestJZS.use(
	async (ctx, next) => {
		return new Promise((resolve, rejects) => {
			request('https://api.juzishu.com.cn/api/appNews/getIndexInfo.do?data=%7B"studentId"%3A"0"%2C"time_stamp"%3A"1606209388"%7D&partner=1000000&sign=796a57ab2549425204ff7719f457ee8a', async function (err, res, body) {
				ctx.jz = body;
				resolve()
			})
		})
	}
)

app.use(
	mount('/home', function (ctx) {
		ctx.body = fs.readFileSync(__dirname + '/index.html', 'utf-8');
	})
)
app.use(
	mount('/form', mongoTest)
)
mongoTest.use(
	async (ctx, next) => {
		ctx.client = new mongoDB(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
		await next();
		ctx.status = 200;
		ctx.body = {
			code: 200,
			message: "传输成功",
			data: {
				
			}
		}
	}
)
mongoTest.use(
	async (ctx, next) => {
		return new Promise((resolve, reject) => {
			ctx.client.connect(function (err, db) {
				if (err) throw err;
				var dbo = db.db("test");
				const {name, age} = ctx.request.body;
				var obj = {name: name, age: age};
				dbo.collection("stus").insertOne(obj, function (err, result) { // 返回集合中所有数据
					if (err) throw err;
					db.close();
					resolve();
				});
			});
		})
	}
)
var playerWinCount = 0;
app.use(
	mount('/game', gameLogic)
)
gameLogic.use(
	async function (ctx, next) {
		console.log(playerWinCount)
		if (playerWinCount >= 3) {
			ctx.status = 200;
			ctx.body = {
				code: 500,
				message: "不玩了",
				data: {
					user: "luojin"
				}
			}
			return;
		}
		next();
		if (ctx.play) {
			playerWinCount++;
		}
	}
)
gameLogic.use(
	async function (ctx) {
		const query = ctx.query;
		const userActive = query.userActive;
		var random = Math.random() * 3;
		var computerActive = "";

		if (random < 1) {
			computerActive = "rock"
		} else if (random > 2) {
			computerActive = "cloth"
		} else {
			computerActive = "scissor"
		}
		ctx.status = 200;
		if (userActive == computerActive) {
			ctx.body = {
				code: 200,
				message: "平局",
				data: {
					user: "luojin"
				}
			}
			return 0;
		} else if (
			(computerActive == "rock" && userActive == "cloth") ||
			(computerActive == "cloth" && userActive == "scissor") ||
			(computerActive == "scissor" && userActive == "rock")
		) {
			ctx.body = {
				code: 200,
				message: "你赢了",
				data: {
					user: "luojin"
				}
			}
			ctx.play = true;
			return +1;

		} else {
			ctx.body = {
				code: 200,
				message: "你输了",
				data: {
					user: "luojin"
				}
			}
			return -1;
		}
	}
)


app.listen(3000, '127.0.0.1')