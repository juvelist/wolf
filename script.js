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
  sheep: {
    x: 0,
    y: 0,
    id: 1,
    count: 1
  },
  home: {
    x: 0,
    y: 0,
    id: 5,
    count: 1
  },
  fences: {
    x: 0,
    y: 0,
    id: 2,
    count: 2
  },
  wolves: {
    x: 0,
    y: 0,
    id: 4,
    idEnd: 3,
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

const isBusyCell = (busyCell, xCord, yCord) => {
    const [x, y] = busyCell.slice(0, 2);
    return x === xCord && y === yCord;
}

// create position
function createPosition(data, type) {
  const {cellCount, busyCells, board} = data;

  for (let i = 0; i < data[type].count; i++) {
    let [x, y] = getRandomCoord(cellCount);

    busyCells.forEach((busyCell) => {
      while (isBusyCell(busyCell, x, y)) {
        [x, y] = getRandomCoord(cellCount);
      }
    });

    [data[type].x, data[type].y] = [x, y];
    board[data[type].x][data[type].y] = data[type].id;
    busyCells.push([data[type].x, data[type].y, data[type].id]);
  }
}

// create new board
function createNewBoard(data) {
  const {cellCount, board} = data;

  // create empty board
  for (let i = 0; i < cellCount; i++) {
    board.push([]);
    for (let j = 0; j < cellCount; j++) {
      board[i][j] = 0;
    }
  }

  // create busy cells
  data.busyCells = [];

  // create positions
  createPosition(data, 'sheep');
  createPosition(data, 'home');
  createPosition(data, 'fences');
  createPosition(data, 'wolves');

  return data;
}

// change wolf position
function changeWolfPosition(cellData, val) {
  return cellData += Math.sign(val - cellData);
}

function getSheepNextPosition(e, data) {
  let [i, j] = [data.sheep.x, data.sheep.y];

  console.log(i, j);

  if (e.key === 'ArrowLeft') {
    j === 0 ? j = data.cellCount - 1 : j--;
  } else if (e.key === 'ArrowUp') {
    i === 0 ? i = data.cellCount - 1 : i--;
  } else if (e.key === 'ArrowRight') {
    j === data.cellCount - 1 ? j = 0 : j++;
  } else if (e.key === 'ArrowDown') {
    i === data.cellCount - 1 ? i = 0 : i++;
  }

  console.log(data.busyCells)
  return [i, j];
}

// update positions
function changePosition(e, data) {
  let isBusy = false;

  // get sheep's next coordinates [i, j]
  let [i, j] = getSheepNextPosition(e, data);

  console.log('[i, j]', [i, j]);

  // check sheep next step
  for(let index = 0; index < data.busyCells.length; index++) {
    let cellData = data.busyCells[index];

    if (JSON.stringify([i, j]) === JSON.stringify(cellData.slice(0, 2))) {
      if (cellData[2] === data.fences.id) {
        // alert('no way to go.');

      } else if (cellData[2] === data.wolves.id) {
        data.board[data.sheep.x][data.sheep.y] = 0;
        data.board[i][j] = data.wolves.idEnd;
        alert('ooops..');
        break;
        /// --->

      } else if (cellData[2] === data.home.id) {
        data.board[data.sheep.x][data.sheep.y] = 0;
        alert('finish!')
        data = createNewBoard(data);
        createTable(data.board);
      }

      if (cellData[2] !== data.sheep.id) {
        isBusy = true;
      }
    }
  }

  for(let index = 0; index < data.busyCells.length; index++) {
    let cellData = data.busyCells[index];

    // update sheep position
    if(!isBusy) {
      console.log(666, data.board)

      data.board[data.sheep.x][data.sheep.y] = 0;
      data.board[i][j] = data.sheep.id;
      [data.sheep.x][data.sheep.y] = [i, j];
      console.log(777, data.board)

    }

    // update wolves positions
    if(cellData[2] === data.wolves.id){

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
      if(data.board[iW][jW] === data.sheep.id) {
        data.board[iW][jW] = data.wolves.idEnd;
        alert('ooouuuuuppsss..');
        break;
        /// --->
      }
      data.board[iW][jW] = data.wolves.id;
      data.busyCells[index] = [iW, jW, data.wolves.id];
    }
  }

  /// <---

  // update board
  document.getElementById('board').innerHTML = '';
  createTable(data.board);
  console.log('data.board', data.board)
  return data;
}

// create board
boardData = createNewBoard(boardData);
createTable(boardData.board);
console.log(boardData.board);

// start moving by keydown action
document.addEventListener('keydown', function ($event) {
  if ($event.key === 'ArrowLeft' || $event.key === 'ArrowUp' || $event.key === 'ArrowRight' || $event.key === 'ArrowDown') {
    boardData = changePosition($event, boardData);
  }
});







// console.log('wolf', Math.sqrt((iW - i) ** 2 + (jW - j) ** 2));
