document.addEventListener('DOMContentLoaded', () => {
const width = 10
const grid = document.querySelector('.grid')
let squares = Array.from(document.querySelectorAll('.grid div'))
const scoreDisplay = document.querySelector('#score')
const startBtn = document.querySelector('#start-button')
let nextRandom = 0
let timerId
let score = 0

const lTetramino = [
    [1, width+1, width*2+1, 2],
    [width, width+1, width+2, width*2+2],
    [1, width+1, width*2+1, width*2],
    [width, width*2, width*2+1, width*2+2]
]
const zTetramino = [
    [width*2, width+1, width*2+1, width+2],
    [0, width, width+1, width*2+1],
    [width*2, width+1, width*2+1, width+2],
    [0, width, width+1, width*2+1]
]
const tTetramino = [
    [width, 1, width+1, width+2],
    [1, width+1, width*2+1, width+2],
    [width, width+1, width*2+1, width+2],
    [width, 1, width+1, width*2+1]
]
const oTetramino = [
    [0, 1, width, width+1],
    [0, 1, width, width+1],
    [0, 1, width, width+1],
    [0, 1, width, width+1]
]
const iTetramino = [
    [1, width+1, width*2+1, width*3+1],
    [width, width+1, width+2, width+3],
    [1, width+1, width*2+1, width*3+1],
    [width, width+1, width+2, width+3]
]
const osTetraminos = [lTetramino, zTetramino, tTetramino, oTetramino, iTetramino]

let currentPosition = 4
let currentRotation = 0

let random = Math.floor(Math.random()*osTetraminos.length)
let current = osTetraminos[random][0]

function draw() {
    current.forEach(index => {
        squares[currentPosition+index].classList.add('tetramino')
    })
}

function undraw() {
    current.forEach(index => {
        squares[currentPosition+index].classList.remove('tetramino')
    })
}


function control(e) {
    if(e.keyCode === 37){
        moveLeft()
    }
    if(e.keyCode === 38){
        rotate()
    }
    if(e.keyCode === 39){
        moveRight()
    }
    if(e.keyCode === 40){
        moveDown()
    }
}


function moveDown() {
    undraw()
    currentPosition += width
    draw()
    freeze()
}

function freeze(){
    if (current.some(index => squares[currentPosition+index+width].classList.contains('taken'))) {
        current.forEach(index => squares[currentPosition+index].classList.add('taken'))
        random = nextRandom
        nextRandom = Math.floor(Math.random()*osTetraminos.length)
        current = osTetraminos[random][0]
        currentPosition = 4
        currentRotation = 0
        draw()
        displayShape()
        addScore()
        gameOver()
    }
}

//fix here
function moveLeft(){
    undraw()
    const isAtLeftEdge = current.some(index => (currentPosition + index)%width === 0)
    if(!isAtLeftEdge){currentPosition-=1}
    if(current.some(index=>squares[currentPosition+index].classList.contains('taken'))){
        currentPosition +=1
    }
    draw()
}
function moveRight(){
    undraw()
    const isAtRightEdge = current.some(index => (currentPosition+index+1)%width === 0)
    if(!isAtRightEdge){currentPosition+=1}
    if(current.some(index=>squares[currentPosition+index].classList.contains('taken'))){
        currentPosition -=1
    }
    draw()
}
function rotate(){
    undraw()
    if(currentRotation<3){currentRotation++}else{currentRotation=0}
    current = osTetraminos[random][currentRotation]
    draw()
}
//end fix here

const displaySquares = document.querySelectorAll('.minigrid div')
const displayWidth = 4
let displayIndex = 0

const upNextTetraminos = [
    [1, displayWidth+1, displayWidth*2+1, 2], //L
    [0, displayWidth, displayWidth+1, displayWidth*2+1], //Z
    [1, displayWidth, displayWidth+1, displayWidth+2], //T
    [0, 1, displayWidth, displayWidth+1], //O
    [1, displayWidth+1, displayWidth*2+1, displayWidth*3+1] //I
]

function displayShape(){
    displaySquares.forEach(square=>{
        square.classList.remove('tetramino')
    })
    upNextTetraminos[nextRandom].forEach(index => {
        displaySquares[displayIndex+index].classList.add('tetramino')
    })
}

startBtn.addEventListener('click', ()=>{
    if (timerId) {
        clearInterval(timerId)
        timerId = null
        
    } else{
        if(startBtn.innerHTML==='Try Again!'){
            squares.forEach(index => {
                index.classList.remove('tetramino')
                index.classList.remove('taken')})
        }
        startBtn.innerHTML = 'Start/Pause'
        draw()
        document.addEventListener('keyup', control)
        timerId = setInterval(moveDown, 500)
        nextRandom = Math.floor(Math.random()*osTetraminos.length)
        displayShape()
        scoreDisplay.innerHTML = 'Score: 0'
    }
})

//Score Counter
function addScore(){
    for (let i=0;i<199;i+=width){
        const row = [i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9]
        if(row.every(index=>squares[index].classList.contains('taken'))){
            score += 10
            scoreDisplay.innerHTML = 'Score: '+score
            row.forEach(index=>{
                squares[index].classList.remove('taken')
                squares[index].classList.remove('tetramino')
            })
            const squaresRemoved = squares.splice(i, width)
            squares = squaresRemoved.concat(squares)
            squares.forEach(cell=> grid.appendChild(cell))
        }
    }
}

//game over
function gameOver(){
    if(current.some(index=>squares[currentPosition+index].classList.contains('taken'))){
        scoreDisplay.innerHTML = 'The ending score was: ' + score
        clearInterval(timerId)
        document.removeEventListener('keyup', control)
        startBtn.innerHTML = 'Try Again!'
    }
}








})