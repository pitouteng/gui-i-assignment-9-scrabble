
// draw_letter();
const special_tiles = {"double_letter_score":4, "double_word_score":8}
var tile_size = 65;
var drawn_tiles = [];
var recent_dropped_box;
var dropped_box_pos;
var dragged_tile_pos;

$(document).ready(function() {
  // set board box sized based the size of tile
  set_up_board();
  set_up_tiles();
  console.log(drawn_tiles);



});
function set_up_board(){
    for (var i = 0; i < 12; i++) {
      if (i == special_tiles.double_letter_score) {
        $('div#board_holder').append("<img id=\"board_box"+i+"\" src=\"asset/board/double_letter_score.png\">");
      } else if (i == special_tiles.double_word_score) {
        $('div#board_holder').append("<img id=\"board_box"+i+"\" src=\"asset/board/double_word_score.png\">");
      } else {
        $('div#board_holder').append("<img id=\"board_box"+i+"\" src=\"asset/board/blank_board.png\">");
      }
    }

      var board_boxes = $("[id^='board_box']");
      board_boxes.width(tile_size+25);
      board_boxes.height(tile_size+25);
      board_boxes.droppable({
          // accept: "#draggable",
          drop: function( event, ui) {
            recent_dropped_box = $(this).attr("id");
            dropped_box_pos = $(this).position();

          },
          out: function(event, ui) {

          }
  });
}



function calculate_score(id_tile){
  for(var i in drawn_tiles){

  }

  // var tile_regex = /tile([0-6])/;
  // var tile_result = tile_regex.exec(id_tile);
  // var tile_value = drawn_tiles[tile_result[1]].value;
  //
  // var box_regex = /board_box([0-9]*)/;
  // // recent_dropped_box is global variable
  // var box_result = box_regex.exec(recent_dropped_box);
  //
  //
  // if(box_result[1] == special_tiles.double_letter_score) {
  //   console.log("double_letter");
  //   score = parseInt($("span").text());
  //   score = score + (tile_value * 2);
  //   console.log(score);
  //   $("span").text(score);
  // } else if(box_result[1] == special_tiles.double_word_score) {
  //   console.log("double_word");
  // } else {
  //   score = parseInt($("span").text());
  //   score = score + tile_value;
  //   console.log(score);
  //   $("span").text(score);
  //   console.log("empty");
  // }
}


function set_up_tiles() {
  var piece;
  var img_letter_name;

  for (var i = 0; i < 7; i++) {
    piece = draw_piece();
    drawn_tiles.push(piece);
    if (piece.letter == "_") {
      img_letter_name = "Blank";
      $('div#tile_holder').append("<div id=\"tile"+i+"\"> <img src=\"asset/Scrabble_Tile_"+ img_letter_name +".jpg\" style=\"width:"+ tile_size +"px;height:"+tile_size+"\"></div>");
    }
    else{
      $('div#tile_holder').append("<div id=\"tile"+i+"\"> <img src=\"asset/Scrabble_Tile_"+ piece.letter +".jpg\" style=\"width:"+ tile_size +"px;height:"+tile_size+"\"></div>");
    }
    $('#tile'+i).draggable({
      start:function(event, ui) {
        // // saved the dropped tile
        // console.log($(this).attr("id"));
        // if(tile_is_in_box($(this).position(), dropped_box_pos)){
        //   calculate_score($( this ).attr("id"));
        // }
      },
      stop: function(event, ui) {
        // saved the dropped tile
        console.log($(this).attr("id"));
        if(tile_is_in_box($(this).position(), dropped_box_pos)){
          calculate_score($( this ).attr("id"));
        }
      }
    });
  }
  for(i in drawn_tiles){
    delete drawn_tiles[i].amount;
  }
}

function tile_is_in_box(tile_pos, box_pos){
  console.log(tile_pos);
  console.log(box_pos);
  var top_dif = tile_pos.top - box_pos.top;
  var left_dif = tile_pos.left - box_pos.left;
  console.log(tile_pos.top - box_pos.top);
  console.log(tile_pos.left - box_pos.left);
  if(top_dif >= -5 && top_dif <= 15 && left_dif >= -5 && left_dif <= 20) {
    return true;
  } else {
    return false;
  }

  // (tile_pos.top - box_pos.top >= 7)
}

function draw_piece() {
  var rand = Math.floor(Math.random() * tiles_count()) + 1;
  for(var x in pieces) {
    rand = rand - pieces[x].amount;
    if (rand <= 0) {
      pieces[x].amount = pieces[x].amount - 1;
      return pieces[x];
    }
  }
}

function tiles_count() {
  var t = 0;
  for(var x in pieces){
    t = t + pieces[x].amount;
  }
  return t;
}
