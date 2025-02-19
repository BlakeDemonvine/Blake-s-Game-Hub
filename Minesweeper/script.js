//16x16 bomb:40
let arr;
let clicked = false;
let n;
let m;
let bomb;
let bombplace;
let previousTime;
let digValue = 0;

const handler = {
  set(target, key, value) {
      if (key === "value" && value > target[key]) {
        console.log(dig.value);
          if(dig.value === n*m-bomb-1){
            loseAndReload('You Win!','Play Again');
          }
      }
      target[key] = value;
      return true;
  }
};

const dig = new Proxy({ value: digValue }, handler);

function chooseBoard(input){
  if(input==='show'){
    document.getElementById('placeToShow').innerHTML = 
    `<div id="placeToShow"><br>
    <p>Board length:</p>
    <input type="number" value="16" id ="bx" oninput="this.value = this.value.replace(/[^0-9]/g, '')"></input>
    <p>Board width:</p>
    <input type="number" value="16" id ="by" oninput="this.value = this.value.replace(/[^0-9]/g, '')"></input>
    <p>Number of Bombs:</p>
    <input type="number" value="40" id ="bn" oninput="this.value = this.value.replace(/[^0-9]/g, '')"></input>
    <p class="showChooseBoard" onclick="chooseBoard('hide')">hide settings</p></div>
    </div>`;
  }
  else if(input === 'hide'){
    document.getElementById('placeToShow').innerHTML = `<div id="placeToShow"><p class="showChooseBoard" onclick="chooseBoard('show')">Settings</p></div>`;
  }
  
}
function startGame(x,y){
  clicked = true;
  dig.value = 0;
  previousTime = Date.now();
  arr = new Array(n+2);
  for (let i = 0; i < n+2; i++) {
    arr[i] = new Array(m+2).fill(0);
  }
  bombplace = new Array(bomb);
  for(let idx = 0; idx < bomb; idx++) {
    let i = Math.floor(Math.random() * (n-1)) + 1;
    let j = Math.floor(Math.random() * (m-1)) + 1;
    let b = false;
  
    for (let I = -1; I <= 1; I++) {
      for (let J = -1; J <= 1; J++) {
        if (i === x + I && j === y + J || arr[i][j] === -1) {
          b = true;
          break;
        }
      }
      if (b) break;
    }
  
    if (b) {
      idx--;
    } else {
      bombplace[idx] = new Array(2);
      bombplace[idx][0] = i;
      bombplace[idx][1] = j;
      arr[i][j] = -1;
    }
  }  
  for(let i = 1 ; i<=n ; i++){
    for(let j = 1 ; j<=m ; j++){
      if(arr[i][j]===-1){
        continue;
      }
      else{
        let count = 0;
        for (let di = -1; di <= 1; di++) {
          for (let dj = -1; dj <= 1; dj++) {
            if (arr[i + di][j + dj] === -1) {
              count++;
            }
          }
        }
        arr[i][j] = count;
      }
    }
  }

}

function openAll(x, y) {
  
  if (document.getElementById(`m${x}m${y}`).textContent !== "") {
    return;
  }
  dig.value++;
  addClass(x,y,"normalmine");
  document.getElementById(`m${x}m${y}`).textContent = ' ';

  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      if (i === 0 && j === 0) {
        continue;
      }

      let newX = x + i;
      let newY = y + j;

      if (newX >= 1 && newX <= n && newY >= 1 && newY <= m && document.getElementById(`m${newX}m${newY}`).textContent === "") {
        if (arr[newX][newY] === 0) {
          openAll(newX, newY);
        } else {
          dig.value++;
          addClass(newX,newY,"normalmine");
          document.getElementById(`m${newX}m${newY}`).textContent = arr[newX][newY].toString();
        }
      }
    }
  }
}

function addClass(i , j , name){
  if(i%2 === j%2){
    document.getElementById(`m${i}m${j}`).classList.remove('oddmine');
  }
  else{
    document.getElementById(`m${i}m${j}`).classList.remove('evenmine');
  }
  document.getElementById(`m${i}m${j}`).classList.add(name);
}

