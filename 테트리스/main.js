const canvas = document.getElementById('tetris');                               // 캔버스 기본 세팅.
const context = canvas.getContext('2d');

const backgroundMusic = new Audio("BGM Tetris Bradinsky.mp3")                   // 웹에 들어갔을 때 자동으로 배경음악이 무한반복으로 재생되도록 하는 코드.
backgroundMusic.loop = true;
backgroundMusic.play(); 

let score = 0;                                                                  // 점수 변수.
const scoreboard = document.getElementById('scoreboard');                       // 점수를 갱신하기 위해 dom으로 점수판 id를 읽는다.

function updateScore(points) {                                                  // 스코어를 갱신하는 함수.
    score += points;
    scoreboard.innerText = `Score: ${score}`;
}

const ROWS = 20;                                                                // 테트리스 보드판의 크기를 설정.
const COLS = 10;
const BLOCK_SIZE = 30;

let board = Array.from({ length: ROWS }, () => Array(COLS).fill(0));            // 위에서 설정한 크기대로 2차원 보드 배열을 생성.       

function drawBlock(x, y, color) {                                               // 블록을 그리는 함수.
    context.fillStyle = color;
    context.fillRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
    context.strokeRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
}

function drawBoard() {                                                          
    for (let y = 0; y < ROWS; y++) {                                            // 보드판의 남은 블록들을 하나하나 검사해서 그린다.
        for (let x = 0; x < COLS; x++) {
            if (board[y][x]) {
                drawBlock(x, y, 'gray');
            }
        }
    }
}

const TETROMINOES = [                                                           // 기본적인 6가지 테트로미노 모양들.

    [[1, 1, 1],
     [0, 1, 0]],

    [[1],
     [1],
     [1],
     [1]],

    [[1, 1],
     [1, 1]],

    [[0, 1, 1],
     [1, 1, 0]],

    [[1, 1, 0],
     [0, 1, 1]],

    [[0, 1],
     [0, 1],
     [1, 1]],

    [[1, 0],
     [1, 0],
     [1, 1]]

];

function createTetromino() {                                                    // 난수를 사용해서 랜덤으로 하나의 테트로미노를 선택한다.
    const index = Math.floor(Math.random() * TETROMINOES.length);
    return TETROMINOES[index];
}

let currentTetromino = createTetromino();                                       // 이후 변수에 선택된 테트로미노를 저장한다.
let currentX = 4; let currentY = 0;                                             // 기본적으로 테트로미노가 생성되는 위치를 설정한다.

function drawTetromino() {
    for (let y = 0; y < currentTetromino.length; y++) {                         // 테트로미노의 행을 하나씩 보면서.
        for (let x = 0; x < currentTetromino[y].length; x++) {                  // 각 행의 블럭들을 검사한다.
            if (currentTetromino[y][x]) {                                       // 만약 블록이 비어 있지 않으면.
                drawBlock(currentX + x, currentY + y, 'purple');                // 블록을 그린다.
            }
        }
    }
}

document.addEventListener('keydown', event => {                                 // 상하좌우로 방향키를 눌렀을 때 이벤트를 지정한다.
    
    let x = currentX;                                                           // 현재 x,y와 테트로미노를 변수로 지정한다.
    let y = currentY;
    let tetromino = currentTetromino;

    if (event.key === 'ArrowLeft') {                                            // 왼쪽 방향키를 누르면 x의 좌표를 하나 감소시켜 왼쪽으로 1칸 이동하는 효과를 낸다.
        x--;
    } else if (event.key === 'ArrowRight') {                                    // 오른쪽 방향키를 누르면 x의 좌표를 하나 증가시켜 오른쪽으로 1칸 이동하는 효과를 낸다.
        x++;
    } else if (event.key === 'ArrowDown') {                                     // 아래쪽 방향키를 누르면 y의 좌표를 하나 감소시켜 아래쪽으로 1칸 이동하는 효과를 낸다.
        y++;
    } else if (event.key === 'ArrowUp') {                                       // 위쪽 방향키를 누르면 시계방향 90도로 테트로미노가 회전한다.

        const rotated = rotate(currentTetromino);                               // 회전시킨 테트로미노를 함수로 만들어놓고.

        if (!Chungdol(x, y, rotated)) {                                         // 만약 다른 블럭이나 보드판의 끝점과 충돌하지 않으면 현재 테트로미노를 회전시킨 테트로미노로 바꾼다.
            tetromino = rotated;
        }

    }

    if (!Chungdol(x, y, tetromino)) {                                           // 만약 일련의 과정 후에 충돌이 발생하지 않으면 테트로미노의 위치와 상태를 업데이트해준다.
        currentX = x;
        currentY = y;
        currentTetromino = tetromino;
    }

    context.clearRect(0, 0, canvas.width, canvas.height);                       // 이후 캔버스 전체를 다시 싹 지우고.
    drawBoard();                                                                // 현재 보드 상태를 기반으로 캔버스에 회색 블록을 그린다.
    drawTetromino();                                                            // 현재 테트로미노의 위치와 모양을 기반으로 캔버스에 테트로미노를 그린다.
});

