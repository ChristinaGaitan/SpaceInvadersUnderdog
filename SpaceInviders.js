function blastSequence(aliens,position){
  let boardWidth = aliens[0].length
  let boardHeight = position[0]

  let board = createBoard(aliens, boardHeight, boardWidth)
  let newBoard = createEmptyBoard(boardHeight, boardWidth)

  let flattenAliens = flatten(aliens)
  let totalAliens = flattenAliens.length
  let totalZeros = flattenAliens.filter(value => value === 0).length

  let shipColumn = position[1]

  let turn = 0
  let turns = []
  let lastRowChanged = 0

  while ((totalAliens !== 0 && totalAliens !== totalZeros) && lastRowChanged !== boardHeight) {
    lastRowChanged = 0

    for (let row = 0; row < boardHeight; row++) {
      let originalRow = board[row]

      for (let column = 0; column < boardWidth; column++) {
        let aliensArray = originalRow[column]

        aliensArray.forEach(alien => {
          let newRow = row
          let newColumn = column + alien

          // Alien bajará una fila
          if(newColumn < 0 || newColumn >= boardWidth) {
            newRow = newRow + 1

            // Alien bajó por la izquierda
            if(newColumn < 0) {
              newColumn = (newColumn * -1) - 1
            }

            // Alien bajó por la derecha
            if(newColumn >= boardWidth) {
              let availableSpace = (boardWidth - 1) - column
              let remaining = alien - availableSpace
              newColumn = boardWidth - remaining
            }

            alien = alien * -1
          }

          if (lastRowChanged < newRow) {
            lastRowChanged = newRow
          }

          newBoard[newRow][newColumn].push(alien)
        })
      }
    }

    alienDeleted(newBoard,lastRowChanged, shipColumn) ? turns.push(turn) : null

    board = [...newBoard]
    totalAliens = flatten(board).length
    newBoard = createEmptyBoard(boardHeight, boardWidth)
    turn++
  }


  return lastRowChanged === boardHeight ? null : turns
}

function createBoard(aliens, height, width) {
  let board = []

  aliens.forEach(aliensRow => {
    let arrayAliens = aliensRow.map(alien => [alien]);
    board.push([...arrayAliens])
  })

  for (let y = aliens.length; y <= height; y++) {
    let emptyRow = createEmptyRow(width)

    board.push([...emptyRow]);
  }

  return board;
}

function createEmptyBoard(height, width) {
  let board = []

  for (let y = 0; y <= height; y++) {
    let emptyRow = createEmptyRow(width)
    board.push([...emptyRow]);
  }

  return board;
}

function createEmptyRow(rowWidth) {
  let emptyRow = []

  for (let i = 0; i < rowWidth; i++) {
    emptyRow.push([]);
  }

  return emptyRow;
}

function alienDeleted(newBoard, lastRowChanged, shipColumn) {
  for (let shipRow = lastRowChanged; shipRow >= 0; shipRow--) {
    let boardRow = newBoard[shipRow][shipColumn]

    if(boardRow.length === 0) continue;

    // Obtener el valor máximo absoluto
    let maxAlien = Math.max.apply(null, boardRow.map(Math.abs));

    // Cuando hay un 0 en el blanco no cuenta el tiro
    if(maxAlien !== 0) {

      // Obtener el index del valor máximo absoluto
      let positionToEliminate = boardRow.findIndex(a => a === maxAlien)

      // Si no se encuentra el valor en positivo, buscar el indice del número en negativo
      if(positionToEliminate === -1){
        positionToEliminate = boardRow.findIndex(a => a === (maxAlien * -1))
      }

      // Eliminar el alien del board
      boardRow.splice(positionToEliminate, 1)

      return true
    }

  }

  return false
}

function flatten(array) {
  return array.reduce(function (flat, toFlatten) {
    return flat.concat(Array.isArray(toFlatten) ? flatten(toFlatten) : toFlatten);
  }, []);
}