function loseAndReload(outcome , input) {
  let ansTime;
  let timeSpent = (Date.now() - previousTime) / 1000; // 轉換為秒
  timeSpent = Math.round(timeSpent * 10) / 10; // 四捨五入到小數點後一位

  const minutes = Math.floor(timeSpent / 60);
  const seconds = timeSpent % 60; // 取餘數，獲得剩餘秒數

  if (minutes > 0) {
      ansTime =  `${minutes}m ${seconds.toFixed(1)}s`;
  }
  else {
      ansTime = `${seconds.toFixed(1)}s`;
  }
  document.getElementById("overlay").style.display = "block";
  
  document.getElementById("buttonHere").innerHTML = `<h1>${outcome}</h1><p class="showTime">⏱:${ansTime}</p><button class="forClick" id="reloadButton">${input}</button><br><button class="forClick" id="resetButton">Reload</button>`;
  document.getElementById("buttonHere").style.display = "block";
  
  document.getElementById("reloadButton").addEventListener("click", function() {
    clicked = false;
    loadPage('minesweep','reset');
  });

  document.getElementById("resetButton").addEventListener("click", function() {
    location.reload()
  });

  
}

function showAllBomb(){
  for(let i = 0 ; i<bomb ; i++){
    document.getElementById(`m${bombplace[i][0]}m${bombplace[i][1]}`).textContent = "💣";
  }
}

function feature(x,y){
  let nearBy = 0;
  let notBomb=0;
  for(let i = -1 ; i<=1 ; i++){
    for(let j = -1 ; j<=1 ; j++){
      if(i===0 && j===0){
        continue;
      }
      else if(x+i===0 || y+j===0 || x+i===n+1 || y+j===m+1){
        continue;
      }
      if(document.getElementById(`m${x+i}m${y+j}`).textContent==="🚩"){
        nearBy++;
        if(arr[x+i][y+j]!==-1){
          notBomb++;
        }
      }
    }
  }
  let wrongBombs = new Array(notBomb);
  let idx = 0;
  if(nearBy === arr[x][y]){
    for(let i = -1 ; i<=1 ; i++){
      for(let j = -1 ; j<=1 ; j++){
        if(i===0 && j===0){
          continue;
        }
        else if(x+i===0 || y+j===0 || x+i===n+1 || y+j===m+1){
          continue;
        }
        else if(document.getElementById(`m${x+i}m${y+j}`).textContent==="🚩" && arr[x+i][y+j]===-1){
          continue;
        }
        else if(document.getElementById(`m${x+i}m${y+j}`).textContent===" " || document.getElementById(`m${x+i}m${y+j}`).textContent===""){
          if(arr[x+i][y+j]){
            dig.value++;
            document.getElementById(`m${x+i}m${y+j}`).textContent = arr[x+i][y+j].toString();
          }
          else{
            openAll(x+i,y+j);
            document.getElementById(`m${x+i}m${y+j}`).textContent = " ";
          }
          addClass(x+i,y+j,"normalmine");
        }
        else{
          wrongBombs[idx] = new Array(2);
          wrongBombs[idx][0] = x+i;
          wrongBombs[idx][1] = y+j;
          idx++;
        }
      }
    }
    if(notBomb){
      setTimeout(function() {
        loseAndReload('You lose','Try Again');
      }, 250);
    }

    for(let i = 0 ; i<notBomb ; i++){
      document.getElementById(`m${wrongBombs[i][0]}m${wrongBombs[i][1]}`).textContent = "💣";
      addClass(wrongBombs[i][0],wrongBombs[i][1],"bomb");
      showAllBomb();
    }
  }
}

