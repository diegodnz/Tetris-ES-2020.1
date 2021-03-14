document.addEventListener('DOMContentLoaded'), () => {
    const grid = document.querySelector('.grid')
    let squares = Array.from(document.querySelectorAll('.grid div'))
    const score = document.querySelector('#score')
    const startBt = document.querySelector('#start-button')

    const height = 10  // Número que representa a posição logo abaixo de uma quadrado no grid (quadrado + height = quadrado abaixo)

    const iShape = [  // Peça em forma de I
        [0, height, height*2, height*3], 
        [0, -1, 1, 2],  
        [height, height-1, height+1, height+2], 
        [0, height, height*2, height*3] 
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
    let currentPos = 4
    let currentPiece = nextPiece()
    timer = setInterval(moveDown, 700)

    /*
    Retorna uma peça aleatória
    */
    function nextPiece() {
        i = Math.floor(Math.random() * pieces.length)
        return pieces[i][0]
    }

    /*
    Desenha todo o grid (marca os quadrados como "noPiece")
    */
    function drawGrids() {
        for (let i=0; i<squares.length; i++) {           
            squares[i].classList.add("noPiece")            
        }  
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
        for (index of currentPiece) {
            if(currentPos+index > 0){
                squares[currentPos + index].classList.add("piece")
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
                currentPiece.forEach(index => squares[currentPos+index].classList.add("freeze"))           
                updatePiece()
                break
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
    }

    /*
    Move a peça atual para a esquerda
    */
    function moveLeft() {
        let atLimit = false
        let pieceOnLeft = false
        for (index of currentPiece) {
            if ((currentPos+index) % height === 0) {
                atLimit = true
                break
            } else if (squares[currentPos+index-1].classList.contains("freeze")) {
                pieceOnLeft = true
                break
            }
        }
        if (!atLimit && !pieceOnLeft) {
            undrawPiece()
            currentPos -= 1
            drawPiece()
        } else if(pieceOnLeft){
            updatePiece()
        }
    }

    /*
    Move a peça de acordo com a tecla pressionada
    */
    function control(e) {
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

    /*
    Move a peça para baixo mais rapidamente
    */
    function putFast(e) {
        if (e.keyCode === 40) {
            moveDown()
        }
    }

    document.addEventListener('keydown', control)
    document.addEventListener('keydown', putFast)
  
    drawGrids()
    drawPiece() 
} 