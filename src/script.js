const menuOpenButton = document.querySelector("#menu-open-button");
const menuCloseButton = document.querySelector("#menu-close-button");

menuOpenButton.addEventListener("click", () => {
    // Toggle mobile menu visibility 
    document.body.classList.toggle("show-mobile-menu");
});

// Close menu button
menuCloseButton.addEventListener("click", () => menuOpenButton.click());




//Initializing Swiper
const swiper = new Swiper(".slider-wrapper", {
  loop: true,
  grabCursor: true,
  spaceBetween: 25,
  
  // Pagination bullets
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
    dynamicBullets: true,
    
  },
  
  // Navigation arrows
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
    
  // Responsive breakpoints
  breakpoints: {
    0: {
        sliderPerView: 1
    },
    768: {
        sliderPerView: 2
    },
    1024: {
        sliderPerView: 3
    },
  }
});