let gameList = ['Checkers','Minesweeper','Chess'];


function showHomePage(){
  let save = "";
  for(let i = 0 ; i<gameList.length ; i++){
    save += 
    `
    <div class="game-card" onclick="location.href='${gameList[i]}/index.html'">
      <img src="images/${gameList[i]}.jpg" alt="${gameList[i]}">
      <h2>${gameList[i]}</h2>
    </div>
    `;
  }
  document.getElementById('content').innerHTML = save;
}

showHomePage();