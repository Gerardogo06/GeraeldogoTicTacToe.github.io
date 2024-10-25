let board = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'x';
let playerWins = 0;
let computerWins = 0;
let draws = 0;
let playerName = '';
let timer; 
let timeElapsed = 0; 
let timerStarted = false;

function addScoreToTable(playerName, computerWins, draws, playerWins, timeElapsed, date) {
    const table = document.getElementById('Resultados');
    const newRow = table.insertRow(); 

    const playerCell = newRow.insertCell(0);
    const defeatsCell = newRow.insertCell(1);
    const drawsCell = newRow.insertCell(2);
    const victoriesCell = newRow.insertCell(3);
    const timeCell = newRow.insertCell(4);
    const dateCell = newRow.insertCell(5);

    playerCell.innerText = playerName;
    defeatsCell.innerText = computerWins;
    drawsCell.innerText = draws;
    victoriesCell.innerText = playerWins;
    timeCell.innerText = timeElapsed + 's';
    dateCell.innerText = date;
}


function getFormattedDate() {
    const date = new Date();

    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear().toString().slice(-2);

    if (day < 10) {
        day = '0' + day;
    }
    if (month < 10) {
        month = '0' + month;
    }

    const dateArray = [day, month, year];

    const formattedDate = dateArray.join('/');

    return formattedDate;
}

function initialize() {
    playerWins = localStorage.getItem('victorias');
    computerWins = localStorage.getItem('derrotas');
    draws = localStorage.getItem('empate');
    tiempo = localStorage.getItem('player_time');
    playerName = localStorage.getItem('playerName');
    
    let fecha = localStorage.getItem('Fecha');
    if (!fecha) {
        fecha = getFormattedDate(); 
        localStorage.setItem('Fecha', fecha);
    }
    
    updateScores();
    document.getElementById('optionsDlg').style.display = 'block';
    document.getElementById('playerName').innerText = playerName; 
    document.getElementById('Date_time').innerText = fecha; 
}


function startTimer() {
    timerStarted = true; 
    timer = setInterval(() => {
        timeElapsed++;
        document.getElementById('Player_time').innerText = timeElapsed; 
    }, 1000); 
}

function stopTimer() {
    clearInterval(timer);
    timerStarted = false; 
}

function getOptions() {
    playerName = document.getElementById('txt-jugador').value;
    localStorage.setItem('playerName', playerName);
    document.getElementById('optionsDlg').style.display = 'none';
}

function cellClicked(cellId) {
    let cellIndex = parseInt(cellId.replace('cell', ''));
    if (board[cellIndex] === '') {
        if (!timerStarted) startTimer(); 
        board[cellIndex] = currentPlayer;
        document.getElementById(cellId).innerText = currentPlayer.toUpperCase();
        if (checkWin(currentPlayer)) {
            endGame(currentPlayer);
        } else if (board.includes('')) {
            currentPlayer = currentPlayer === 'x' ? 'o' : 'x';
            if (currentPlayer === 'o') {
                computerMove();
            }
        } else {
            endGame('draw');
        }
    }
}

function computerMove() {
    let emptyCells = board.map((val, index) => val === '' ? index : null).filter(val => val !== null);
    let randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    board[randomCell] = currentPlayer;
    document.getElementById(`cell${randomCell}`).innerText = currentPlayer.toUpperCase();
    if (checkWin(currentPlayer)) {
        endGame(currentPlayer);
    } else if (board.includes('')) {
        currentPlayer = 'x';
    } else {
        endGame('draw');
    }
}

function checkWin(player) {
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8], 
        [0, 4, 8], [2, 4, 6]              
    ];
    return winPatterns.some(pattern => pattern.every(index => board[index] === player));
}

function endGame(winner) {
    stopTimer(); 
    let fecha = getFormattedDate(); 
    let playerName = prompt("Ingresa tú nombre");
    if (winner === 'x') {
        playerWins++;
        localStorage.setItem('victorias', playerWins);
        document.getElementById('winText').innerText = `${playerName} ha ganado!`;
    } else if (winner === 'o') {
        computerWins++;
        localStorage.setItem('derrotas', computerWins);
        document.getElementById('winText').innerText = 'La computadora ha ganado!';
    } else {
        draws++;
        localStorage.setItem('empate', draws);
        document.getElementById('winText').innerText = '¡Es un empate!';
    }

    addScoreToTable(playerName, computerWins, draws, playerWins, timeElapsed, fecha);

    updateScores();
    document.getElementById('winAnnounce').style.display = 'block';
    restartGame(); 
}


function updateScores() {
    
}

function restartGame(clearBoard = false) {
    board = ['', '', '', '', '', '', '', '', ''];
    currentPlayer = 'x';
    timeElapsed = 0; 
    timerStarted = false; 
    if (clearBoard) {
        Array.from(document.getElementsByClassName('fixed')).forEach(cell => cell.innerText = '');
        location.reload(); 
    } else {
        Array.from(document.getElementsByClassName('fixed')).forEach(cell => cell.innerText = '');
    }
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

function resetData() {
    localStorage.clear();
    playerWins = 0;
    computerWins = 0;
    draws = 0;
    updateScores();
    restartGame(true); 
}

//Tiene fallos pero podría ser peor
