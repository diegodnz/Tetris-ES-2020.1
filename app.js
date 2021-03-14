document.addEventListener('DOMContentLoaded'), () => {
    const grid = document.querySelector('.grid')
    let squares = Array.from(document.querySelectorAll('.grid div'))
    const score = document.querySelector('#score')
    const startBt = document.querySelector('#start-button')

    const width = 9

    const iShape = [
        [0, width, width*2, width*3], 
        [0, -1, 1, 2],  
        [width, width-1, width+1, width+2], 
        [0, width, width*2, width*3] 
    ]

    const zShape = [
        [0, +1, -width, width+1],
        [0, +1, width, width-1],
        [0, +1, -width, width+1],
        [0, +1, width, width-1]
    ]

    const lShape = [
        [0, -width, width, width+1],
        [0, 1, -1, width-1],
        [0, width, -width, -width-1],
        [0, -1, +1, -width+1]
    ]

    const strangeShape = [
        [0, -width, -1, 1],
        [0, -width, width, 1],
        [0, 1, -1, width],
        [0, -width, width, -1]
    ]

    let currentPos = 13
    let currentPiece = strangeShape[3]

    function drawGrids() {
        squares.forEach(div => div.classList.add("noPiece"))
    }

    function drawPiece() {
        for (index of currentPiece) {
            if(currentPos+index > 0){
                squares[currentPos + index].classList.add("piece")
            }
        }        
    }

    function testPiece() {
        squares[4].classList.add("piece")
    }

    drawGrids();
    drawPiece();
} 