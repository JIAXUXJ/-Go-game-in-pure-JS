/**
 * Created by Joye on 2016-07-06.
 */
var Appearance = {
    init: function () {
        this.guideHighlighter();
        this.showTeamMember();
    },
    guideHighlighter: function () {
        $('.top-nav li:not(".here")').hover(function(){
            $(this).addClass('nav-on');
        },function () {
            $(this).removeClass('nav-on');
        });
        $('#userSetting').hover(function () {
            console.log(typeof $('.remainder'))
            $('.remainder').show();
        }, function () {
            $('.remainder').hide();
        });
        $('.try-play').hover(function () {
            $('.rmd').show();
        }, function () {
            $('.rmd').hide();
        });
        $('.selection-nav li:not(".here")').hover(function () {
            $(this).addClass('selection-nav-on');
        },function () {
            $(this).removeClass('selection-nav-on');
        });
    },
    showTeamMember: function () {
        $('.team-img').hover(function () {
            // console.log(typeof $(this)[0].childNodes[1])
            $(this).find('.individual').hide();
        },function () {
            $('.individual').show();
        });
    }

};
Appearance.init();