function blastSequence(aliens,position){
  console.log('======== Aliens', aliens)
  console.log('======== position', position)

  let width_n = aliens[0].length
  let height_m = position[0]

  let finalRow = height_m
  let endGame = false
  let board = createBoard(aliens, height_m, width_n)
  let newBoard = createEmptyBoard(height_m, width_n)
  let totalZeros = getTotalZeros(aliens)

  let shipColumn = position[1]
//   console.log('============== shipColumn', shipColumn)
//   console.log('=========== board antes')
//   console.log(board)
//   console.log('=========== newBoard')
//   console.log(newBoard)

  let turns = []

  let turn = 0
  let lastRowChanged = 0
  let totalAliens = getTotal(aliens)

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

            if (newPositionRow === finalRow) {
              endGame = true
            }

            alien = alien * -1
          }

          if (lastRowChanged < newPositionRow) {
            lastRowChanged = newPositionRow
//             console.log('================ lastRowChanged', lastRowChanged)
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

function createBoard(aliens, height_m, width_n) {
  let board = []

  for(let i = 0; i < aliens.length; i++){
    let arrayAliens = aliens[i].map(alien => [alien]);
    board.push([...arrayAliens])
  }


  for (let y = aliens.length; y <= height_m; y++) {
    let emptyRow = []

    for (let i = 0; i < width_n; i++) {
      emptyRow.push([]);
    }

    board.push([...emptyRow]);
  }

  return board;
}

function createEmptyBoard(height_m, width_n) {
  let board = []

  for (let y = 0; y <= height_m; y++) {
    let emptyRow = []

    for (let i = 0; i < width_n; i++) {
      emptyRow.push([]);
    }

    board.push([...emptyRow]);
  }

  return board;
}

function getTotal(aliens) {
  let total = 0;
  for(let i = 0; i < aliens.length; i++){
    total = total + aliens[i].length;
  }
  console.log('============= total aliens', total)
  return total;
}

function getTotalZeros(aliens) {
  let total = 0;
  for(let i = 0; i < aliens.length; i++){
    for(let j = 0; j < aliens[i].length; j++){
      if(aliens[i][j] === 0) {
        total++;
      }
    }
  }
  console.log('============= total ceros', total)
  return total;
}

function flatten(array) {
  return array.reduce(function (flat, toFlatten) {
    return flat.concat(Array.isArray(toFlatten) ? flatten(toFlatten) : toFlatten);
  }, []);
}
