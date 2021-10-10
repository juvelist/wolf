//
// startGame(){
//   createEmptyBoard()
//   positionPlayers()
// }
//
//
// positionPlayers() {
//   positionCharacter(board, SHEEP, 1)
//   positionCharacter(board, WOLF, WOLFCOUNT)
//   positionCharacter(board, FENC, FENSCOUNT)
// }
//
// getRandomFreeCoords(board) {
//   const [x. y] = [getRandomCoords(board.cellCount), getRandomCoords(board.cellCount)]
//   if (board[x][y] === 0) {
//     return [x, y]
//   }
//   return getRandomFreeCoords(board)
// }
//
//
// positionSingleCharacter(board, CHARACTER) {
//   const [x, y] = getRandomFreeCoords(board)
//   position(....)
// }
//
// positionCharacter(board, CHARACTER, count) {
//   for(count...)
//     positionSingleCharacter(board, CHARACTER)
// }
//
//
// attackSheep(board, wolfCoord, sheepCoord) {
//   getAllPossibleDirections()
//   getLegalMoves()
//   calcMoveDistances()
//   selectMinimumDistanceMove()
//   moveWolf()
// }
//
//
// reactOnKeyboard (direction) {
//   changeShipPosiotion(direction)
//   for(wolfCount..)
//     attackSheep(wolf, )
// }
//





let boardData = {
  board: [],
  busyCells: [],
  cellCount: 7,
  sheepI: 0,
  sheepJ: 0,
  sheepID: 1,

  homeData: {
    cellI: 0,
    cellJ: 0,
    cellID: 5,
    count: 1
  },
  fencesData: {
    cellI: 0,
    cellJ: 0,
    cellID: 2,
    count: 2
  },
  wolvesData: {
    cellI: 0,
    cellJ: 0,
    cellEndID: 3,
    cellID: 4,
    count: 3
  }
}

// create table view
function createTable(data) {
  let table = document.createElement('table');
  let tableBody = document.createElement('tbody');

  data.forEach(function (rowData) {
    let row = document.createElement('tr');
    rowData.forEach(function (cellData) {
      let cell = document.createElement('td');
      cell.setAttribute('data-id', cellData);
      // cell.appendChild(document.createTextNode(cellData)); //
      row.appendChild(cell);
    });
    tableBody.appendChild(row);
  });

  table.appendChild(tableBody);
  document.getElementById('board').appendChild(table);
}

// get random position
function getRandomPosition(count) {
  return Math.floor(Math.random() * (Math.floor(count - 1) + 1));
}

const getRandomCoord = (max) => {
  return [getRandomPosition(max), getRandomPosition(max)]
}

const isBusyCell = (busyCell, x, y) => {
    const [cellI, cellJ] = busyCell.slice(0, 2)
    return cellI === x && cellJ === y
}

// create position
function createPosition(data, type) {
  const {cellCount, busyCells, board} = data

  for (let i = 0; i < type.count; i++) {
    let [cellI, cellJ] = getRandomCoord(cellCount);

    busyCells.forEach((busyCell) =>{
      while (isBusyCell(busyCell, cellI, cellJ)) {
        [cellI, cellJ] = getRandomCoord(cellCount);
      }
    });

    [type.cellI, type.cellJ] = [cellI, cellJ];
    board[type.cellI][type.cellJ] = type.cellID;
    busyCells.push([type.cellI, type.cellJ, type.cellID]);
  }
}

// create new board
function createNewBoard(data) {

  // create empty board
  for (let i = 0; i < data.cellCount; i++) {
    data.board.push([]);
    for (let j = 0; j < data.cellCount; j++) {
      data.board[i][j] = 0;
    }
  }

  // create busy cells
  data.busyCells = [];

  // create sheep position
  [data.sheepI, data.sheepJ] = getRandomCoord(data.cellCount);
  data.board[data.sheepI][data.sheepJ] = data.sheepID;
  data.busyCells.push([data.sheepI, data.sheepJ, data.sheepID]);

  // create home position
  createPosition(data, data.homeData);

  // create fences positions
  createPosition(data, data.fencesData);

  // create wolves positions
  createPosition(data, data.wolvesData);

  return data;
}

