document.addEventListener("DOMContentLoaded", function(event) {
    
    // Lazyload, dotdotdot and owlCarousel curently run externallly to webpack bundle
    
    $("img.lazyload").lazyload({
        effect : "fadeIn"
    });


    var cardHolder = '';
    clearTimeout(cardHolder);
    cardHolder = setTimeout((function() {
        $('.j-truncate').dotdotdot({
            watch: true
        });
    }), 750);

    $("#owl-gallery-image").owlCarousel({
        items: 1,
        thumbs: true,
        thumbsPrerendered: true,
        URLhashListener:true,
        startPosition: 'URLHash',
        pagination: true,
        dots: false,
        nav: true,
        navText: [
            "",
            ""
        ]
    });
    
    $('.home_slider').owlCarousel({
        margin:30,
        responsiveClass:true,
        navText: [
            "",
            ""
        ],
        responsive:{
            0:{
                items:1,
                nav:true
            },
            600:{
                items:3,
                nav:false
            },
            1000:{
                items:5,
                nav:true,
                loop:false
            }
        }
    })
});
