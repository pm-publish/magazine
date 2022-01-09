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


function headerMicroMenuOpen() {
    var clickElem = document.getElementById('headerMicroMenu')
    clickElem.classList.add('active')
}

function headerMicroMenuClose() {
    var clickElem = document.getElementById('headerMicroMenu')
    clickElem.classList.remove('active')
}


//sidebar function

function sidebarMenuOpen() {
    let getMenuClick = document.querySelector('.js-menu');
    getMenuClick.addEventListener('click', openMenuFunction);
    function openMenuFunction() {
        document.querySelector('.c-sidebarMenu').classList.add("sidebar-active");
        document.querySelector('body').classList.add("u-noscroll");
    }
}
sidebarMenuOpen();

function sidebarMenuClose() {
    let getMenuClick = document.querySelector('.js-closeMenu');
    getMenuClick.addEventListener('click', closeMenuFunction);
    function closeMenuFunction() {
        document.querySelector('.c-sidebarMenu').classList.remove("sidebar-active");
        document.querySelector('.body').classList.remove("u-noscroll");
    }
}

sidebarMenuClose();

$('.js-sideBarItem').on('click', function (e) {
    e.preventDefault();
    var getParentLi = $(this).closest('.js-sideBarList');
    if (getParentLi.hasClass('active')) {
        getParentLi.toggleClass('active');
    } else {
        getParentLi.siblings(".js-sideBarList").removeClass('active');
        getParentLi.addClass('active');
    }
});

$('body').not('.js-menu').on('click', function (e) {
    if (!$(e.target).is('.c-sidebarMenu, .c-sidebarMenu *') && !$(e.target).is('.js-menu, .js-menu *')) {
        $('.c-sidebarMenu').removeClass("sidebar-active");
        $('.body').removeClass("u-noscroll");
    }
});