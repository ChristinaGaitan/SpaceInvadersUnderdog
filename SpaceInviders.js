function blastSequence(aliens,position){
  console.log('======== Aliens', aliens)
  console.log('======== position', position)

  let width_n = aliens[0].length
  let height_m = position[0]

  let finalRow = height_m
  let endGame = false
  let board = createBoard(aliens, height_m, width_n)
  let modifiedBoard = createEmptyBoard(height_m, width_n)
  let totalZeros = getTotalZeros(aliens)

  let shipColumn = position[1]
//   console.log('============== shipColumn', shipColumn)
//   console.log('=========== board antes')
//   console.log(board)
//   console.log('=========== modifiedBoard')
//   console.log(modifiedBoard)

  let turns = []

  let turn = 0
  let changeDetected = false
  let lastRowChanged = 0
  let totalAliens = getTotal(aliens)

  while ((totalAliens !== 0 && totalAliens !== totalZeros) && lastRowChanged !== height_m) {
//     console.log('================ totalAliens', totalAliens)
//     console.log('================ lastRowChanged', lastRowChanged)
//     console.log('================ height_m', height_m)
    lastRowChanged = 0
    for (let row = 0; row < height_m; row++) {
      let originalRow = board[row]

      for (let column = 0; column < width_n; column++) {

        let originalAlienArray = originalRow[column]
        for (let k = 0; k < originalAlienArray.length; k++) {
          let alien = originalAlienArray[k]
          let nuevaPosicionRow = row
          let nuevaPosicionColumn = column + alien

          if(nuevaPosicionColumn < 0 || nuevaPosicionColumn >= width_n) {
            nuevaPosicionRow = nuevaPosicionRow + 1

            if(nuevaPosicionColumn < 0) {
              nuevaPosicionColumn = (nuevaPosicionColumn + 1) * -1
            }


            if(nuevaPosicionColumn >= width_n) {
              let espacioDisponible = width_n - column
              let restante = alien - espacioDisponible
              nuevaPosicionColumn = width_n - 1 - restante
            }

            if (nuevaPosicionRow === finalRow) {
              endGame = true
            }

            alien = alien * -1
          }

          if (lastRowChanged < nuevaPosicionRow) {
            lastRowChanged = nuevaPosicionRow
//             console.log('================ lastRowChanged', lastRowChanged)
          }

          modifiedBoard[nuevaPosicionRow][nuevaPosicionColumn].push(alien)
        }
      }
    }

    for (let shipRow = height_m-1; shipRow >= 0; shipRow--) {
      if(modifiedBoard[shipRow][shipColumn].length !== 0) {


//         console.log('============= Aliens to destroy', modifiedBoard[shipRow][shipColumn])
        let maxAlien = Math.max.apply(null, modifiedBoard[shipRow][shipColumn].map(Math.abs));
//         console.log('============= maxAlien', maxAlien)

        if(maxAlien !== 0) {
          totalAliens = totalAliens - 1

          // Obtener el valor mayor del array sin importar el signo
          // Verificar si existe el numero en positivo
          // Si no existe el numero en positivo, buscarlo en negativo
          let positionToEliminate = modifiedBoard[shipRow][shipColumn].findIndex(a => a === maxAlien)
//           console.log('================== Position to eliminate UNO: ', positionToEliminate)

          if(positionToEliminate === -1){
            positionToEliminate = modifiedBoard[shipRow][shipColumn].findIndex(a => a === (maxAlien * -1))
//             console.log('================== Position to eliminate DOS: ', positionToEliminate)
          }
//           console.log('================== Position to eliminate FINAL: ', positionToEliminate)

          modifiedBoard[shipRow][shipColumn].splice(positionToEliminate, 1)
          // modifiedBoard[shipRow][shipColumn] = []
          turns.push(turn)

          console.log('=============== turns', turns)
          break;
        }

      }
    }

    board = [...modifiedBoard]
    modifiedBoard = createEmptyBoard(height_m, width_n)
//     console.log('=========== board turn ', turn)
//     console.log(board)
//     console.log('================ totalAliens', totalAliens)

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
