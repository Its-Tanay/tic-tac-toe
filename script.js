const createPlayer = (name, marker) => {

    return {
      getName: () => name,
      getMarker: () => marker,
    };

};
  
const gameBoard = (() => {
    
    let board = [
        ["", "", ""],
        ["", "", ""],
        ["", "", ""],
    ];
  
    const renderBoard = () => board;
  
    const updateBoard = (i, j, marker) => {
        if (i >= 0 && i < 3 && j >= 0 && j < 3 && board[i][j] === "") {
            board[i][j] = marker;
            return true;
        }
        return false;
    };
  
    const winningCombinations = [

        [[0, 0], [0, 1], [0, 2]],
        [[1, 0], [1, 1], [1, 2]],
        [[2, 0], [2, 1], [2, 2]],
        [[0, 0], [1, 0], [2, 0]],
        [[0, 1], [1, 1], [2, 1]],
        [[0, 2], [1, 2], [2, 2]],
        [[0, 0], [1, 1], [2, 2]],
        [[0, 2], [1, 1], [2, 0]],

    ];
  
    const checkWin = (marker) => {
        for (const combination of winningCombinations) {
            const [a, b, c] = combination;
            if(
                board[a[0]][a[1]] === marker &&
                board[b[0]][b[1]] === marker &&
                board[c[0]][c[1]] === marker
            ){
            return true;
            }
        }
        return false;
    };
  
    const checkTie = () => {
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (board[i][j] === "") {
                    return false;
                }
            }
        }
        return true;
    };
  
    const resetBoard = () => {
        board = [
            ["", "", ""],
            ["", "", ""],
            ["", "", ""],
        ];
    };
  
    return {
        renderBoard,
        updateBoard,
        checkWin,
        checkTie,
        resetBoard,
    };
})();
  
const gameplay = (() => {
    let currentPlayer = null;
    let toswitchPlayer = null;
  
    const player1 = createPlayer("Player 1", "X");
    const player2 = createPlayer("Player 2", "O");
  
    const computer2 = createPlayer("Computer", "O");
  
    const p1element = document.getElementById("player01");
        p1element.addEventListener("click", () => {
        if (currentPlayer === null) {
            currentPlayer = player1;
        } else if (currentPlayer !== null) {
            toswitchPlayer = player1;
        }
        p1element.classList.add("active1");
        p2element.disabled = false;
        c2element.disabled = false;
    });
  
    const p2element = document.getElementById("player02");
        p2element.disabled = true;
        p2element.addEventListener("click", () => {
        if (currentPlayer === null) {
            currentPlayer = player2;
        } else if (currentPlayer !== null) {
            toswitchPlayer = player2;
        }
        p2element.classList.add("active2");
        c2element.disabled = false;
    });
  
    const c2element = document.getElementById("computer02");
        c2element.disabled = true;
        c2element.addEventListener("click", () => {
        if (currentPlayer === null) {
            currentPlayer = computer2;
        } else if (currentPlayer !== null) {
            toswitchPlayer = computer2;
        }
        c2element.classList.add("active2");
        p2element.disabled = false;
    });
  
    const getCurrentPlayer = () => currentPlayer;
  
    const getToswitchPlayer = () => toswitchPlayer;

    const switchPlayer = () => {

        const tempPlayer = currentPlayer;
        currentPlayer = toswitchPlayer;
        toswitchPlayer = tempPlayer;

    };
  
    const resetCurrentPlayer = () => {

        currentPlayer = null;
        toswitchPlayer = null;

    };
  
    return {

        getCurrentPlayer,
        getToswitchPlayer,
        switchPlayer,
        resetCurrentPlayer,

    };
})();
  
