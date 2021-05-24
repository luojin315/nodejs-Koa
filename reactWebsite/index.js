const koa = require('koa');
const Router = require('koa-router')

const app = new koa();

let router = new Router()


// 中间件使用
router.get('/', (ctx) => {

    let url = ctx.url
    console.log(url);
    // 从上下文的request对象中获取
    let request = ctx.request
    let req_query = request.query
    let req_querystring = request.querystring

    // 从上下文中直接获取
    let ctx_query = ctx.query
    let ctx_querystring = ctx.querystring
    ctx.body = {
        url,
        req_query,
        req_querystring,
        ctx_query,
        ctx_querystring
    }

});

router.get('/site', (ctx) => {
    ctx.body = "hello word"

});
// 调用router.routes()来组装匹配好的路由，返回一个合并好的中间件
// 调用router.allowedMethods()获得一个中间件，当发送了不符合的请求时，会返回 `405 Method Not Allowed` 或 `501 Not Implemented`

app.use(router.routes());

app.use(router.allowedMethods({
    throw: true, // 抛出错误，代替设置响应头状态
    notImplemented: () => '不支持当前请求所需要的功能',
    methodNotAllowed: () => '不支持的请求方式'
}));


// 监听端口号
app.listen(4000, () => {
    console.log('4000端口启动')
})