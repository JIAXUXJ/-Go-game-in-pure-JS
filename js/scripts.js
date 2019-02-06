/**
 * Created by Joye on 2016-07-20.
 */
/**
 * Requests a new board state from the server's /data route.
 * @param cb {function} callback to call when the request comes back from the server.
 */
var v = parseUrl();
console.log(v);
// console.log('v["gameID"]: ', v['gameID']);
var bg = v['bg'];
console.log(bg);
var gameID = v['gameID'];
var initialTurn = v['token'];
// console.log(bg)

bg = bg.substring(bg.indexOf('?')+1, bg.length);

bg = bg.split(";");
var size = bg[1];
var tokenC = bg[0];
// console.log(size);

var unitSize;
if(size <= 10){
    unitSize = 65;//105.55555
}else if(size > 10 && size <= 15){
    unitSize = 45;//73
}else {
    unitSize = 30;//50 origin
}
var newBoard = new Array(size);
var Tracks = []; //moving tracks array. the element of array is 'Step' object
var rob = null;//if robs, record the position of rob.

// function getData(cb) {
//     gameID = v['gameID'];
//     if(gameID){
//         $.ajax({
//             url: "/game/"+gameID,
//             success: function(data){
//                 //$("#result").text(JSON.stringify(data));
//                 // console.log(data);
//                 newBoard.array = data.Board;
//                 newBoard.turn = 0;
//                 cb(data);
//             },
//             dataType: "json"});
//     }
// }
//define the object of every token
var Site = {
    //token constructor
    Create: function (x, y) {
        var token = makeCircle(x*unitSize + unitSize, y*unitSize + unitSize, unitSize/2.5, 'white');
        $('svg').append(token);
        token.x = x;
        token.y = y;
        token.style.opacity = '0';
        token.Fill = this.Fill;
        token.Kill = this.Kill;
        token.Tight = this.Tight;
        // console.log(token)
        token.onclick = this.Play;
        // console.log(token.onClick)
        token.Fill();
        return token; //return the token object;
    },
    Fill: function (dot, going) {

        if(dot == undefined){
            // console.log("nothing cahge to nonoe")
            this.style.opacity = '0';
        }else {
            if(dot == '0'){//black
                this.style.opacity = '1';
                this.style.fill = 'black';
            }else if(dot == '1'){
                this.style.opacity = '1';
                this.style.fill = 'white';
            }else{
                this.style.opacity = '0';
            }
        }
        this.dot = dot;
    },
    Play: function () {
        if(this.dot == undefined){//no token here
            // console.log("no token: ??????",this.x, this.y)
            // console.log("newBoard.turn ", newBoard.turn, newBoard.turn^1)
            var deads = this.Kill(newBoard.turn^1);//calculate the token could be killed
            // console.log("deads now: ", deads);
            if(deads.length == 1 && this == rob){//the status of rob
                return;
            }
            for(var i=0; i<deads.length; i++){
                deads[i].Fill();
                if(i==1){
                    rob = deads[0];//record the position of rob
                }else if(i>0 || !this.Tight(newBoard.turn)){
                    rob = null;//clean the rob position
                }else{
                    return;
                }
            }

            var step = Tracks[Tracks.length - 1];
            if(step) step.site.Fill(step.site.dot);
            this.Fill(newBoard.turn, true);//fill the proper token
            Tracks.push(new Step(this, deads));
            newBoard.turn ^= 1;

            // step.site.Fill(step.site.dot);
            // this.Fill(newBoard.turn, true);//fill the proper token
            // // Tracks.push(new Step(this, deads));
            // newBoard.turn ^= 1;
        }
    },
    Tight: function (dot) {// to calculate tight block
        var life = this.dot == undefined ? this : undefined;//current position has no token should be one tight
        dot = dot == undefined ? this.dot : dot;
        if(dot == undefined) return undefined;
        var block = this.dot == undefined ? [] : [this];
        var i = this.dot == undefined ? 0 : 1;
        var site = this;
        while(true){
            for(var dx = -1; dx <= 1; dx++) for(var dy = -1; dy <= 1; dy++)if(!dx^!dy){
                link = GetSite(site.x + dx, site.y + dy);
                if(link)//has position
                    if(link.dot != undefined )//has token
                    {
                        if (link.dot == dot && block.indexOf(link) < 0 )
                            block.push(link);
                    }
                    else if(!life)
                        life = link;
                    else if(life != link)
                        return undefined;

            };
            if(i >= block.length){
                break;
            }
            site = block[i];
            i++;
        };
        return block;
    },
    Kill: function (dot) {
        // console.log("token found: ", dot);
        var deads = [];
        for(var dx = -1; dx <= 1; dx++)for(var dy=-1; dy <= 1; dy++)if(!dx^!dy){
            // console.log("what this.x: >>>>>", this.x, "  dx: ", dx)
            var site = GetSite(this.x + dx, this.y + dy);
            // console.log(site)
            if(site && (site.dot == dot)){
                var block = site.Tight();
                if(block) deads = deads.concat(block);
            };
        };
        // console.log(deads);
        return deads;//return the block of dead tokens
    }
};
function Step(site, deads) {//record the status of every moving
    this.site = site;
    this.deads = deads;//record the set of dead rokens killed by current moving
}
function GetSite(x, y) {//get the token position from board, overstep the
    // console.log("x, y to getsite: ", x, y);
    if(x >= 0 && x < size && y >= 0 && y < size){
        // console.log("board: ", newBoard.array[x][y])
        return newBoard[x][y];
    }
}
function parseUrl() {
    var url = location.href;
    var k = url.indexOf('?');
    if(k == -1){
        return;
    }
    var querystr = url.substr(k+1);
    var arr1 = querystr.split('&');
    var arr2 = new Object();
    for (k in arr1){
        var ta = arr1[k].split('=');
        arr2[ta[0]] = ta[1];
    }
    return arr2;
}
function drawBoard() {
    //bg is a string passed from user setting page, it is a string look like:
    // token-color; bg-color; size

    var canvas = $('#canvas-board');
    var W = size * unitSize + unitSize, H = size * unitSize + unitSize;
    canvas.css("height", H );
    canvas.css("width", W );

    var svg = $(makeSVG(W, H));

    var i, j;
    svg.append($(makeRectangle(10, 10, unitSize, unitSize, 'burlywood')));

    var bgcolor1, bgcolor2;
    if(bg.length === 4){
        bgcolor1 = bg[2];
        bgcolor2 = bg[3];
        console.log(bgcolor1, bgcolor2)
    }else {
        bgcolor1 = bgcolor2 = bg[2];
    }
    //draw every unit rectangle
    for(i = 0; i <= W; i+=unitSize){
        for(j = 0; j <= H; j+=unitSize ){
            //if-else comment: make the color different in the different unit.
            if((i/unitSize)%2 == 0 && (j/unitSize)%2 == 0 || (i/unitSize)%2 == 1 && (j/unitSize)%2 == 1){
                svg.append($(makeRectangle(i, j, unitSize, unitSize, bgcolor1)));
            }else {
                svg.append($(makeRectangle(i, j, unitSize, unitSize, bgcolor2)));
            }
        }
    }

    for(var k = unitSize; k < W; k+=unitSize){
        svg.append(makeLine(k, 1, k, W-1));
    }

    for(var a = unitSize; a < H; a+=unitSize){
        svg.append(makeLine(1, a, H-1, a));
    }
    canvas.append(svg);
    // TODO : only thing need to be change when data refreshed from server.
    // var board = state.Board[0];
    for(var i = 0; i < size; i++){
        newBoard[i] = new Array(size);
        for (var j = 0; j < size; j++){
            // svg.append(makeCircle(i*unitSize + unitSize, j*unitSize + unitSize, unitSize/2.5, 'rgba(255, 255, 255, 0)'));
            // if(newBoard.array[i][j] == '1'){
            //     svg.append(makeCircle(i*unitSize + unitSize, j*unitSize + unitSize, unitSize/2.5, 'rgba(1, 1, 1, 1)'));//black
            // }else if(newBoard.array[i][j] == '2'){
            //     svg.append(makeCircle(i*unitSize + unitSize, j*unitSize + unitSize, unitSize/2.5, 'rgba(255, 255, 255, 1)'));//white
            // }else if(newBoard.array[i][j] == '0'){
            //     svg.append(makeCircle(i*unitSize + unitSize, j*unitSize + unitSize, unitSize/2.5, 'rgba(255, 255, 255, 0)'));
            // }
            newBoard[i][j] = Site.Create(i, j);
        }
    }

}

