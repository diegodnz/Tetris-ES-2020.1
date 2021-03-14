document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.grid')
    let squares = Array.from(document.querySelectorAll('.grid div'))
    const gameScore = document.querySelector('#score')
    const startBt = document.querySelector('#start-button')
    const restartBt = document.querySelector('#restart-button')

    const height = 10  // Número que representa a posição logo abaixo de uma quadrado no grid (quadrado + height = quadrado abaixo)

    const iShape = [  // Peça em forma de I
        [0, height, height*2, height*3], 
        [0, -1, 1, 2],  
        [0, height, height*2, height*3],
        [height, height-1, height+1, height+2] 
    ]

    const zShape = [  // Peça em forma de Z
        [0, +1, -height, height+1],
        [0, +1, height, height-1],
        [0, +1, -height, height+1],
        [0, +1, height, height-1]
    ]

    const lShape = [  // Peça em forma de L
        [0, -height, height, height+1],
        [0, 1, -1, height-1],
        [0, height, -height, -height-1],
        [0, -1, +1, -height+1]
    ]

    const strangeShape = [  // Quarta peça
        [0, -height, -1, 1],
        [0, -height, height, 1],
        [0, 1, -1, height],
        [0, -height, height, -1]
    ]

    let pieces = [iShape, zShape, lShape, strangeShape]
    let currentPos
    let currentRotate
    let currentShape
    let currentPiece
    let timerId
    let gameOver = false
    let started = null

    /*
    Retorna uma peça aleatória
    */
    function nextPiece() {        
        currentShape = Math.floor(Math.random() * pieces.length)
        return pieces[currentShape][0]
    }

    /*
    Desenha todo o grid (marca os quadrados como "noPiece")
    */
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

    /*
    Congela uma peça
    */
    function freezePiece() {
        for (index of currentPiece) {
            if (currentPos+index > 0) {
                squares[currentPos + index].classList.add("freeze")
            }
        }
        updatePiece()
    }

    /*
    Apaga uma peça
    */
    function undrawPiece() {
        for (index of currentPiece) {
            if (currentPos+index > 0) {
                squares[currentPos + index].classList.remove("piece")
            }
        }
    }

    /*
    Desenha uma peça
    */
    function drawPiece() {
        let frozenPiece = false
        for (index of currentPiece) {
            if(currentPos+index > 0){
                if (squares[currentPos + index].classList.contains("freeze")) {
                    freezePiece()
                    console.log("asdasd")
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

    /*
    Cria uma nova peça na parte de cima do grid
    */
    function updatePiece() {
        currentPos = 4
        currentPiece = nextPiece()
    }

    /*
    Para a peça caso atenda às condições
    */
    function stop() {
        for (index of currentPiece) {
            if (index+currentPos+height > 199 || squares[index+currentPos+height].classList.contains("freeze")) {   
                freezePiece()            
                updatePiece()
                break
            }                       
        }
    }

    /*
    Checa se o jogo acabou (game over)
    */
    function chkGameOver() {
        if (squares[4].classList.contains("freeze")) {          
            console.log("Game")
            clearInterval(timerId)
            timerId = null
            return true
        }
        return false
    }

    function score() {
        for (let i=0; i<200; i+=10) {
            complete = true
            for (let j=i; j<i+10; j++) {
                if (!squares[j].classList.contains("freeze")) {
                    complete = false
                    break
                }
            }
            if (complete) {
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

    /*
    Move a peça atual para baixo
    */
    function moveDown() {         
        stop()         
        undrawPiece()
        currentPos += height
        drawPiece()           
        gameOver = chkGameOver() 
        score()
    }

    /*
    Move a peça atual para a esquerda
    */
    function moveLeft() {
        let atLimit = false
        let pieceOnLeft = false
        for (index of currentPiece) {
            if ( (currentPos+index) % height === 0) {
                atLimit = true
                break
            } else if ( (currentPos+index) > 0 && squares[currentPos+index-1].classList.contains("freeze")) {
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

    /*
    Move a peça atual para a direita
    */
    function moveRight() {
        let atLimit = false
        let pieceOnRight = false
        for (index of currentPiece) {
            if ( (currentPos+index) % height === height-1) {                
                atLimit = true
                break
            } else if ( (currentPos+index) > 0 && squares[currentPos+index+1].classList.contains("freeze")) {
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

    /*
    Gira a peça atual
    */
    function rotate() {
        if (currentRotate < 3) {
            currentRotate++
        } else {
            currentRotate = 0
        }  

        undrawPiece()
        currentPiece = pieces[currentShape][currentRotate]
        drawPiece()
    }

    /*
    Move a peça de acordo com a tecla pressionada
    */
    function control(e) {
        if (!gameOver && started) {
            if (e.keyCode === 37) {                        
                moveLeft()       
            } else if (e.keyCode === 38) {
                rotate()           
            } else if (e.keyCode === 39) {     
                moveRight()       
            } else if (e.keyCode === 40) {
                moveDown()           
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
            currentPos = 4
            currentRotate = 0
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
        currentPos = 4
        currentRotate = 0
        currentShape
        currentPiece = nextPiece()  
        clearInterval(timerId)             
        timerId = setInterval(moveDown, 700)
        started = true
    }

    drawGrids()
    startBt.addEventListener('click', startAndPause)    
    restartBt.addEventListener('click', restartGame)
    document.addEventListener('keyup', control)
    document.addEventListener('keydown', goDown)
})