function blastSequence(aliens,position){
  console.log('======== Aliens', aliens)
  console.log('======== position', position)

  let width_n = aliens[0].length
  let height_m = position[0]

  let board = createBoard(aliens, height_m, width_n)
  let newBoard = createEmptyBoard(height_m, width_n)

  let flattenAliens = flatten(aliens)
  let totalAliens = flattenAliens.length
  let totalZeros = flattenAliens.filter(value => value === 0).length


  let shipColumn = position[1]
//   console.log('============== shipColumn', shipColumn)
  console.log('=========== board antes')
  console.log(board)


  let turn = 0
  let turns = []
  let lastRowChanged = 0

  while ((totalAliens !== 0 && totalAliens !== totalZeros) && lastRowChanged !== height_m) {
//     console.log('================ totalAliens', totalAliens)
//     console.log('================ lastRowChanged', lastRowChanged)
//     console.log('================ height_m', height_m)

    lastRowChanged = 0
    for (let row = 0; row < height_m; row++) {
      let originalRow = board[row]

      for (let column = 0; column < width_n; column++) {
        let aliensArray = originalRow[column]

        aliensArray.forEach(alien => {
          let newPositionRow = row
          let newPositionColumn = column + alien

          // Alien bajará una fila
          if(newPositionColumn < 0 || newPositionColumn >= width_n) {
            newPositionRow = newPositionRow + 1

            // Alien bajó por la izquierda
            if(newPositionColumn < 0) {
              newPositionColumn = (newPositionColumn + 1) * -1
            }

            // Alien bajó por la derecha
            if(newPositionColumn >= width_n) {
              let availableSpace = width_n - column
              let remaining = alien - availableSpace
              newPositionColumn = width_n - 1 - remaining
            }

            alien = alien * -1
          }

          if (lastRowChanged < newPositionRow) {
            lastRowChanged = newPositionRow
          }

          newBoard[newPositionRow][newPositionColumn].push(alien)
        })
      }
    }

    alienDeleted(newBoard,lastRowChanged, shipColumn) ? turns.push(turn) : null

    board = [...newBoard]
    totalAliens = flatten(board).length
    newBoard = createEmptyBoard(height_m, width_n)
    turn++
  }


  return lastRowChanged === height_m ? null : turns

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

function flatten(array) {
  return array.reduce(function (flat, toFlatten) {
    return flat.concat(Array.isArray(toFlatten) ? flatten(toFlatten) : toFlatten);
  }, []);
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