function rotate(tetromino) {                                                    // 테트로미노 회전 함수.
    const rows = tetromino.length;                                                  
    const cols = tetromino[0].length;
    const rotated = Array.from({ length: cols }, () => Array(rows).fill(0));    
    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
            rotated[x][rows - 1 - y] = tetromino[y][x];
        }
    }
    return rotated;                                                             // 회전 로직을 수행한 뒤 회전된 테트로미노를 반환.
}

function Chungdol(x, y, tetromino) {                                            // 충돌을 감지하는 함수.
    for (let row = 0; row < tetromino.length; row++) {                          
        for (let col = 0; col < tetromino[row].length; col++) {                 // 각 행에 대하여 열을 검사한다.
            if (tetromino[row][col]) {                                          

                if (y + row >= ROWS || x + col < 0 || x + col >= COLS || (board[y + row] && board[y + row][x + col]) != 0) { 
                    return true;                                                // 만약 테트로미노가 바닥, 왼쪽, 오른쪽, 다른 블록들과 충돌할 경우 true를 반환한다.
                }
            }
        }
    }
    return false;                                                               // 충돌하지 않을 경우 false를 반환한다.
}

function checkBoard(tetromino) {                                                // 더 이상 내려가지 않는 상황의 충돌이 났을 때의 좌표를 보드판에 기록하는 함수 checkBoard.
    for (let y = 0; y < tetromino.length; y++) { 
        for (let x = 0; x < tetromino[y].length; x++) { 
            if (tetromino[y][x]) { 
                board[currentY + y][currentX + x] = tetromino[y][x]; 
            }
        }
    }
}

function RemoveFull() {
    let Remove = [];                                                            // 완성된 줄의 인덱스를 제거하는 Remove 배열.

    for (let y = 0; y < board.length; y++) {                                    // 각 행을 검사한다.
        if (board[y].every(value => value != 0)) {                              // 만약 배열의 요소중에서 모든 값이 0이 아닐 경우 꽉 차있다는 뜻.
            Remove.push(y);                                                     // Remove 배열에 행을 push한다.
        }
    }

    Remove.forEach(line => {                                                    // Remove 배열에 저장된 행에 대하여.
        board.splice(line, 1);                                                  // 그 행 위치에서 한 개의 갯수를 삭제한다.
        board.unshift(Array(COLS).fill(0));                                     // 이후 보드의 맨 앞에 0으로 채워진 길이의 배열을 unshift를 사용해서 추가한다.
    });

    return Remove.length;                                                       // 지워진 행의 개수를 반환.
}

setInterval(() => {                                                             // 1초마다 콜백함수를 요청한다.

    currentY++;                                                                 // 테트로미노를 한 칸 밑으로 1초마다 계속 이동시킨다.

    if (Chungdol(currentX, currentY, currentTetromino)) {                       // 이 이동시키는 과정에서 충돌 여부를 검사하는데.

        currentY--;                                                             // 만약 충돌이 발생하면 밑으로 내린 좌표를 다시 위로 돌려놓는다.
        checkBoard(currentTetromino);                                           // 이후 checkBoard 함수로 만약 더 이상 테트로미노가 내려가지 않는 상황의 좌표를 보드판에 기록한다.

        const RemoveCount = RemoveFull();                                       // 이후 완성된 행들을 제거하고 제거된 줄 수를 반환받아서 변수에 넣는다.
        if (RemoveCount > 0) {                                                  // 만약 제거된 행이 존재하면.
            updateScore(RemoveCount * 1000);                                    // 한 행당 1000점씩 스코어판을 업데이트한다.
        }

        currentTetromino = createTetromino();                                   // 새로운 테트로미노를 생성한다.
        currentX = 4;
        currentY = 0;

        if (Chungdol(currentX, currentY, currentTetromino)) {                   // 테트로미노가 생성되자마자 바로 충돌했다는 것은 블럭이 게임오버되는 위치까지 차있다는 뜻. 
            alert('게임 오버');                                                  // 그러므로 게임 오버 경고창을 띄운다.
            board = Array.from({ length: ROWS }, () => Array(COLS).fill(0));    // 보드판을 새로 만들고.
            score = 0;
            updateScore(0);                                                     // 스코어와 점수판을 초기화한다.
        }
    }

    context.clearRect(0, 0, canvas.width, canvas.height);                       // 조건들을 전부 검사한 이후 캔버스를 초기화하고.
    drawBoard();                                                                // 보드를 다시 그리고.
    drawTetromino();                                                            // 테트로미노를 그린다.
    
}, 1000);