const gameflow = (() => {

    let gameover = false;
  
    const resultText = document.querySelector("#text");
    const board = document.querySelector(".board");
    const boxes = board.querySelectorAll(".box");
  
    const playerMove = (box, index) => {

        if (gameover) return;
    
        const i = Math.floor(index / 3);
        const j = index % 3;
    
        const cp = gameplay.getCurrentPlayer();

        if (cp.getMarker() === "X") {
            box.classList.add("marker-text-x");
          } else if (cp.getMarker() === "O") {
            box.classList.add("marker-text-o");
          }
      
        const tsp = gameplay.getToswitchPlayer();
    
        if (gameBoard.updateBoard(i, j, cp.getMarker())) {
            box.textContent = cp.getMarker();
    
            if (gameBoard.checkWin(cp.getMarker())) {

                console.log(cp.getName() + " is the winner");
                resultText.textContent = cp.getName() + " wins!";
                gameover = true;

            } 
            else if (gameBoard.checkTie()){

                resultText.textContent = "It's a tie!";
                console.log("It's a tie");
                gameover = true;

            }
            else{

            gameplay.switchPlayer();

            if (gameplay.getCurrentPlayer().getName().includes("Computer")){
                
                computerMove();
            }
            }
        }
        else{
            console.log("Invalid move. Try again.");
        }
    };
  
    const computerMove = () => {

        const nullBoxes = findNullBoxes();
        const randomIndex = Math.floor(Math.random() * nullBoxes.length);
        const [i, j] = nullBoxes[randomIndex];
    
        setTimeout(() => {
            const boxIndex = i * 3 + j;
            playerMove(boxes[boxIndex], boxIndex);
        }, 500);

    };
  
    const findNullBoxes = () => {

        const nullBoxes = [];
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (gameBoard.renderBoard()[i][j] === "") {
                    nullBoxes.push([i, j]);
                }
            }
        }
        return nullBoxes;
    };
  
    const playgame = () => {
        boxes.forEach((box) => {
            box.addEventListener("click", boxClickHandler);
        });
    };

    const boxClickHandler = (event) => {
        const box = event.target;
        const index = Array.from(boxes).indexOf(box);
        playerMove(box, index);
    };
  
    const resetgame = () => {

        gameBoard.resetBoard();
        
        boxes.forEach((box) => {
            box.textContent = "";
            box.classList.remove("marker-text-x");
            box.classList.remove("marker-text-o");
            box.removeEventListener("click", boxClickHandler);
        });

        gameplay.resetCurrentPlayer();

        const selectionBtns = document.querySelectorAll(".select");
        const board = document.querySelector(".board");
        const resetbtn = document.querySelector("#reset");
        const resultText = document.querySelector("#text");
        const playbtn = document.querySelector(".play-btn");
        const startbtn = document.querySelector("#startgame");

        if (board, resetbtn, resultText, playbtn, startbtn) {
            board.style.display = "none";
            resetbtn.style.display = "none";
            resultText.textContent = "";
            startbtn.style.display = "block";
            playbtn.style.display = "block";
        }

        selectionBtns.forEach((btn) => {
            btn.disabled = false;
            btn.classList.remove("active1");
            btn.classList.remove("active2");
        });
        
        gameover = false;
    };

    return {
        playgame,
        resetgame,
    };
})();
  
const playbtn = document.querySelector(".play-btn");
const startbtn = document.querySelector("#startgame");
const resetbtn = document.querySelector("#reset");
const board = document.querySelector(".board");
const resultText = document.querySelector("#text");
const selection = document.querySelector(".selection-pane");
const mainheader = document.querySelector(".header");

playbtn.addEventListener("click", () => {
    if (selection) {
        selection.style.display = "grid";
        playbtn.style.display = "none";
    }
});

startbtn.addEventListener("click", () => {
    if (board && resultText) {
        gameflow.playgame();
        playbtn.style.display = "none";
        resetbtn.style.display = "block";
        board.style.display = "grid";
        resultText.style.display = "block";
        startbtn.style.display = "none";
        selection.style.display = "none";
    }
});

resetbtn.addEventListener("click", gameflow.resetgame);