// change wolf position
function changeWolfPosition(cellData, val) {
  return cellData += Math.sign(val - cellData);
}

function getSheepNextPosition(e, data) {
  let [i, j] = [data.sheepI, data.sheepJ];

  if (e.key === 'ArrowLeft') {
    j === 0 ? j = data.cellCount - 1 : j--;
  } else if (e.key === 'ArrowUp') {
    i === 0 ? i = data.cellCount - 1 : i--;
  } else if (e.key === 'ArrowRight') {
    j === data.cellCount - 1 ? j = 0 : j++;
  } else if (e.key === 'ArrowDown') {
    i === data.cellCount - 1 ? i = 0 : i++;
  }
  return [i, j];
}

// update positions
function changePosition(e, data) {
  let isBusy = false;

  // get sheep's next coordinates [i, j]
  let [i, j] = getSheepNextPosition(e, data);

  // check sheep next step
  for(let index = 0; index < data.busyCells.length; index++) {
    let cellData = data.busyCells[index];

    if (JSON.stringify([i, j]) === JSON.stringify(cellData.slice(0, 2))) {
      if (cellData[2] === data.fencesData.cellID) {
        alert('no way to go.');

      } else if (cellData[2] === data.wolvesData.cellID) {
        data.board[data.sheepI][data.sheepJ] = 0;
        data.board[i][j] = data.wolvesData.cellEndID;
        alert('ooops..');
        break;
        /// --->

      } else if (cellData[2] === data.homeData.cellID) {
        data.board[data.sheepI][data.sheepJ] = 0;
        alert('finish!')
        data = createNewBoard(data);
        createTable(data.board);
      }

      if (cellData[2] !== data.sheepID) {
        isBusy = true;
      }
    }
  }

  for(let index = 0; index < data.busyCells.length; index++) {
    let cellData = data.busyCells[index];

    // update sheep position
    if(!isBusy) {
      data.board[data.sheepI][data.sheepJ] = 0;
      data.board[i][j] = data.sheepID;
      [data.sheepI, data.sheepJ] = [i, j];
    }

    // update wolves positions
    if(cellData[2] === data.wolvesData.cellID){

      let iW, jW;
      let iWNew = changeWolfPosition(cellData[0], i);
      let jWNew = changeWolfPosition(cellData[1], j);
      let delta = Math.abs(cellData[0] - i) - Math.abs(cellData[1] - j);

      // check wolf new positions // ?
      if (delta >= 0 && (data.board[iWNew][cellData[1]] === 0 || data.board[iWNew][cellData[1]] === 1)) {
        iW = iWNew;
        jW = cellData[1];
      } else if (delta < 0 && (data.board[cellData[0]][jWNew] === 0 || data.board[cellData[0]][jWNew] === 1)) { // ?
        iW = cellData[0];
        jW = jWNew;
      } else {
        iW = cellData[0];
        jW = cellData[1];
      }

      // replace wolf
      data.board[cellData[0]][cellData[1]] = 0;
      if(data.board[iW][jW] === data.sheepID) {
        data.board[iW][jW] = data.wolvesData.cellEndID;
        alert('ooouuuuuppsss..');
        break;
        /// --->
      }
      data.board[iW][jW] = data.wolvesData.cellID;
      data.busyCells[index] = [iW, jW, data.wolvesData.cellID];
    }
  }

  /// <---

  // update board
  document.getElementById('board').innerHTML = '';
  createTable(data.board);
  return data;
}

// create board
boardData = createNewBoard(boardData);
createTable(boardData.board);

// start moving by keydown action
document.addEventListener('keydown', function ($event) {
  if ($event.key === 'ArrowLeft' || $event.key === 'ArrowUp' || $event.key === 'ArrowRight' || $event.key === 'ArrowDown') {
    boardData = changePosition($event, boardData);
  }
});







// console.log('wolf', Math.sqrt((iW - i) ** 2 + (jW - j) ** 2));
