/**
 * My app
 *
 */
const package = require('./package.json')
var texts = require('./translations.json')
const express = require('express')
var ip = require("ip")
const app = express()
const PORT = 3000;

const ONSTART = 0
const ONSTOP = 2
const INGAME = 4
const GAMEOVER = 5
const GAMEFINISHED = 6
const MAXHINTS = 3
const MAXTOP = 12

var gameStatus = ONSTART
var startedAt = 0
var hint = [0, 0]
texts[0].version += package.version
texts[1].version += package.version

app.set('view engine', 'pug')
app.use(express.static('public'))

app.get('/', (req, res) => {
    let text = texts[0]
    res.render('index', text) 
})


app.get('/getmyip', (req, res) => {
    var result = { ip: ip.address(), port: PORT }
    res.send(JSON.stringify(result))
})

app.get('/givehint/:player', (req, res) => {
    let p = req.params.player
    hint[p]++
    res.send(JSON.stringify({ result: 'success' }))
})

app.get('/start', (req, res) => {
    gameStarted()
    var response = 'Started at: ' + startedAt
    //console.log(response)
    res.send(response)
})

app.get('/stop/:player', (req, res) => {
    var d = new Date()
    var time = d.getTime() - startedAt
    var response = 'Your time: ' + time + '  in readable: ' + getReadable(time)
    res.send(response)
})

app.get('/getgamedata', (req, res) => {
    var d = new Date()
    var time;
    if (gameStatus == ONSTART) {
        time = 0
    } else if (gameStatus == INGAME) {
        time = d.getTime() - startedAt
    } else if (gameStatus == GAMEOVER || gameStatus == GAMEFINISHED) {
        time = stoppedAt - startedAt
    }
    //TEST
    //time = 999999;
    //gameStatus = GAMEFINISHED;
    var response = {
        time: getReadable(time),
        ms: time,
        hint1: hint[0],
        hint2: hint[1],
        status: gameStatus
    }
    res.send(JSON.stringify(response))
})

app.get('/:lang', (req, res) => {
    let l = req.params.lang
    let i = 0;
    if (l == 'hu') {
        i = 0
    } else if(l=='en'){
        i = 1
    }
    let text = texts[i]
    res.render('index', text)
})


app.listen(PORT, () => console.log('Server listening on port ' + PORT + '!'))


/**
 * 
 * HELPER FUNCTIONS
 * 
 */


function getHHHHMMDDfromTimestamp(date) {
    var d = new Date(date)
    var dd = d.getDate();
    var mm = d.getMonth() + 1;
    var yyyy = d.getFullYear();
    if (dd < 10) {
        dd = '0' + dd;
    }
    if (mm < 10) {
        mm = '0' + mm;
    }
    return yyyy + '/' + mm + '/' + dd;
}

function gameStarted() {
    var d = new Date()
    gameStatus = INGAME
    hint = [0,0]
    startedAt = d.getTime()
}

function getReadable(time) {
    var t = new Date(time)
    return two(t.getMinutes()) + ':' + two(t.getSeconds()) + ':' + two(t.getMilliseconds())
}

function two(n) {
    var s = n + ''
    if (s.length == 1) {
        return '0' + s
    }
    if (s.length == 2) {
        return s
    }
    if (s.length > 2) {
        return s.substr(0, 2)
    }
}


