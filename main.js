var timer;                      // interval variable
var timerInterval = 1000;       // interval in ms
var matrixLength = 40;          // number of cells in rows/columns in the square matrix

$(document).ready(function(){
    
    $('#mainTable').height($('#mainTable').width())

    $(window).resize(function(){
        $('#mainTable').height($('#mainTable').width())
    })

    fillBlankPage();

    //#region Click and change events

    // shows the next genearation
    $('#btnNextStep').click(function(){
        generateNextStep();
    });

    // starts the timer
    $('#btnStart').click(function(){

        timer = setInterval(generateNextStep, timerInterval);

        $('#btnStart').attr('disabled', true);
        $('#btnStop').attr('disabled', false);
        $('#btnNextStep').attr('disabled', true);
        $('#inputTimeInterval').attr('disabled', true);

    });

    // stops the timer
    $('#btnStop').click(function(){

        clearInterval(timer);

        $('#btnStop').attr('disabled', true);
        $('#btnStart').attr('disabled', false);
        $('#btnNextStep').attr('disabled', false);
        $('#inputTimeInterval').attr('disabled', false);

    });

    // clears the matrix
    $('#btnClear').click(function(){

        clearInterval(timer);
        fillBlankPage();

        $('#btnStop').attr('disabled', true);
        $('#btnStart').attr('disabled', false);
        $('#btnNextStep').attr('disabled', false);
        $('#inputTimeInterval').attr('disabled', false);

    });

    $('#inputTimeInterval').change(function(){
        timerInterval = $(this).val();
    });

    //#endregion

    $('#inputTimeInterval').val(timerInterval);

});

// creates the square matrix
function fillBlankPage(){

    $('#mainTable > tbody').empty();

    for(let i=0; i<matrixLength; i++){
        $('#mainTable > tbody').append('<tr id="row_' + i + '"></tr>');

        for(let j=0; j<matrixLength; j++){
            $('#row_' + i).append('<td id="row_' + i + '_column_'+j+'" class="cell death-cell"></td>');
        }
    }

    // makes the cell death/alive by clicking on it
    $('.cell').click(function(){
        if($(this).hasClass('death-cell')){
            $(this).removeClass('death-cell');
            $(this).addClass('alive-cell');
        }
        else if($(this).hasClass('alive-cell')){
            $(this).removeClass('alive-cell');
            $(this).addClass('death-cell');
        }
    });
}

function generateNextStep(){
    
    let cellsToBeToggled = [];  // The IDs of the cells that will change in the next generation

    $('.cell').each(function(){
        
        let cellId = $(this).attr('id');
        let isCellAlive = $(this).hasClass('alive-cell');

        neighbourStates = statesOfNeighbours(cellId);   // current cells's neighbours' states

        // if the current cell is alive
        if(isCellAlive){
            if(neighbourStates.aliveNeighbours !== 2 && neighbourStates.aliveNeighbours !== 3){ // kill the cell if there is not enough neighbours
                cellsToBeToggled.push('#' + cellId);
            }
        }

        // if the current cell is death
        else{
            if(neighbourStates.aliveNeighbours === 3){  // revive the cell if there is enough neighbours
                cellsToBeToggled.push('#' + cellId);
            }
        }

    });

    // kill the cell if alive, revive the cell if death
    cellsToBeToggled.forEach(element => {
        if($(element).hasClass('alive-cell')){
            $(element).removeClass('alive-cell');
            $(element).addClass('death-cell');
        }
        else{
            $(element).removeClass('death-cell');
            $(element).addClass('alive-cell');
        }
        
    });

}

// returns the states (the count of alive and death cells) of the neighbours of the given cell
function statesOfNeighbours(cellId){

    let rowIndex = cellId.split('_')[1];        // the row index of the cell
    let columnIndex = cellId.split('_')[3];     // the column index of the cell

    let neighbourIds = [];      // IDs of the cell's neighbours

    neighbourIds.push('#row_' + (parseInt(rowIndex) - 1) + '_column_' + (parseInt(columnIndex) - 1));              // top left neighbour
    neighbourIds.push('#row_' + (parseInt(rowIndex) - 1) + '_column_' + (parseInt(columnIndex)));                  // top neighbour
    neighbourIds.push('#row_' + (parseInt(rowIndex) - 1) + '_column_' + (parseInt(columnIndex) + 1));              // top right neighbour

    neighbourIds.push('#row_' + (parseInt(rowIndex)) + '_column_' + (parseInt(columnIndex) - 1));                  // left neighbour
    neighbourIds.push('#row_' + (parseInt(rowIndex)) + '_column_' + (parseInt(columnIndex) + 1));                  // right neighbour

    neighbourIds.push('#row_' + (parseInt(rowIndex) + 1) + '_column_' + (parseInt(columnIndex) - 1));              // bottom left neighbour
    neighbourIds.push('#row_' + (parseInt(rowIndex) + 1) + '_column_' + (parseInt(columnIndex)));                  // bottom neighbour
    neighbourIds.push('#row_' + (parseInt(rowIndex) + 1) + '_column_' + (parseInt(columnIndex) + 1));              // bottom right neighbour


    let neighbourStates = {
        deathNeighbours : 0,        // number of the death neighbours
        aliveNeighbours : 0         // number of the alive neighbours
    }

    neighbourIds.forEach(element => {
        if($(element).length > 0){  // if the neighbour exists (needed for edges of the matrix)
            if($(element).hasClass('death-cell')) neighbourStates.deathNeighbours++;
            else if($(element).hasClass('alive-cell')) neighbourStates.aliveNeighbours++;
        }
    });

    return neighbourStates;
}
