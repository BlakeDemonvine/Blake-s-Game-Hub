let arr = new Array(8);
let chooseArr = new Array(8);
const piece = [' ','♟','♜','♞','♝','♛','♚'];
let player;
let select;
let ifSelect = false;


//初始化arr板子&chooseArr
function restartBoard(){
  for(let i = 0 ; i<8 ; i++){
    chooseArr[i] = new Array(8).fill(false);
    if(i===0){
      arr[i] = [-2,-3,-4,-5,-6,-4,-3,-2];
    }
    else if(i===1){
      arr[i] = new Array(8).fill(-1);
    }
    else if(i===6){
      arr[i] = new Array(8).fill(1);
    }
    else if(i===7){
      arr[i] = [2,3,4,5,6,4,3,2];
    }
    else{
      arr[i] = new Array(8).fill(0);
    }
  }
}

function clearChooseArr(){
  chooseArr = new Array(8);
  for(let i = 0 ; i<8 ; i++){
    chooseArr[i] = new Array(8).fill(false);
  }
}
function showBoard(){
  let blackCount = false;
  let whiteCount = false;
  for(let i = 0 ; i<8 ; i++){
    console.log(chooseArr[i]);
    for(let j = 0 ; j<8 ; j++){
      if(arr[i][j]==6){
        whiteCount = true;
      }
      else if(arr[i][j]==-6){
        blackCount = true;
      }
      document.getElementById(`m${i}m${j}`).classList.remove('whitePiece');
      document.getElementById(`m${i}m${j}`).classList.remove('blackPiece');
      document.getElementById(`m${i}m${j}`).classList.remove('selectedPiece');
      document.getElementById(`m${i}m${j}`).classList.remove('redPiece');
      if(!chooseArr[i][j]){
        document.getElementById(`m${i}m${j}`).innerHTML = piece[Math.abs(arr[i][j])];
        if(arr[i][j] > 0){
          document.getElementById(`m${i}m${j}`).classList.add('whitePiece');
        }
        else if(arr[i][j] < 0){
          document.getElementById(`m${i}m${j}`).classList.add('blackPiece');
        }
      }
      else{
        if(arr[i][j] === 0){
          document.getElementById(`m${i}m${j}`).innerHTML = '●';
          document.getElementById(`m${i}m${j}`).classList.add('selectedPiece');
        }
        else{
          document.getElementById(`m${i}m${j}`).innerHTML = piece[Math.abs(arr[i][j])];
          document.getElementById(`m${i}m${j}`).classList.add('redPiece');
        }
      }
      
    }
  }
  if(!blackCount || !whiteCount){
    let winner = !blackCount? "⚪ White Wins!" : "⚫ Black Wins!";
    
    // 顯示遊戲結束畫面
    document.getElementById('content').innerHTML = `
      <div class="gameOverScreen">
        <h2>${winner}</h2>
        <button id="restartGame">🔄 Play Again</button>
      </div>
    `;

    // 重新開始遊戲的按鈕
    document.getElementById("restartGame").addEventListener("click", function() {
      startGame();
    });
  }
}


function startGame(){
  restartBoard();
  //顯示按鈕(board)
  let save = `<div id="newcontent">`;
  for(let i = 0 ; i<8 ; i++){
    for(let j = 0 ; j<8 ; j++){
      let theClass = "boardButton";
      if(i%2 == j%2){
        theClass += " oddBoard";
      }
      else{
        theClass += " evenBoard";
      }
      if(arr[i][j]>0){
        theClass += " whitePiece";
      }
      else if(arr[i][j]<0){
        theClass += " blackPiece";
      }
      else if(arr[i][j]===0){
        theClass += " selectedPiece";
      }
      save+=
      `
      <button class="${theClass}" id="m${i}m${j}">${piece[Math.abs(arr[i][j])]}</button>
      `;
    }
  }
  save+="</div>";
  document.getElementById('content').innerHTML = save;
  player = Math.random() < 0.5 ? -1 : 1;
  if(player === -1){
    alert('⚫Black goes first');
  }
  else if(player === 1){
    alert('⚪White goes first');
  }
  for(let i = 0 ; i<8 ; i++){
    for(let j = 0 ; j<8 ; j++){
      document.getElementById(`m${i}m${j}`).addEventListener("click", function(event) { 
        if(arr[i][j]*player>0){
          select = [i,j];
          find(i,j);
        }
        else if(chooseArr[i][j]){
          arr[i][j] = arr[select[0]][select[1]];
          arr[select[0]][select[1]] = 0;     
          clearChooseArr()
          showBoard();
          player*=-1;
        }
        
      });
    }
  }
}

