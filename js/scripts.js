
// draw_letter();
const special_tiles = {"double_letter_score":4, "double_word_score":8}
var tile_size = 65;
var total_score = 0;
var drawn_tiles = [];

$(document).ready(function() {
  // set board box sized based the size of tile
  $("#tile_holder").droppable();

  set_up_board();
  set_up_tiles();

  // submit word button
  $("button").click(function(){
    clear_reset_board(); // clear anything that is placed on board and replace each tiles with new one
    tally_score(); // tally the score
  });
});

function set_up_board(){
    for (var i = 0; i < 12; i++) {
      if (i == special_tiles.double_letter_score) { // double letter box for this index
        $('div#board_holder').append("<img id=\"board_box"+i+"\" src=\"asset/board/double_letter_score.png\">");
      } else if (i == special_tiles.double_word_score) {  // double word box for this index
        $('div#board_holder').append("<img id=\"board_box"+i+"\" src=\"asset/board/double_word_score.png\">");
      } else { // regular box for other index
        $('div#board_holder').append("<img id=\"board_box"+i+"\" src=\"asset/board/blank_board.png\">");
      }
    }

    var board_boxes = $("[id^='board_box']");
    // board boxes are bigger than tile by 25
    board_boxes.width(tile_size+25);
    board_boxes.height(tile_size+25);
    board_boxes.droppable({
        drop: function( event, ui) {
          // set the tile position so it snaps to the board box
          box_pos = $(this).position();
          $("#"+ui.draggable.attr("id")).css({top: box_pos.top + 5, left: box_pos.left+7, position:'absolute'});;
        },
    });
}

function clear_reset_board() {
  for(var i in drawn_tiles){
    var tile = $("#tile"+i);
    for (var j = 0; j < 12; j++) {
      var box = $("#board_box"+j);
      if (tile_is_in_box(tile.position(), box.position())) { // remove the tile that is in board box
        // remove the tile
        $("#tile"+i).remove();
        // replace the tile
        piece = draw_piece();
        drawn_tiles[i] = piece;
        add_tile_img(piece, i);
      }
    }
  }
}

function tally_score() {
  $("#score").text();
  total_score = total_score + parseInt($("span#score").text());
  $("span#total").text(total_score); // accumulate to the total
  $("span#score").text(0); // reset score
}

function calculate_score(id_tile){
  var score = 0;
  var double_score = false;
  // loop though tiles and board_boxes to see if tile is in board and add up the score
  for(var i in drawn_tiles){
    var tile = $("#tile"+i);
    for (var j = 0; j < 12; j++) {
      var box = $("#board_box"+j);
      if (tile_is_in_box(tile.position(), box.position())) {
        if(j == special_tiles.double_letter_score){ // the board that tile is in is double_letter_score
          score = score + (drawn_tiles[i].value * 2);
        } else if(j == special_tiles.double_word_score){ // the board that tile is in is double_word_score
          double_score = true;
          score = score + drawn_tiles[i].value;
        } else {
          score = score + drawn_tiles[i].value;
        }
      }
    }
  }
  if (double_score) {
    score = score * 2;
  }

  $("span#score").text(score);
}

// inital tile set up
function set_up_tiles() {
  var piece;
  var img_letter_name;

  for (var i = 0; i < 7; i++) {
      piece = draw_piece();
      drawn_tiles.push(piece);
      add_tile_img(piece, i);
  }
}

// check if the position of a tile is in the box
// takes in a tile position and a box position
function tile_is_in_box(tile_pos, box_pos){
  // console.log(box_pos);
  var top_dif = tile_pos.top - box_pos.top;
  var left_dif = tile_pos.left - box_pos.left;
  if(top_dif >= -5 && top_dif <= 15 && left_dif >= -5 && left_dif <= 20) {
    return true;
  } else {
    return false;
  }
}

// given the tile info(letter, value and amount) and the tile index
// add the approiate img to html
function add_tile_img(tile_info, tile_number){
  if (tile_info.letter == "_") {
    img_letter_name = "Blank";
    $('div#tile_holder').append("<div id=\"tile"+tile_number+"\"> <img src=\"asset/Scrabble_Tile_"+ img_letter_name +".jpg\" style=\"width:"+ tile_size +"px;height:"+tile_size+"\"></div>");
  }
  else{
    $('div#tile_holder').append("<div id=\"tile"+tile_number+"\"> <img src=\"asset/Scrabble_Tile_"+ tile_info.letter +".jpg\" style=\"width:"+ tile_size +"px;height:"+tile_size+"\"></div>");
  }
  $('#tile'+tile_number).draggable({
    snap: "[id^='board_box']",
    snapTolerance: 5,
    revert: "invalid",
    stop: function(event, ui) {
      // calculate score everytime the drag stop
      calculate_score();
    }
  })
}

// draw one of the piece from the pieces with 100 inital count
function draw_piece() {
  var t_count = tiles_count();
  var rand = Math.floor(Math.random() * t_count) + 1;
  var piece_count = 0;
  // only draw when there is piece in the bag
  if (t_count > 0) {
    for(var x in pieces) {
      rand = rand - pieces[x].amount;
      if (rand <= 0) {
        pieces[x].amount = pieces[x].amount - 1;
        // update number of tile on screen
        var num_tile = parseInt($("#tiles_in_bag").text());
        t_count = t_count - 1;
        $("#tiles_in_bag").text(t_count);
        return pieces[x];
      }
    }
  } else {
    alert("No more tile to be drawn in the bag\nGame will restart");
    location.reload();
  }
}

// count the number of tiles in the bag
function tiles_count() {
  var t = 0;
  for(var x in pieces){
    t = t + pieces[x].amount;
  }
  return t;
}