function loadPage(page,from){
  if(from === 'start'){
    try {
      n = document.getElementById("bx").value;
      m = document.getElementById("by").value;
      bomb = document.getElementById("bn").value;
    }
    catch (error) {
      n = 16;
      m = 16;
      bomb = 40;
    }
    
  }
  let save = '<div id="overlay"></div><div id="buttonHere"></div>';
  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= m; j++) {
        save+=`<button id="m${i}m${j}" class="mine"></button>`;      
    }
    save+="<br>";
  }
  document.getElementById('content').innerHTML = save;

  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= m; j++) {
      if(i%2 === j%2){
        document.getElementById(`m${i}m${j}`).classList.add('oddmine');
      }
      else{
        document.getElementById(`m${i}m${j}`).classList.add('evenmine');
      }
      

        document.getElementById(`m${i}m${j}`).addEventListener("click", function() {
          if(!clicked){
            startGame(i,j);
          }
          if(document.getElementById(`m${i}m${j}`).textContent === "🚩"){
            document.getElementById(`m${i}m${j}`).textContent = '';
          }
          else if(document.getElementById(`m${i}m${j}`).textContent == ''){
            if(arr[i][j] === -1){
              setTimeout(function() {
                loseAndReload('You Lose','Try Again');
              }, 250);
              document.getElementById(`m${i}m${j}`).textContent = "💣";
              addClass(i,j,"bomb");
              showAllBomb();
            }
            else{
              if(arr[i][j] === 0) {
                openAll(i,j);
              }
              else{
                dig.value++;
                document.getElementById(`m${i}m${j}`).textContent = arr[i][j].toString();
                addClass(i,j,"normalmine");
              }
            }
          }
          else if(document.getElementById(`m${i}m${j}`).textContent == arr[i][j]){
            feature(i,j);
          }
        });
        document.getElementById('content').addEventListener("contextmenu", function(event) {
          if (event.target.classList.contains("mine") && event.target.textContent=='') {
            event.target.textContent = "🚩";
          }
          event.preventDefault();
        });                
    }
  }

}



document.addEventListener("keydown", function(event) {
  if (event.key === "r" || event.key === "R") {
    clicked = false;
    loadPage('minesweep','reset');
  }
});


let iferror = false;
let pressed = false;
let table;
document.addEventListener("keydown", function(event) {
  if (event.key === " " && pressed === false) {
    pressed = true;
    table = new Array(n);
    for(let i = 1 ; i<=n ; i++){
      table[i-1] = new Array(m);
      //0 nothing 1 something 2 flag
      for(let j = 1 ; j<=m ; j++){
        try {
          if(document.getElementById(`m${i}m${j}`).textContent == '' || document.getElementById(`m${i}m${j}`).textContent == ' '){
            table[i-1][j-1] = 0;
          }
          else if(document.getElementById(`m${i}m${j}`).textContent === '🚩'){
            table[i-1][j-1] = 2;
          }
          else{
            table[i-1][j-1] = 1;
          }

          if(arr[i][j] === -1){
            document.getElementById(`m${i}m${j}`).textContent = "💣";
          }
          else if(arr[i][j] === 0){
            document.getElementById(`m${i}m${j}`).textContent = "";
          }
          else{
            document.getElementById(`m${i}m${j}`).textContent = arr[i][j].toString();
          }
        }
        catch (error) {
          iferror = true;
          alert('You have to at least click on one button to see the answer.');
          break;
        }
      }
      if(iferror) break;
    }
    
  }
});

document.addEventListener("keyup", function(event2) {
  if (event2.key === " " && pressed === true) {
    pressed = false;
    for(let i = 1 ; i<=n ; i++){
      for(let j = 1 ; j<=m ; j++){
        if(table[i-1][j-1]===0){
          document.getElementById(`m${i}m${j}`).textContent = "";
        }
        else if(table[i-1][j-1]===1){
          document.getElementById(`m${i}m${j}`).textContent = arr[i][j].toString();
        }
        else if(table[i-1][j-1]===2){
          document.getElementById(`m${i}m${j}`).textContent = "🚩";
        }
      }
    }
  }
});