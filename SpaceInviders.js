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
//   console.log('=========== board antes')
//   console.log(board)


  let turn = 0
  let turns = []
  let lastRowChanged = 0

  while ((totalAliens !== 0 && totalAliens !== totalZeros) && lastRowChanged !== height_m) {
//     console.log('================ totalAliens', totalAliens)
//     console.log('================ lastRowChanged', lastRowChanged)
//     console.log('================ height_m', height_m)

    // TODO: Calculate the last row changed without using this variable
    lastRowChanged = 0
    for (let row = 0; row < height_m; row++) {
      let originalRow = board[row]

      for (let column = 0; column < width_n; column++) {
        let aliensArray = originalRow[column]

        for (let i = 0; i < aliensArray.length; i++) {
          let alien = aliensArray[i]
          let newPositionRow = row
          let newPositionColumn = column + alien

          if(newPositionColumn < 0 || newPositionColumn >= width_n) {
            newPositionRow = newPositionRow + 1

            if(newPositionColumn < 0) {
              newPositionColumn = (newPositionColumn + 1) * -1
            }


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
        }
      }
    }

    for (let shipRow = height_m-1; shipRow >= 0; shipRow--) {
      if(newBoard[shipRow][shipColumn].length !== 0) {


//         console.log('============= Aliens to destroy', newBoard[shipRow][shipColumn])
        let maxAlien = Math.max.apply(null, newBoard[shipRow][shipColumn].map(Math.abs));
//         console.log('============= maxAlien', maxAlien)

        if(maxAlien !== 0) {
//           totalAliens = totalAliens - 1

          // Obtener el valor mayor del array sin importar el signo
          // Verificar si existe el numero en positivo
          // Si no existe el numero en positivo, buscarlo en negativo
          let positionToEliminate = newBoard[shipRow][shipColumn].findIndex(a => a === maxAlien)
//           console.log('================== Position to eliminate UNO: ', positionToEliminate)

          if(positionToEliminate === -1){
            positionToEliminate = newBoard[shipRow][shipColumn].findIndex(a => a === (maxAlien * -1))
//             console.log('================== Position to eliminate DOS: ', positionToEliminate)
          }
//           console.log('================== Position to eliminate FINAL: ', positionToEliminate)

          newBoard[shipRow][shipColumn].splice(positionToEliminate, 1)
          // newBoard[shipRow][shipColumn] = []
          turns.push(turn)

          console.log('=============== turns', turns)
          break;
        }

      }
    }

    board = [...newBoard]
    totalAliens = flatten(board).length
    newBoard = createEmptyBoard(height_m, width_n)
    turn++
  }


  return lastRowChanged === height_m ? null : turns

}

function createBoard(aliens, height, width) {
  let board = []

  for(let i = 0; i < aliens.length; i++){
    let arrayAliens = aliens[i].map(alien => [alien]);
    board.push([...arrayAliens])
  }

  for (let y = aliens.length; y <= height; y++) {
    let emptyRow = creatEmptyRow(width)

    board.push([...emptyRow]);
  }

  return board;
}

function createEmptyBoard(height, width) {
  let board = []

  for (let y = 0; y <= height; y++) {
    let emptyRow = creatEmptyRow(width)
    board.push([...emptyRow]);
  }

  return board;
}

function creatEmptyRow(rowWidth) {
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
