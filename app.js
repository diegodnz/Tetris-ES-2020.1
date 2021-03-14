document.addEventListener('DOMContentLoaded'), () => {
    const grid = document.querySelector('.grid')
    let squares = Array.from(document.querySelectorAll('.grid div'))
    const score = document.querySelector('#score')
    const startBt = document.querySelector('#start-button')

    const height = 10

    const iShape = [
        [0, height, height*2, height*3], 
        [0, -1, 1, 2],  
        [height, height-1, height+1, height+2], 
        [0, height, height*2, height*3] 
    ]

    const zShape = [
        [0, +1, -height, height+1],
        [0, +1, height, height-1],
        [0, +1, -height, height+1],
        [0, +1, height, height-1]
    ]

    const lShape = [
        [0, -height, height, height+1],
        [0, 1, -1, height-1],
        [0, height, -height, -height-1],
        [0, -1, +1, -height+1]
    ]

    const strangeShape = [
        [0, -height, -1, 1],
        [0, -height, height, 1],
        [0, 1, -1, height],
        [0, -height, height, -1]
    ]

    let pieces = [iShape, zShape, lShape, strangeShape]
    let currentPos = 4
    let currentPiece = nextPiece()
    timer = setInterval(moveDown, 60)

    function nextPiece() {
        i = Math.floor(Math.random() * pieces.length)
        return pieces[i][0]
    }

    function drawGrids() {
        for (let i=0; i<squares.length; i++) {           
            squares[i].classList.add("noPiece")            
        }  
    }

    function undrawPiece() {
        for (index of currentPiece) {
            if (currentPos+index > 0) {
                squares[currentPos + index].classList.remove("piece")
            }
        }
    }

    function drawPiece() {
        for (index of currentPiece) {
            if(currentPos+index > 0){
                squares[currentPos + index].classList.add("piece")
            }
        }        
    }

    function stop() {
        for (index of currentPiece) {
            if (index+currentPos+height > 199 || squares[index+currentPos+height].classList.contains("freeze")) {   
                currentPiece.forEach(index => squares[currentPos+index].classList.add("freeze"))           
                currentPos = 4
                currentPiece = nextPiece()
                break
            }                       
        }
    }

    function moveDown() {  
        stop()             
        undrawPiece()
        currentPos += height
        drawPiece()    
    }

    nextPiece()    
    drawGrids()
    drawPiece() 
} 