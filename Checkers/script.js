let arr = new Array(12);
let chosen = new Array(6); 
// chosen[0]: 目前玩家 (-1: 藍方, 1: 橘方)
// chosen[2]: 目前選中的棋子位置 [i, j]
// chosen[3]: 可行步數量
// chosen[4]: 可行步位置陣列，每一項為 [i, j]
// chosen[5]: 連續吃旗標，若為 true，表示必須吃子（只允許點提示格）

function startGame() {
  let theContent = "";
  chosen[0] = Math.random() < 0.5 ? -1 : 1; // 藍方先行

  if(chosen[0]==-1){
    alert('🔵Blue goes first');
  }
  else{
    alert('🟠Red goes first');
  }

  chosen[5] = false; // 初始不處於連續吃狀態

  // 建立棋盤，使用索引 2~9 為有效區域
  for (let i = 2; i <= 9; i++) {
    arr[i] = new Array(12).fill(999);
    for (let j = 2; j <= 9; j++) {
      if (i % 2 === j % 2) {
        arr[i][j] = 0;
        theContent += `<button class="board oddBoard" id="m${i}m${j}"></button>`;
      } else {
        if (i <= 4) {
          theContent += `<button class="board evenBoard" id="m${i}m${j}">🔵</button>`;
          arr[i][j] = -1;
        } else if (i >= 7) {
          theContent += `<button class="board evenBoard" id="m${i}m${j}">🟠</button>`;
          arr[i][j] = 1;
        } else {
          theContent += `<button class="board evenBoard" id="m${i}m${j}"></button>`;
          arr[i][j] = 0;
        }
      }
    }
    theContent += "<br>";
  }
  document.getElementById("content").innerHTML = theContent;

  // 為每個格子加入點擊事件
  for (let i = 2; i <= 9; i++) {
    for (let j = 2; j <= 9; j++) {
      document.getElementById(`m${i}m${j}`).addEventListener("click", function () {
        // 若處於連續吃狀態，只有點擊提示（0.5）的格子才有反應
        if (chosen[5] && arr[i][j] !== 0.5) {
          return;
        }
        // 非連續吃狀態下，只接受己方棋子或提示（0.5）的點擊
        if (!chosen[5] && (arr[i][j] !== chosen[0] && arr[i][j] !== chosen[0] * 2 && arr[i][j] !== 0.5)) {
          return;
        }

        // ── 玩家點擊自己的棋子（非連續吃狀態） ──
        if (!chosen[5] && (arr[i][j] === chosen[0] || arr[i][j] === chosen[0] * 2)) {
          // 清除前回合留下的提示（僅清 0.5 的格子，避免影響到棋子）
          if (chosen[3] && chosen[4]) {
            for (let pos of chosen[4]) {
              if (arr[pos[0]][pos[1]] === 0.5) {
                arr[pos[0]][pos[1]] = 0;
              }
            }
          }
          let counterPlaceArr = [];
          let counterPlace = 0;
          // 輔助函數：檢查是否可捕捉（跳兩格）
          function addCaptureMove(from_i, from_j, delta_i, delta_j) {
            let mid_i = from_i + delta_i;
            let mid_j = from_j + delta_j;
            let target_i = from_i + 2 * delta_i;
            let target_j = from_j + 2 * delta_j;
            if (target_i < 2 || target_i > 9 || target_j < 2 || target_j > 9) return;
            if (
              (arr[mid_i][mid_j] === chosen[0] * -1 || arr[mid_i][mid_j] === chosen[0] * -2) &&
              Math.floor(arr[target_i][target_j]) === 0
            ) {
              counterPlaceArr[counterPlace] = [target_i, target_j];
              counterPlace++;
            }
          }
          // 輔助函數：一般移動（跳一格）
          function addNormalMove(from_i, from_j, delta_i, delta_j) {
            let target_i = from_i + delta_i;
            let target_j = from_j + delta_j;
            if (target_i < 2 || target_i > 9 || target_j < 2 || target_j > 9) return;
            if (Math.floor(arr[target_i][target_j]) === 0) {
              counterPlaceArr[counterPlace] = [target_i, target_j];
              counterPlace++;
            }
          }
          let piece = arr[i][j];
          let isKing = (piece === chosen[0] * 2);
          let forwardDelta = -chosen[0]; // 定義前進方向
          // 先加入所有捕捉移動（跳兩格）
          addCaptureMove(i, j, forwardDelta, -1);
          addCaptureMove(i, j, forwardDelta, 1);
          if (isKing) {
            addCaptureMove(i, j, -forwardDelta, -1);
            addCaptureMove(i, j, -forwardDelta, 1);
          }
          // 非連續吃狀態下，同時加入一般移動（跳一格）
          if (!chosen[5]) {
            addNormalMove(i, j, forwardDelta, -1);
            addNormalMove(i, j, forwardDelta, 1);
            if (isKing) {
              addNormalMove(i, j, -forwardDelta, -1);
              addNormalMove(i, j, -forwardDelta, 1);
            }
          }
          chosen[3] = counterPlace;
          chosen[4] = counterPlaceArr;
          chosen[2] = [i, j];
          // 將所有可行步位置標記為提示 0.5
          for (let move of chosen[4]) {
            arr[move[0]][move[1]] = 0.5;
          }
        }
        // ── 玩家點擊提示（0.5），執行移動 ──
        else if (arr[i][j] === 0.5) {
          // 清除提示
          if (chosen[3] && chosen[4]) {
            for (let pos of chosen[4]) {
              if (arr[pos[0]][pos[1]] === 0.5) {
                arr[pos[0]][pos[1]] = 0;
              }
            }
          }
          let from_i = chosen[2][0],
              from_j = chosen[2][1];
          let piece = arr[from_i][from_j];
          let moveDistance = Math.abs(i - from_i);
          let isCapture = (moveDistance === 2);
          // 若為捕捉移動（跳兩格），則移除中間的敵方棋子
          if (isCapture) {
            let mid_i = (i + from_i) / 2;
            let mid_j = (j + from_j) / 2;
            arr[mid_i][mid_j] = 0;
          }
          // 執行移動
          arr[i][j] = piece;
          arr[from_i][from_j] = 0;
          // 推廣判斷：若棋子到達對方底線則升級為王棋
          if (piece === 1 && i === 2) {
            arr[i][j] = 2;
            piece = 2;
          } else if (piece === -1 && i === 9) {
            arr[i][j] = -2;
            piece = -2;
          }
          // 如果本步是吃子，則檢查是否能連續吃
          if (isCapture) {
            let new_i = i,
                new_j = j;
            let captureMoves = [];
            function checkCapture(from_i, from_j, delta_i, delta_j) {
              let mid_i = from_i + delta_i;
              let mid_j = from_j + delta_j;
              let target_i = from_i + 2 * delta_i;
              let target_j = from_j + 2 * delta_j;
              if (target_i < 2 || target_i > 9 || target_j < 2 || target_j > 9) return;
              if (
                (arr[mid_i][mid_j] === chosen[0] * -1 || arr[mid_i][mid_j] === chosen[0] * -2) &&
                Math.floor(arr[target_i][target_j]) === 0
              ) {
                captureMoves.push([target_i, target_j]);
              }
            }
            let isKing = (piece === chosen[0] * 2);
            let forwardDelta = -chosen[0];
            checkCapture(new_i, new_j, forwardDelta, -1);
            checkCapture(new_i, new_j, forwardDelta, 1);
            if (isKing) {
              checkCapture(new_i, new_j, -forwardDelta, -1);
              checkCapture(new_i, new_j, -forwardDelta, 1);
            }
            if (captureMoves.length > 0) {
              // 還有捕捉機會時，強制連續吃
              for (let move of captureMoves) {
                arr[move[0]][move[1]] = 0.5;
              }
              chosen[3] = captureMoves.length;
              chosen[4] = captureMoves;
              chosen[2] = [new_i, new_j];
              chosen[5] = true;
            } else {
              // 無法連續吃，結束連續吃模式並切換回合
              chosen[5] = false;
              chosen[3] = 0;
              chosen[4] = [];
              chosen[2] = [];
              chosen[0] *= -1;
            }
          } else {
            // 若本步不是吃子（僅一步移動），則直接切換回合
            chosen[5] = false;
            chosen[3] = 0;
            chosen[4] = [];
            chosen[2] = [];
            chosen[0] *= -1;
          }
        }
        showBoard();
      });
    }
  }
}