function find(x,y){
  //刪除之前的
  clearChooseArr();
  
  //prawn
  if(Math.abs(arr[x][y])===1){
    //向前
    if(arr[x-player][y]===0){
      chooseArr[x-player][y] = true;
      ifSelect = true;
    }
    if(arr[x][y]*2.5+3.5 === x){
      if(arr[x-2*player][y]===0){
        chooseArr[x-2*player][y] = true;
        ifSelect = true;
      }
    }
    if(arr[x-player][y+1]*arr[x][y]<0){
      chooseArr[x-player][y+1] = true;
      ifSelect = true;
    }
    if(arr[x-player][y-1]*arr[x][y]<0){
      chooseArr[x-player][y-1] = true;
      ifSelect = true;
    }
  }//bishops
  else if(Math.abs(arr[x][y])===2){
    // 向上 (直行)
    for (let i = 1; x - i >= 0; i++) {
      if (arr[x - i][y] != 0) {
        if (arr[x - i][y] * arr[x][y] < 0) {
          chooseArr[x - i][y] = true;
          ifSelect = true;
        }
        break;
      } else {
        chooseArr[x - i][y] = true;
        ifSelect = true;
      }
    }
    // 向下 (直行)
    for (let i = 1; x + i < 8; i++) {
      if (arr[x + i][y] != 0) {
        if (arr[x + i][y] * arr[x][y] < 0) {
          chooseArr[x + i][y] = true;
          ifSelect = true;
        }
        break;
      } else {
        chooseArr[x + i][y] = true;
        ifSelect = true;
      }
    }
    // 向右 (直行)
    for (let i = 1; y + i < 8; i++) {
      if (arr[x][y + i] != 0) {
        if (arr[x][y + i] * arr[x][y] < 0) {
          chooseArr[x][y + i] = true;
          ifSelect = true;
        }
        break;
      } else {
        chooseArr[x][y + i] = true;
        ifSelect = true;
      }
    }
    // 向左 (直行)
    for (let i = 1; y - i >= 0; i++) {
      if (arr[x][y - i] != 0) {
        if (arr[x][y - i] * arr[x][y] < 0) {
          chooseArr[x][y - i] = true;
          ifSelect = true;
        }
        break;
      } else {
        chooseArr[x][y - i] = true;
        ifSelect = true;
      }
    }
  }//knight
  else if(Math.abs(arr[x][y]) === 3) {  //騎士
    // 8個可能的騎士移動位置
    const knightMoves = [
      [-2, -1], [-2, 1], [2, -1], [2, 1], 
      [-1, -2], [-1, 2], [1, -2], [1, 2]
    ];
    
    for (let i = 0; i < knightMoves.length; i++) {
      const newX = x + knightMoves[i][0];
      const newY = y + knightMoves[i][1];
      
      // 檢查新位置是否在棋盤範圍內
      if (newX >= 0 && newX < 8 && newY >= 0 && newY < 8) {
        // 如果該位置是空白格或敵方棋子，則可以移動
        if (arr[newX][newY] * player <= 0) {
          chooseArr[newX][newY] = true;
          ifSelect = true;
        }
      }
    }
  }//rooks
  else if (Math.abs(arr[x][y]) === 4) { // Bishop (主教)
    let directions = [
      [-1, -1], [-1, 1], [1, -1], [1, 1] // 左上、右上、左下、右下
    ];
  
    for (let [dx, dy] of directions) {
      for (let i = 1; i < 8; i++) {
        let newX = x + i * dx;
        let newY = y + i * dy;
  
        if (newX < 0 || newX >= 8 || newY < 0 || newY >= 8) break; // 超出棋盤範圍
  
        if (arr[newX][newY] === 0) {
          chooseArr[newX][newY] = true; // 空格可以移動
        } else {
          if (arr[newX][newY] * arr[x][y] < 0) {
            chooseArr[newX][newY] = true; // 遇到敵方棋子，允許攻擊
          }
          break; // 遇到任何棋子就停止
        }
      }
    }
  }
  //queen
  else if (Math.abs(arr[x][y]) === 5) {  // Queen
    // 向上 (直行)
    for (let i = 1; x - i >= 0; i++) {
      if (arr[x - i][y] != 0) {
        if (arr[x - i][y] * arr[x][y] < 0) {
          chooseArr[x - i][y] = true;
          ifSelect = true;
        }
        break;
      } else {
        chooseArr[x - i][y] = true;
        ifSelect = true;
      }
    }
    // 向下 (直行)
    for (let i = 1; x + i < 8; i++) {
      if (arr[x + i][y] != 0) {
        if (arr[x + i][y] * arr[x][y] < 0) {
          chooseArr[x + i][y] = true;
          ifSelect = true;
        }
        break;
      } else {
        chooseArr[x + i][y] = true;
        ifSelect = true;
      }
    }
    // 向右 (直行)
    for (let i = 1; y + i < 8; i++) {
      if (arr[x][y + i] != 0) {
        if (arr[x][y + i] * arr[x][y] < 0) {
          chooseArr[x][y + i] = true;
          ifSelect = true;
        }
        break;
      } else {
        chooseArr[x][y + i] = true;
        ifSelect = true;
      }
    }
    // 向左 (直行)
    for (let i = 1; y - i >= 0; i++) {
      if (arr[x][y - i] != 0) {
        if (arr[x][y - i] * arr[x][y] < 0) {
          chooseArr[x][y - i] = true;
          ifSelect = true;
        }
        break;
      } else {
        chooseArr[x][y - i] = true;
        ifSelect = true;
      }
    }
    // 向左上 (斜行)
    for (let i = 1; x - i >= 0 && y - i >= 0; i++) {
      if (arr[x - i][y - i] != 0) {
        if (arr[x - i][y - i] * arr[x][y] < 0) {
          chooseArr[x - i][y - i] = true;
          ifSelect = true;
        }
        break;
      } else {
        chooseArr[x - i][y - i] = true;
        ifSelect = true;
      }
    }
    // 向右上 (斜行)
    for (let i = 1; x - i >= 0 && y + i < 8; i++) {
      if (arr[x - i][y + i] != 0) {
        if (arr[x - i][y + i] * arr[x][y] < 0) {
          chooseArr[x - i][y + i] = true;
          ifSelect = true;
        }
        break;
      } else {
        chooseArr[x - i][y + i] = true;
        ifSelect = true;
      }
    }
    // 向左下 (斜行)
    for (let i = 1; x + i < 8 && y - i >= 0; i++) {
      if (arr[x + i][y - i] != 0) {
        if (arr[x + i][y - i] * arr[x][y] < 0) {
          chooseArr[x + i][y - i] = true;
          ifSelect = true;
        }
        break;
      } else {
        chooseArr[x + i][y - i] = true;
        ifSelect = true;
      }
    }
    // 向右下 (斜行)
    for (let i = 1; x + i < 8 && y + i < 8; i++) {
      if (arr[x + i][y + i] != 0) {
        if (arr[x + i][y + i] * arr[x][y] < 0) {
          chooseArr[x + i][y + i] = true;
          ifSelect = true;
        }
        break;
      } else {
        chooseArr[x + i][y + i] = true;
        ifSelect = true;
      }
    }
  }//king
  else if(Math.abs(arr[x][y]) === 6) {
    // 8個可能的騎士移動位置
    const knightMoves = [
      [-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]
    ];
    
    for (let i = 0; i < knightMoves.length; i++) {
      const newX = x + knightMoves[i][0];
      const newY = y + knightMoves[i][1];
      
      // 檢查新位置是否在棋盤範圍內
      if (newX >= 0 && newX < 8 && newY >= 0 && newY < 8) {
        // 如果該位置是空白格或敵方棋子，則可以移動
        if (arr[newX][newY] * player <= 0) {
          chooseArr[newX][newY] = true;
          ifSelect = true;
        }
      }
    }
  }


  showBoard();
}



document.addEventListener("keydown", function(event) {
  if (event.key === ' ' || event.key === 'r' || event.key === 'R') {
    startGame();
  }
});

