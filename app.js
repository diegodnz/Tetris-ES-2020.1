document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.grid')
    let squares = Array.from(document.querySelectorAll('.grid div'))
    let nextSquares = Array.from(document.querySelectorAll('.next-piece-grid div'))
    const gameScore = document.querySelector('#score')
    const gameOverMsg = document.querySelector('#gameover')
    const startBt = document.querySelector('#start-button')
    const restartBt = document.querySelector('#restart-button')
    
    const colors = [
        "blue",
        "green",
        "yellow",
        "orange",
        "puple",
        "black",
        "gray"
    ]
    const height = 10
    
    const iShape = drawIShape(height)
    const zShape = drawZShape(height)
    const lShape = drawLShape(height)
    const strangeShape = drawStrangeShape(height)
    const squareShape = drawSquareShape(height)

    function drawIShape(height) {
        return [
            [0, height, height*2, height*3], 
            [0, -1, 1, 2],  
            [0, height, height*2, height*3] ,
            [height, height-1, height+1, height+2]        
        ]
    }

    function drawZShape(height) {
        return [
            [0, +1, -height, height+1],
            [0, +1, height, height-1],
            [0, +1, -height, height+1],
            [0, +1, height, height-1]
        ]
    }

    function drawLShape(height) {
        return [
            [0, -height, height, height+1],
            [0, 1, -1, height-1],
            [0, height, -height, -height-1],
            [0, -1, +1, -height+1]
        ]
    }

    function drawStrangeShape(height) {
        return [
            [0, -height, -1, 1],
            [0, -height, height, 1],
            [0, 1, -1, height],
            [0, -height, height, -1]
        ]
    }

    function drawSquareShape(height) {
        return [
            [0, 1, height, height+1],
            [0, 1, height, height+1],
            [0, 1, height, height+1],
            [0, 1, height, height+1]
        ]
    }

    let pieces = [iShape, zShape, lShape, strangeShape, squareShape]
    let currentPos
    let currentRotation
    let currentShape
    let currentPiece 
    let nextShape
    let timerId
    let score = 0
    let gameOver = false
    let started = null

    function nextPiece() {        
        currentShape = nextShape
        nextShape = Math.floor(Math.random() * pieces.length)
        displayNext()
        return pieces[currentShape][0]
    }

    function drawGrids() {
        for (let i=0; i<squares.length; i++) {  
            if (squares[i].classList.contains("noPiece")) {
                squares[i].classList.remove("piece")    
                squares[i].classList.remove("freeze")  
            } else {                       
                squares[i].classList.add("noPiece")     
            }       
        }      
    }

    function undrawPiece() {
        for (index of currentPiece) {
            if (currentPos+index > 0) {
                squares[currentPos + index].classList.remove("piece")
            }
        }
    }

    function freezePiece() {
        for (index of currentPiece) {
            if (currentPos+index > 0) {                
                squares[currentPos + index].classList.add("freeze")                
            }
        }
        updatePiece()
    }

    function drawPiece() {
        let frozenPiece = false
        for (index of currentPiece) {
            if (currentPos+index > 0) {
                if (squares[currentPos + index].classList.contains("freeze")) {
                    freezePiece()                    
                    frozenPiece = true
                } else {
                    squares[currentPos + index].classList.add("piece")
                }
            }
            if (frozenPiece) {
                break
            }
        }        
    }

    function displayNext() {
        nextSquares.forEach(square => square.classList.remove("piece"))
        let piece
        if (nextShape === 0) {
            piece = drawIShape(4)[0]
        } else if (nextShape === 1) {
            piece = drawZShape(4)[0]
        } else if (nextShape === 2) {
            piece = drawLShape(4)[0]
        } else if (nextShape === 3) {
            piece = drawStrangeShape(4)[0]
        } else {
            piece = drawSquareShape(4)[0]
        }        
        piece.forEach(index => nextSquares[index+5].classList.add("piece"))
    }

    function updatePiece() {
        currentPos = 4
        currentPiece = nextPiece()        
    }

    function stop() {
        for (index of currentPiece) {
            if (index+currentPos+height > 199 || squares[index+currentPos+height].classList.contains("freeze")) {   
                freezePiece()       
                break
            }                       
        }
    }

    function chkGameOver() {
        if (squares[4].classList.contains("freeze")) {         
            clearInterval(timerId)
            timerId = null
            gameOverMsg.innerHTML = "Game Over!!"
            score = 0
            return true
        }
        return false
    }

    function addScore() {
        for (let i=0; i<200; i+=10) {
            complete = true
            for (let j=i; j<i+10; j++) {
                if (!squares[j].classList.contains("freeze")) {
                    complete = false
                    break
                }
            }
            if (complete) {
                score += 10
                gameScore.innerHTML = score
                removedSquares = squares.splice(i, 10)
                removedSquares.forEach(element => {
                    element.classList.remove("piece")    
                    element.classList.remove("freeze")  
                })
                squares = removedSquares.concat(squares)
                squares.forEach(cell => grid.appendChild(cell))
            }
        }
    }

    function moveDown() {     
        stop()        
        undrawPiece()
        currentPos += height
        drawPiece()        
        gameOver = chkGameOver() 
        addScore()
    }

    function moveLeft() {      
        let atLimit = false
        let pieceOnLeft = false
        for (index of currentPiece) {
            if ((currentPos+index) % height === 0) {
                atLimit = true
                break
            } else if ((currentPos+index) > 0 && squares[currentPos+index-1].classList.contains("freeze")) {
                pieceOnLeft = true
                break
            }
        }
        if (!atLimit && !pieceOnLeft) {
            undrawPiece()
            currentPos -= 1
            drawPiece()
        }
    }

    function moveRight() {       
        let atLimit = false
        let pieceOnRight = false
        for (index of currentPiece) {
            if ((currentPos+index+1) % height === 0) {                
                atLimit = true
                break
            } else if ((currentPos+index) > 0 && squares[currentPos+index+1].classList.contains("freeze")) {
                pieceOnRight = true
                break
            }
        }
        if (!atLimit && !pieceOnRight) {
            undrawPiece()
            currentPos += 1
            drawPiece()
        }         
    }

    function tryRotation() {
        if (currentPos % height < 1) {
            undrawPiece()
            currentPos += 1
            drawPiece()
            tryRotation()
        } else if (currentPos % height > height-3) {
            undrawPiece()
            currentPos -= 1
            drawPiece()
            tryRotation()
        }
    }

    function rotate() {        
        if (currentRotation < 3) {
            currentRotation++
        } else {
            currentRotation = 0
        }      

        for (let i=0; i<3; i++) {
            tryRotation(i)
        }            
        tryRotation()  
        undrawPiece()      
        currentPiece = pieces[currentShape][currentRotation]
        drawPiece()
    }

    function control(e) { 
        if (!gameOver && started) {
            if (e.keyCode === 37) {                        
                moveLeft()       
            } else if (e.keyCode === 38) {
                rotate()           
            } else if (e.keyCode === 39) {     
                moveRight()       
            }
        }
    }        

    function goDown(e) {
        if (!gameOver && started) {      
            if (e.keyCode === 40) {
                moveDown()
            }
        }
    }

    function startAndPause() {     
        if (gameOver || started === null) {
            if (gameOver) {
                drawGrids()
            }
            gameOver = false        
            score = 0    
            gameScore.innerHTML = score
            gameOverMsg.innerHTML = ''
            nextShape = Math.floor(Math.random() * pieces.length)            
            currentPos = 4
            currentRotation = 0
            currentShape
            currentPiece = nextPiece()   
            clearInterval(timerId)             
            timerId = setInterval(moveDown, 700)
            started = true
        } else if (started === true) {
            started = false
            clearInterval(timerId)
        } else {
            started = true
            timerId = setInterval(moveDown, 700)
        }        
    }

    function restartGame() {
        drawGrids()
        gameOver = false      
        score = 0      
        gameScore.innerHTML = score
        gameOverMsg.innerHTML = ''
        nextShape = Math.floor(Math.random() * pieces.length)        
        currentPos = 4
        currentRotation = 0
        currentShape
        currentPiece = nextPiece()  
        clearInterval(timerId)             
        timerId = setInterval(moveDown, 700)
        started = true
    }

    drawGrids()
    nextSquares.forEach(square => square.classList.add("noPiece"))
    startBt.addEventListener('click', startAndPause)    
    restartBt.addEventListener('click', restartGame)
    document.addEventListener('keydown', control)
    document.addEventListener('keydown', goDown)
})