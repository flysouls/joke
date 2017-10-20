#! /usr/bin/env node

const readline = require('readline');
const request_ = require('axios');
const cheerio = require('cheerio');
const colors = require('colors');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: '想看笑话？请按回车> '
});
let request = request_.create({
    timeout: 20000,
    headers: {
        "Content-Type":"text/html;charset=UTF-8"
    }
})


let page = 1;

let jokeArr = [];
//存储笑话
function loadJokes() {
    if(jokeArr.length <= 3){
        request.get(`https://www.qiushibaike.com/text/page/${page}/`).then(r=>{
            console.log(`已获取第${page}页`);
            var $ = cheerio.load(r.data);
            var jokes = $("article a.text");
            jokes.each(function(item) {
                jokeArr.push($(this).text());
            });
            page++
        }).catch(err=>{
            console.log(err)
        })
    }
};
function output(str){
    let i = Math.random();
    if(i<0.5)
        console.log(str.green)
    else
        console.warn(str.red)
};
rl.prompt();
loadJokes();
rl.on('line', (line) => {
    if(jokeArr.length>0){
        console.log("=======================================================");
        // console.log(jokeArr.shift().green);
        output(jokeArr.shift())
        loadJokes();
    }else{
        console.log("正在加载中....".red)
    }
    rl.prompt();
}).on('close', () => {
    console.log('再见!');
    process.exit(0);
});