function showBoard() {
  let blueCount = 0;
  let redCount = 0;

  for (let i = 2; i <= 9; i++) {
    for (let j = 2; j <= 9; j++) {
      let k = arr[i][j];
      if (k === 0.5) {
        document.getElementById(`m${i}m${j}`).innerHTML = "🔘";
      } else if (k === 1) {
        document.getElementById(`m${i}m${j}`).innerHTML = "🟠";
        redCount++;
      } else if (k === -1) {
        document.getElementById(`m${i}m${j}`).innerHTML = "🔵";
        blueCount++;
      } else if (k === 2) {
        document.getElementById(`m${i}m${j}`).innerHTML = "🔶";
        redCount++;
      } else if (k === -2) {
        document.getElementById(`m${i}m${j}`).innerHTML = "🔷";
        blueCount++;
      } else if (k === 0) {
        document.getElementById(`m${i}m${j}`).innerHTML = "";
      }
    }
  }

  // 檢查是否有玩家沒有棋子
  if (blueCount === 0) {
    setTimeout(() => {
      alert("🟠 Red Wins!");
      startGame(); // 按下確定後重新開始
    }, 100);
  } else if (redCount === 0) {
    setTimeout(() => {
      alert("🔵 Blue Wins!");
      startGame(); // 按下確定後重新開始
    }, 100);
  }
}



document.addEventListener("keydown", function (event) {
  if (event.key === "r" || event.key === "R" || event.key === " ") {
    startGame();
  }
});
