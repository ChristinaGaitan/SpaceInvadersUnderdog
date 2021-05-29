function blastSequence(aliens,position){
  let width_n = aliens[0].length
  let height_m = position[0]

  let finalRow = height_m
  let endGame = false
  let board = createBoard(aliens, height_m, width_n)
  let modifiedBoard = createEmptyBoard(height_m, width_n)

  let shipColumn = position[1]
//   console.log('============== shipColumn', shipColumn)
  console.log('=========== board antes')
  console.log(board)
//   console.log('=========== modifiedBoard')
//   console.log(modifiedBoard)

  let turns = []

  let turn = 0
  let changeDetected = false
  let lastRowChanged = 0
  let totalAliens = getTotal(aliens)

  while (totalAliens !== 0 && lastRowChanged !== height_m) {
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

//         In the event where multiple alien ships occupy the same position and
//         the position is the target of your cannon fire,
//         the fastest alien ship will be destroyed.

//         If two ships are going at the same speed in opposite directions,
//         the ship moving to the right will be destroyed.

//         console.log('============ modifiedBoard[shipRow][shipColumn] ',  modifiedBoard[shipRow][shipColumn])
        totalAliens = totalAliens - modifiedBoard[shipRow][shipColumn].length
        modifiedBoard[shipRow][shipColumn] = []
        turns.push(turn)
        break;
      }
    }

    board = [...modifiedBoard]
    modifiedBoard = createEmptyBoard(height_m, width_n)
    console.log('=========== board turn ', turn)
    console.log(board)
//     console.log('================ totalAliens', totalAliens)

    turn++
  }


  return turns

}

function createBoard(aliens, height_m, width_n) {
  let arrayAliens = aliens[0].map(alien => [alien]);
  let board = []
  board.push([...arrayAliens])

  for (let y = 1; y <= height_m; y++) {
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
  total = aliens[0].length;

  return total;
}
