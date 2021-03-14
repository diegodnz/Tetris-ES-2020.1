document.addEventListener('DOMContentLoaded'), () => {
    const grid = document.querySelector('.grid')
    let squares = Array.from(document.querySelectorAll('.grid div'))
    const score = document.querySelector('#score')
    const startBt = document.querySelector('#start-button')

    const width = 9

    const iShape = [
        [0, width, width*2, width*3],  // |
        [0, -1, 1, 2],  // -
        [width, width-1, width+1, width+2], // -
        [0, width, width*2, width*3]  // |
    ]

    function drawGrids() {
        squares.forEach(div => div.classList.add("noPiece"))
    }

    function testPiece() {
        squares[4].classList.add("piece")
    }

    drawGrids();
    testPiece();
} 