/*           _
   ___  ___ | |_   _____ _ __ ___
  / __|/ _ \| \ \ / / _ \ '__/ __|
  \__ \ (_) | |\ V /  __/ |  \__ \
  |___/\___/|_| \_/ \___|_|  |___/

*/

// hint: you'll need to do a full-search of all possible arrangements of pieces!
// (There are also optimizations that will allow you to skip a lot of the dead search space)
// take a look at solversSpec.js to see what the tests are expecting


// return a matrix (an array of arrays) representing a single nxn chessboard, with n rooks placed such that none of them can attack each other



window.findNRooksSolution = function (n) {

  // find a single valid configuration of n rooks
  var solution = undefined; //fixme
  var newBoard = new Board({ n: n });
  // new board of size n
  // iterate over the board looking for conflicts

  var looper = function (row) {
    if (row === n) {
      return newBoard.rows();
    }
    for (let col = 0; col < n; col++) {
      // set the first piece in the top left corner
      newBoard.togglePiece(row, col);
      // then check for conflicts
      // if there aren't any conflicts, then increment the row counter so as to move on
      // if there ARE conflicts, then move the rook one position right and check again?

      if (newBoard.hasAnyRooksConflicts() === false) {
        // loop again but with row++ as the new row index
        return looper(row + 1);
      }
      // if we make it here it's becuase there was a rook conflict
      newBoard.togglePiece(row, col);
    }
  };


  solution = looper(0);

  console.log('Single solution for ' + n + ' rooks:', JSON.stringify(solution));
  return solution;
};

// return the number of nxn chessboards that exist, with n rooks placed such that none of them can attack each other
window.countNRooksSolutions = function (n) {
  var solutionCount = 0;

  var newBoard = new Board({ n: n });
  // new board of size n
  // iterate over the board looking for conflicts

  var looper = function (row) {
    if (row === n) {
      solutionCount++;
    } else {

      for (let col = 0; col < n; col++) {
        // set the first piece in the top left corner
        newBoard.togglePiece(row, col);
        // then check for conflicts
        // if there aren't any conflicts, then increment the row counter so as to move on
        // if there ARE conflicts, then move the rook one position right and check again?

        if (newBoard.hasColConflictAt(col) === false) {
          // loop again but with row++ as the new row index
          looper(row + 1);
        }
        // if we make it here it's becuase there was a rook conflict
        newBoard.togglePiece(row, col);
      }
    }
  };
  // debugger;
  looper(0);
  console.log('Number of solutions for ' + n + ' rooks:', solutionCount);
  return solutionCount;
};

// return a matrix (an array of arrays) representing a single nxn chessboard, with n queens placed such that none of them can attack each other
window.findNQueensSolution = function (n) {
  var solution = undefined; //fixme

  console.log('Single solution for ' + n + ' queens:', JSON.stringify(solution));
  return solution;
};

// return the number of nxn chessboards that exist, with n queens placed such that none of them can attack each other
window.countNQueensSolutions = function (n) {
  var solutionCount = undefined; //fixme

  console.log('Number of solutions for ' + n + ' queens:', solutionCount);
  return solutionCount;
};
