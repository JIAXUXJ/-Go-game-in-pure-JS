//created by Jia at 7-20, get the user settings input
// var serverInterface = new ServerInterface("localhost", 3000);

/**
 * getBgData() get the user settings for board from webpage.
 */
function getBgData() {
    //judge which setting page user in currently, we have 3 setting pages in total: local, AI, Networking
    var title = $(document).attr("title");

    $('#play-button').on('click', function () {

        //token: the color of user selected for their token.
        var token = $('#tokenColor option:selected').val();

        //bgc: the background of user selected.
        var checknum = 0;
        var checks = $('#bg-customize input:checkbox');
        for(var i = 0; i < checks.length; i++){
            if(checks[i].checked){
                var bgc = checks[i].value;
                checknum ++;
            }
        }

        //size: the board size user choosed.
        var size = $('#size option:selected').val();

        //make user choose only one color.
        if(checknum !== 1){
            alert("you should just select only one background!");
        }else {
            console.log(token, bgc, size, " href:", title)
            var bg = token+";"+size+";"+bgc;
            var data = "123";
            //direct to the startPlay page and passing bg string to that page.
            location.href = "./startPlay.html?gameID="+ data + '&bg=' + bg;
            // $.post(
            //     "match/startHotSeat",
            //     {
            //         "boardSize": size
            //     },
            //     function(data, textStatus) {
            //         if (data) {
            //             console.log(data);
            //             window.location.href = '/startPlay.html?gameID=' + data + '&bg=' + bg;
            //             // getData();
            //         }
            //         else if (textStatus !== 'success') {
            //             alert("Failed to access server.");
            //         }
            //     }
            // );
        }

    });

}
getBgData();