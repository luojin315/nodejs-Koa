const fs = require('fs');
const Koa = require('koa');
const mount = require('koa-mount');
const cors = require('koa-cors');
const app = new Koa();
app.use(cors());//设置跨域请求
app.use(
	mount('/test', function (ctx) {
		ctx.body = {
			resultCode:200,
			data: {
				text: "22",
				test: ''
			}
		}
	})
)
app.use(
	mount('/s', async function (ctx, next) {
		// ctx.body = fs.createReadStream(__dirname + '/index.html');
		await next();
		ctx.body = 'hello'
	})
)

app.use(
	function(req , res, next) {
		setTimeout(() => {
			console.log(1000)
		}, 500)
	}
);
app.use(
	mount('/game', function (ctx) {
		// ctx.body = fs.createReadStream(__dirname + '/index.html');
		ctx.body = 'hello'
	})
)
app.listen(3000, '127.0.0.1')