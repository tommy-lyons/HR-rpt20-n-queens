// This file is a Backbone Model (don't worry about what that means)
// It's part of the Board Visualizer
// The only portions you need to work on are the helper functions (below)

(function () {

  window.Board = Backbone.Model.extend({

    initialize: function (params) {
      if (_.isUndefined(params) || _.isNull(params)) {
        console.log('Good guess! But to use the Board() constructor, you must pass it an argument in one of the following formats:');
        console.log('\t1. An object. To create an empty board of size n:\n\t\t{n: %c<num>%c} - Where %c<num> %cis the dimension of the (empty) board you wish to instantiate\n\t\t%cEXAMPLE: var board = new Board({n:5})', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: grey;');
        console.log('\t2. An array of arrays (a matrix). To create a populated board of size n:\n\t\t[ [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...] ] - Where each %c<val>%c is whatever value you want at that location on the board\n\t\t%cEXAMPLE: var board = new Board([[1,0,0],[0,1,0],[0,0,1]])', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: grey;');
      } else if (params.hasOwnProperty('n')) {
        this.set(makeEmptyMatrix(this.get('n')));
      } else {
        this.set('n', params.length);
      }
    },

    rows: function () {
      return _(_.range(this.get('n'))).map(function (rowIndex) {
        return this.get(rowIndex);
      }, this);
    },

    togglePiece: function (rowIndex, colIndex) {
      this.get(rowIndex)[colIndex] = + !this.get(rowIndex)[colIndex];
      this.trigger('change');
    },

    _getFirstRowColumnIndexForMajorDiagonalOn: function (rowIndex, colIndex) {
      return colIndex - rowIndex;
    },

    _getFirstRowColumnIndexForMinorDiagonalOn: function (rowIndex, colIndex) {
      return colIndex + rowIndex;
    },

    hasAnyRooksConflicts: function () {
      return this.hasAnyRowConflicts() || this.hasAnyColConflicts();
    },

    hasAnyQueenConflictsOn: function (rowIndex, colIndex) {
      return (
        this.hasRowConflictAt(rowIndex) ||
        this.hasColConflictAt(colIndex) ||
        this.hasMajorDiagonalConflictAt(this._getFirstRowColumnIndexForMajorDiagonalOn(rowIndex, colIndex)) ||
        this.hasMinorDiagonalConflictAt(this._getFirstRowColumnIndexForMinorDiagonalOn(rowIndex, colIndex))
      );
    },

    hasAnyQueensConflicts: function () {
      return this.hasAnyRooksConflicts() || this.hasAnyMajorDiagonalConflicts() || this.hasAnyMinorDiagonalConflicts();
    },

    _isInBounds: function (rowIndex, colIndex) {
      return (
        0 <= rowIndex && rowIndex < this.get('n') &&
        0 <= colIndex && colIndex < this.get('n')
      );
    },


    /*
         _             _     _
     ___| |_ __ _ _ __| |_  | |__   ___ _ __ ___ _
    / __| __/ _` | '__| __| | '_ \ / _ \ '__/ _ (_)
    \__ \ || (_| | |  | |_  | | | |  __/ | |  __/_
    |___/\__\__,_|_|   \__| |_| |_|\___|_|  \___(_)

 */
    /*=========================================================================
    =                 TODO: fill in these Helper Functions                    =
    =========================================================================*/

    // ROWS - run from left to right
    // --------------------------------------------------------------
    //
    // test if a specific row on this board contains a conflict
    // var myBoard = new Board({n: 4})
    // myBoard.rows()
    // myBoard.togglePiece(1,1);

    hasRowConflictAt: function (rowIndex) {
      // what defines a rowConflict on a specific row
      // iterate over row and see if we have more than 1 1's
      var rooks = 0;
      for (let i = 0; i < this.rows()[rowIndex].length; i++) {
        if (this.rows()[rowIndex][i] === 1) {
          rooks++;
        }
      }
      return rooks > 1 ? true : false;
    },

    // test if any rows on this board contain conflicts
    hasAnyRowConflicts: function () {
      // iterate over the board and call hasRowConflictAt(rowIndex) for each row
      var found = false;
      for (let i = 0; i < this.rows().length; i++) {
        if (this.hasRowConflictAt(i)) {
          found = true; // as soon we see a single true then return turn
        }
      }
      // all must be false to return false
      return found; // otherwise return false
    },

    // COLUMNS - run from top to bottom
    // --------------------------------------------------------------
    //
    // test if a specific column on this board contains a conflict
    hasColConflictAt: function (colIndex) {
      // want to check EACH 'row array' at the given colIndex and see if theres a rook there
      // if there is a rook, then increment a counter;
      var rooks = 0;

      for (let i = 0; i < this.rows().length; i++) {
        if (this.rows()[i][colIndex] === 1) {
          rooks++;
        }
      }
      return rooks > 1 ? true : false;
    },

    // test if any columns on this board contain conflicts
    hasAnyColConflicts: function () {
      var found = false;
      for (let i = 0; i < this.rows().length; i++) {
        if (this.hasColConflictAt(i)) {
          found = true;
        }
      }
      return found;
    },
    // Major Diagonals - go from top-left to bottom-right
    // --------------------------------------------------------------
    //
    // test if a specific major diagonal on this board contains a conflict
    hasMajorDiagonalConflictAt: function (majorDiagonalColumnIndexAtFirstRow) {
      // input is the 'FRCI' of a square on the board. We want to check if there are any OTHER queens with that same FRCI
      // can do this by iterating across the entire board and increasing a counter each time we find a queen with the same FRCI value
      var firstRCI = majorDiagonalColumnIndexAtFirstRow;
      var counter = 0;

      for (let i = 0; i < this.rows().length; i++) { // i is the rowIndex;
        for (let j = 0; j < this.rows()[i].length; j++) { // j is the colIndex;
          let isQueen = this.rows()[i][j];
          let currentRCI = this._getFirstRowColumnIndexForMajorDiagonalOn(i, j);
          if ((isQueen === 1) && (firstRCI === currentRCI)) { // at each position on the board, this will check if theres a queen with same fRCI
            counter++; // and if so, increment the counter
          }
        }
      }
      return counter > 1 ? true : false; // otherwise if there aren't more than one of the same value in the array then return false
    },

    // test if any major diagonals on this board contain conflicts
    hasAnyMajorDiagonalConflicts: function () {
      // storage object for storing all unique
      var fRCIsObj = {};
      var fRCIsArr = [];

      // want to look at all FRCIs for the given board, and store to fRCIsObj array
      // for refactoring, would it help to do this for only positions that are part of a major diagonal?
      // i.e. not the corner squares, since they will never have major diagonal conflicts. How to do, if so?
      for (let i = 0; i < this.rows().length; i++) { // returns object containing all the FRCIs from the whole board stored as it's keys
        for (let j = 0; j < this.rows()[i].length; j++) {
          let currentFRCI = this._getFirstRowColumnIndexForMajorDiagonalOn(i, j);
          if (fRCIsObj[currentFRCI] === undefined) {
            fRCIsObj[currentFRCI] = true;
          }
        }
      }

      // if the return of hasMajorDiagonalConflictAt() for any of the FRCI values for the board is true,
      // then return true, otherwise return false
      fRCIsArr = Object.keys(fRCIsObj).map(Number);
      for (let i = 0; i < fRCIsArr.length; i++) {
        // debugger;
        if (this.hasMajorDiagonalConflictAt(fRCIsArr[i]) === true) {
          return true;
        }
      }
      return false;
    },

    // Minor Diagonals - go from top-right to bottom-left
    // --------------------------------------------------------------
    //
    // test if a specific minor diagonal on this board contains a conflict
    hasMinorDiagonalConflictAt: function (minorDiagonalColumnIndexAtFirstRow) {
      // same logic as the hasMajorConflict function
      var fRCI = minorDiagonalColumnIndexAtFirstRow;
      var counter = 0;

      for (let i = 0; i < this.rows().length; i++) {
        for (let j = 0; j < this.rows()[i].length; j++) {
          if (this.rows()[i][j] === 1) {
            let currentFRCI = this._getFirstRowColumnIndexForMinorDiagonalOn(i, j);
            if (currentFRCI === fRCI) {
              counter++;
            }
          }
        }
      }
      // if there are two or more queens with the same 'fRCI', return true;
      return counter > 1 ? true : false;
    },

    // test if any minor diagonals on this board contain conflicts
    hasAnyMinorDiagonalConflicts: function () {

      var fRCIsObj = {};
      var fRCIsArr = [];

      for (let i = 0; i < this.rows().length; i++) { // returns object containing all the FRCIs from the whole board stored as it's keys
        for (let j = 0; j < this.rows()[i].length; j++) {
          let currentFRCI = this._getFirstRowColumnIndexForMinorDiagonalOn(i, j);
          if (fRCIsObj[currentFRCI] === undefined) {
            fRCIsObj[currentFRCI] = true;
          }
        }
      }

      fRCIsArr = Object.keys(fRCIsObj).map(Number);

      for (let i = 0; i < fRCIsArr.length; i++) {
        if (this.hasMinorDiagonalConflictAt(fRCIsArr[i]) === true) {
          return true;
        }
      }
      return false;
    },

    /*--------------------  End of Helper Functions  ---------------------*/


  });

  var makeEmptyMatrix = function (n) {
    return _(_.range(n)).map(function () {
      return _(_.range(n)).map(function () {
        return 0;
      });
    });
  };

}());