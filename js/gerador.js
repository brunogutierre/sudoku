Math.shuffle = function(lista){
  listaNova = [];

  while (lista.length > 0){
    pos = Math.floor(Math.random() * lista.length);
    listaNova[listaNova.length] = lista.splice(pos,1)[0];
  }

  return listaNova;
}

Array.clone = function(lista){
  listaClone = [];

  for (var i = 0; i < lista.length; i++)
    listaClone[i] = lista[i];

  return listaClone;
}

//Validado
function posfor(x, y, axis){
  if (!axis)
    axis = 0;

  if (axis == 0)
    return (x * 9) + y;
  else if (axis == 1)
    return (y * 9) + x;
  else
    return [0,3,6,27,30,33,54,57,60][x] + [0,1,2,9,10,11,18,19,20][y];
}

//Validado
function axismissing(board, x, axis){
  bits = 0;

  for (var y = 0; y < 9; y++){
    e = board[posfor(x, y, axis)];

    if (e != -1)
      bits |= 1 << e
  }

  return 511 ^ bits
}

function figurebits(board){
  allowed = [];
  needed = [];

  for (var i = 0; i < board.length; i++)
    allowed[allowed.length] = (board[i] == -1)? 511 : 0;

  for (var axis = 0; axis < 3; axis++){
    for (var x = 0; x < 9; x++){
      bits = axismissing(board, x, axis);
      needed[needed.length] = bits;

      for (var y = 0; y < 9; y++)
        allowed[posfor(x, y, axis)] &= bits;
    }
  }

  return [allowed, needed]
}

//Validado
function listbits(bits){
  lista = [];

  for (var y = 0; y < 9; y++){
    if (0 != (bits & (1 << y)))
      lista[lista.length] = y;
  }

  return lista;
}

function pickbetter(b, c, t){
  if (b.length == 0 || t.length < b.length)
    return [t, 1];
  if (t.length > b.length)
    return [b, c];
  if (Math.floor(Math.random() * c) == 0)
    return [t, c + 1];
  else
    return [b, c + 1];
}

function boardmatches(b1, b2){
  for (var i = 0; i < 81; i++){
    if (b1[i] != b2[i])
      return false;
  }

  return true;
}

function deduce(board){
  while (true){
    stuck = true;
    guess = [];
    count = 0;

    tempFigure = figurebits(board);

    allowed = tempFigure[0];
    needed = tempFigure[1];

    for (var pos = 0; pos < 81; pos++){
      if (-1 == board[pos]){
        numbers = listbits(allowed[pos]);

        if (numbers.length == 0)
          return [];
        else if (numbers.length == 1){
          board[pos] = numbers[0];
          stuck = false;
        }
        else if (stuck){
          other = [];

          for (var i = 0; i < numbers.length; i++)
            other[other.length] = [pos, numbers[i]];

          tempBetter = pickbetter(guess, count, other);

          guess = tempBetter[0];
          count = tempBetter[1];
        }
      }
    }

    if (!stuck){
      tempbits = figurebits(board);

      allowed = tempbits[0];
      needed = tempbits[1];
    }

    for (var axis = 0; axis < 3; axis++){
      for (var x = 0; x < 9; x++){
        numbers = listbits(needed[axis * 9 + x]);

        for (var nn = 0; nn < numbers.length; nn++){
          n = numbers[nn];

          bit = 1 << n;
          spots = [];

          for (var y = 0; y < 9; y++){
            pos = posfor(x, y, axis);

            if (allowed[pos] & bit)
              spots[spots.length] = pos;
          }

          if (spots.length == 0)
            return [];
          else if (spots.length == 1){
            board[spots[0]] = n;
            stuck = false;
          }
          else if (stuck){
            other = [];

            for (var l = 0; l < spots.length; l++)
              other[other.length] = [spots[l], n];

            tempBetter = pickbetter(guess, count, other);

            guess = tempBetter[0];
            count = tempBetter[1];
          }
        }
      }
    }

    if (stuck){
      if (guess.length != 0)
        guess = Math.shuffle(guess);

      return guess;
    }
  }
}

function solvenext(remembered){
  while (remembered.length > 0){
    tempRem = remembered.pop();
    //doLog(tempRem + '');

    guesses = tempRem[0];
    c = tempRem[1];
    board = tempRem[2];

    if (c < guesses.length){
      remembered[remembered.length] = [guesses, c + 1, board];
      workspace = Array.clone(board);

      pos = guesses[c][0];
      n = guesses[c][1];

      workspace[pos] = n;
      guesses = deduce(workspace);

      if (guesses.length == 0)
        return [remembered, workspace];

      remembered[remembered.length] = [guesses, 0, workspace];
    }
  }

  return [[],-1];
}

function solveboard(original){
  board = Array.clone(original);
  guesses = deduce(board);

  //doLog(guesses);
  if (guesses.length == 0)
    return [[], board];

  track = [[guesses, 0, board]];
  return solvenext(track);
}

function checkpuzzle(puzzle, board){
  if (!board)
    board = [];

  tempSolve = solveboard(puzzle);

  state = tempSolve[0];
  answer = tempSolve[1];

  if (answer.length == 0)
    return -1;
  if (board.length != 0 && !boardmatches(board, answer))
    return -1;

  difficulty = state.length;

  tempNext = solvenext(state);

  state = tempNext[0];
  second = tempNext[1];

  if (second.length != 0)
    return -1;

  return difficulty;
}

function boardforentries(entries){
  board = [];

  //doLog(entries);
  for (var i = 0; i < 81; i++)
    board[i] = -1;
  for (var l = 0; l < entries.length; l++){
    entrie = entries[l];
    board[entrie[0]] = entrie[1];
  }

  return board;
}

function solution(board){
  return solveboard(board)[1];
}

function makepuzzle(board){
  //doLog(board);
  puzzle = [];
  deduced = [];
  order = [];

  for (var i = 0; i < 81; i++){
    deduced[i] = -1;
    order[i] = i;
  }

  order = Math.shuffle(order);
  //doLog(order);

  for (var l = 0; l < order.length; l++){
    if (deduced[order[l]] == -1){
      puzzle[puzzle.length] = [order[l], board[order[l]]];
      //doLog(Array.clone(puzzle));
      deduced[order[l]] = board[order[l]]

      deduce(deduced);
    }
  }

  //doLog(puzzle);
  puzzle = Math.shuffle(puzzle);

  for (var m = puzzle.length; m > -1; m--){
    e = puzzle.splice(m,1);
    rating = checkpuzzle(boardforentries(puzzle), board);

    if (rating == -1)
      puzzle[puzzle.length] = e;
  }

  return boardforentries(puzzle);
}

function ratepuzzle(puzzle, samples){
  total = 0;

  for (var i = 0; i < samples; i++){
    tempSolve = solveboard(puzzle);

    state = tempSolve[0];
    answer = tempSolve[1];

    if (answer.length == 0)
      return -1;

    total += state.length;
  }

  return total / samples;
}

function gerarSudoku(){
  temp = [];

  for (var i = 0; i < 81; i++)
    temp[i] = -1;

  sol = solution(temp);
  puzzles = [makepuzzle(sol)];

  for (var l = 0; l < puzzles.length; l++){
    return [puzzles[l], ratepuzzle(puzzles[l], 4)];
  }
}