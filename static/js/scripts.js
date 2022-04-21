document.addEventListener("DOMContentLoaded", function (event) {
  // Lazyload, dotdotdot and owlCarousel curently run externallly to webpack bundle

  var desktopView = 991;
  var pageWindow = $(window);
  var scrollMetric = [pageWindow.scrollTop()];
  var fixMenu = $("#headerScrolling");

  var isDesktop = function () {
    if (window.innerWidth > desktopView) {
      return true;
    }
    return false;
  };

  var isScrolledPast = function (position) {
    if (scrollMetric[0] >= position) {
      return true;
    }
    return false;
  };

  var scrollUpMenu = function () {
    var isDesk = isDesktop();
    if (scrollMetric[1] === "up" && isScrolledPast(300) && isDesk === true) {
      fixMenu.addClass("header-sticky");
    } else if (isScrolledPast(200) && isDesk === false) {
      console.log("tab menu");
      fixMenu.addClass("header-sticky");
    } else {
      fixMenu.removeClass("header-sticky");
    }
  };

  //Onload and resize events
  $(window)
    .on("resize", function () {
      scrollUpMenu();
    })
    .resize();

  //On Scroll
  $(window).scroll(function () {
    var direction = "down";
    var scroll = $(window).scrollTop();
    if (scroll < scrollMetric[0]) {
      direction = "up";
    }
    scrollMetric = [scroll, direction];
    scrollUpMenu();
  });

  $("img.lazyload").lazyload({
    effect: "fadeIn",
  });

  window.Acme.scrollThumbs = function (elem) {
    if (elem.length === 0) {
      return;
    }
    var elem = $(elem);
    var elemWidth = elem.width();
    var container = elem.parent();
    var containerWidth = container.width();
    var scrollAmount = container.scrollLeft();
    var containerView = [scrollAmount, containerWidth + scrollAmount];

    var middle = (containerView[1] - containerView[0]) / 2;
    var middle = scrollAmount + middle;
    var elempos = elem[0].offsetLeft + elemWidth / 2;

    if (elempos > middle) {
      var scroll = true;
      var scrollpos = scrollAmount + (elempos - middle);
    } else if (elem[0].offsetLeft < middle) {
      var scroll = true;
      var scrollpos = scrollAmount - (middle - elempos);
    }

    if (scroll) {
      container.animate({
        scrollLeft: scrollpos,
      });
    }
  };

  window.Acme.scrollThumbsVertical = function (elem) {
    console.log("clicked");
    if (elem.length === 0) {
      return;
    }
    var elem = $(elem);
    var elemHeight = elem.height();
    var container = elem.parent();
    var containerHeight = container.height();
    var scrollAmount = container.scrollTop();
    var containerView = [scrollAmount, containerHeight + scrollAmount];

    var middle = (containerView[1] - containerView[0]) / 2;
    var middle = scrollAmount + middle;

    var elempos = elem[0].offsetTop + elemHeight / 2;

    if (elempos > middle) {
      var scroll = true;
      var scrollpos = scrollAmount + (elempos - middle);
    } else if (elem[0].offsetLeft < middle) {
      var scroll = true;
      var scrollpos = scrollAmount - (middle - elempos);
    }

    if (scroll) {
      container.animate({
        scrollTop: scrollpos,
      });
    }
  };

  window.Acme.scrollThumbsHorizontal = function (elem) {
    if (elem.length === 0) {
      return;
    }
    var elem = $(elem);
    var elemWidth = elem.width();
    var container = elem.parent();
    var containerWidth = container.width();
    var scrollAmount = container.scrollLeft();
    var containerView = [scrollAmount, containerWidth + scrollAmount];

    var middle = (containerView[1] - containerView[0]) / 2;
    var middle = scrollAmount + middle;
    var elempos = elem[0].offsetLeft + elemWidth / 2;

    if (elempos > middle) {
      var scroll = true;
      var scrollpos = scrollAmount + (elempos - middle);
    } else if (elem[0].offsetLeft < middle) {
      var scroll = true;
      var scrollpos = scrollAmount - (middle - elempos);
    }

    if (scroll) {
      container.animate({
        scrollLeft: scrollpos,
      });
    }
  };

  var cardHolder = "";
  clearTimeout(cardHolder);
  cardHolder = setTimeout(function () {
    $(".j-truncate").dotdotdot({
      watch: true,
    });
  }, 750);

  $("#owl-gallery-image").owlCarousel({
    items: 1,
    dots: false,
    nav: true,
    navText: ["", ""],
  });

  //this is used for the gallery template
  $("#owl-gallery-article").owlCarousel({
    items: 1,
    thumbs: true,
    thumbsPrerendered: true,
    URLhashListener: true,
    startPosition: "URLHash",
    pagination: true,
    dots: false,
    nav: true,
    navText: ["", ""],
  });

  function counter(event) {
    var element = event.target;
    var items = event.item.count;
    var item = event.item.index + 1;

    // it loop is true then reset counter from 1
    if (item > items) {
      item = item - items;
    }
    $("#counter").html(item + " of " + items);
  }

  $(".home_slider").owlCarousel({
    margin: 30,
    responsiveClass: true,
    navText: ["", ""],
    responsive: {
      0: {
        items: 1,
        nav: true,
      },
      600: {
        items: 3,
        nav: false,
      },
      1000: {
        items: 5,
        nav: true,
        loop: false,
      },
    },
  });
});

function headerMicroMenuOpen() {
  var clickElem = document.getElementById("headerMicroMenu");
  clickElem.classList.add("active");
}

function headerMicroMenuClose() {
  var clickElem = document.getElementById("headerMicroMenu");
  clickElem.classList.remove("active");
}

//sidebar function

function sidebarMenuOpen() {
  let getMenuClick = document.querySelector(".js-menu");
  getMenuClick.addEventListener("click", openMenuFunction);
  function openMenuFunction() {
    document.querySelector(".c-sidebarMenu").classList.add("sidebar-active");
    document.querySelector("body").classList.add("u-noscroll");
  }
}
sidebarMenuOpen();

function sidebarMenuClose() {
  let getMenuClick = document.querySelector(".js-closeMenu");
  getMenuClick.addEventListener("click", closeMenuFunction);
  function closeMenuFunction() {
    document.querySelector(".c-sidebarMenu").classList.remove("sidebar-active");
    document.querySelector(".body").classList.remove("u-noscroll");
  }
}

sidebarMenuClose();

$(".js-sideBarItem").on("click", function (e) {
  e.preventDefault();
  var getParentLi = $(this).closest(".js-sideBarList");
  if (getParentLi.hasClass("active")) {
    getParentLi.toggleClass("active");
  } else {
    getParentLi.siblings(".js-sideBarList").removeClass("active");
    getParentLi.addClass("active");
  }
});

$("body")
  .not(".js-menu")
  .on("click", function (e) {
    if (
      !$(e.target).is(".c-sidebarMenu, .c-sidebarMenu *") &&
      !$(e.target).is(".js-menu, .js-menu *")
    ) {
      $(".c-sidebarMenu").removeClass("sidebar-active");
      $(".body").removeClass("u-noscroll");
    }
  });

function searchBarOpen() {
  let searchElem = document.getElementById("searchBarAction");
  searchElem.classList.add("active");
}

function searchBarClose() {
  let searchElem = document.getElementById("searchBarAction");
  searchElem.classList.remove("active");
}