function validCheck(x, y) {
    if(newBoard.array[x][y] == 1 || newBoard.array[x][y] == 2){
        // console.log("not the valid spot!");
        return false;
    }else if(newBoard.array[x][y] == 0){
        return true;
    }
}

// function fakeGame(x, y) {
//     //if it is black turn
//     if(validCheck(x, y)){
//         console.log("pass!!!");
//         if(newBoard.turn === 1){
//             newBoard.array[x][y] = 1;
//             newBoard.turn = 2;
//             $('svg').remove();
//         }else if(newBoard.turn === 2){
//             newBoard.array[x][y] = 2;
//             newBoard.turn = 1;
//             $('svg').remove();
//         }
//     }
//     console.log("draw again");
//     drawBoard(newBoard);
// }
//when user click a circle.
function gamePlay(){
    $('circle').on('click', function () {
        var size = bg[1];
        var unitSize;
        if(size <= 10){
            unitSize = 65;
        }else if(size > 10 && size <= 15){
            unitSize = 45;
        }else {
            unitSize = 30;
        }
        var CoorX = ($(this)[0].attributes.cx.nodeValue - unitSize)/unitSize;
        var CoorY = ($(this)[0].attributes.cy.nodeValue - unitSize)/unitSize;
        if(CoorX > 2 && CoorX < 3){
            CoorX = 2;
        }
        if(CoorY > 2 && CoorY < 3){
            CoorY = 2;
        }
        // TODO write sth here: to check if it is a valid move, if yes, user can place token here.
        //TODO: I'm note faimiliar with server code, so I don't know how to send data to server here
        //TODO: all things should be write below here, donot change any other JS code in this file.

        console.log("coordinates: ", CoorX, CoorY);
        // fakeGame(CoorX, CoorY);
        
        // $.post(
        //     "/game/" + gameID,
        //     {
        //         "game": gameID,
        //         "Pass": false,
        //         "CoordX": CoorX,
        //         "CoordY": CoorY,
        //         "Turn" : window.Turn
        //     },function (data, textStatus){
        //         if (data) {
        //             console.log(JSON.stringify(data));
        //             drawBoard(data);
        //         }
        //         if (textStatus !== 'success') {
        //             alert("Failed to send move to server");
        //             console.log("Move failed. Status: " + textStatus);
        //         }
        //     }
        // );


    });

    $('#canvas-board').on('mouseover', function () {
        // location.href = "./img/black.ani";
        // $(this)[0].style.cursor = url('./img/black.ani');
        $(this)[0].style.cursor = 'pointer';
    });

}
function passToken() {
    $('#pass').on = ('click', function () {
        console.log(">>>>>>>>>>>>>");
    });
}
function init() {
    console.log("Initalizing Page...");
    // TODO: request data from server
    // getData(drawBoard);
    //gamePlay func can return the position of circle.
    drawBoard();

}
init();