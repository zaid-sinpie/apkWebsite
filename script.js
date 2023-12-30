'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');

const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');

const nav = document.querySelector('.nav');

const openModal = function () {
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

for (let i = 0; i < btnsOpenModal.length; i++)
  btnsOpenModal[i].addEventListener('click', openModal);

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

//Creaating new element and pushing it into html
const header = document.querySelector('.header'); //selecting where to push
const message = document.createElement('div'); //creating
message.classList.add('cookie-message'); //pushin into

//creating child elements
message.innerHTML =
  'We uses coockies accept it! <button class="btn btn--close-cookie">Got It!</button>';

//displaying new element
header.append(message);
// header.append(message.cloneNode(true)); // cloning element
message.style.width = '120%';
message.style.backgroundColor = '#37383d';

//cookie okay action
document
  .querySelector('.btn--close-cookie')
  .addEventListener('click', function () {
    // message.remove();
    message.parentElement.removeChild(message);
  });

//scrolling animation
btnScrollTo.addEventListener('click', function (e) {
  // const s1coords = section1.getBoundingClientRect();

  // console.log(e.target.getBoundingClientRect());
  // console.log('x and y', window.pageXOffset, pageYOffset);

  // console.log(
  //   'h/w viewPort',
  //   document.documentElement.clientHeight,
  //   document.documentElement.clientWidth
  // );

  //Scrolling
  // window.scrollTo(
  //   s1coords.left + window.pageXOffset,
  //   s1coords.top + window.pageYOffset
  // );

  // window.scrollTo({
  //   left: s1coords.left + window.pageXOffset,
  //   top: s1coords.top + window.pageYOffset,
  //   behavior:'smooth',
  // });

  // modern way
  section1.scrollIntoView({ behavior: 'smooth' });
});

//Page Navigation
// document.querySelectorAll('.nav__link').forEach(function(el){
//   el.addEventListener('click',function(e){
//     e.preventDefault();
//     const id = this.getAttribute('href');
//     document.querySelector(id).scrollIntoView({behavior:'smooth'});
//   });
// });

//Event deligation
//1. Add event listner to common parent element
//2. Determine what element oraganized the event
document.querySelector('.nav__links').addEventListener('click', function (e) {
  // console.log(e.target);

  //Matching strategy
  if (e.target.classList.contains('nav__link')) {
    // console.log('Link');
    e.preventDefault();
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

// Tabbed component

// tabs.forEach(t => t.addEventListener('click', () => console.log('Tab')))
tabsContainer.addEventListener('click', function (e) {
  const clicked = e.target.closest('.operations__tab');
  // console.log(clicked);

  //Guard clause
  if (!clicked) return;

  //Remove active calsses
  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  tabsContent.forEach(c => c.classList.remove('operations__content--active'));

  //Active tab
  clicked.classList.add('operations__tab--active');

  //Activate content area
  // console.log(clicked.dataset.tab);
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

//Menu fade animation
const handleHover = function (e) {
  // console.log(this, e.currentTarget);
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    siblings.forEach(el => {
      if (el !== link) el.style.opacity = this;
    });
    logo.style.opacity = this;
  }
};

//Passing an "argument" into handler
nav.addEventListener('mouseover', handleHover.bind(0.5));

nav.addEventListener('mouseout', handleHover.bind(1));

//Sticky navigation
// const initialCoords = section1.getBoundingClientRect();
// window.addEventListener('scroll', function(){
//   console.log(this.window.scrollY);
//   if (this.window.scrollY > initialCoords.top)nav.classList.add('sticky'); else nav.classList.remove('sticky');
// });

//Sticky navigation using intersection observer API
// const obsCallback = function(entries,observer){
//   entries.forEach(entry => {
//     console.log(entry);
//   })
// };

// const obsOptions = {
//   root:null,
//   threshold:[0,0.2],
// };

// const observer = new IntersectionObserver(obsCallback,obsOptions);
// observer.observe(section1);

// const header = document.querySelector('.header');
const navHeight = nav.getBoundingClientRect().height;
// console.log(navHeight);
const stickyNav = function (entries) {
  const [entry] = entries;
  console.log(entry);
  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};
const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});

headerObserver.observe(header);

//Reveal section on scroll
const allSections = document.querySelectorAll('.section');
const revealSection = function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;

  entry.target.classList.remove('section--hidden');

  observer.unobserve(entry.target);
};
const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});

allSections.forEach(function (section) {
  sectionObserver.observe(section);
  section.classList.add('section--hidden');
});

//Lazy loading images
const imgTargets = document.querySelectorAll('img[data-src]');
// console.log(imgTargets);
//img[data-src] select only those images which has data-src attributes
const loadImg = function (entries, observer) {
  const [entry] = entries;
  console.log(entry);

  if (!entry.isIntersecting) return;
  //Replace sc with data-src
  entry.target.src = entry.target.dataset.src;
  entry.target.classList.remove('lazy-img');
  entry.target.addEventListener('load', function () {});

  observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
});

imgTargets.forEach(img => imgObserver.observe(img));

//Slider
const slider = function () {
  const slides = document.querySelectorAll('.slide');
  const btnLeft = document.querySelector('.slider__btn--left');
  const btnRight = document.querySelector('.slider__btn--right');
  let curSlide = 0;
  const maxSlide = slides.length;
  const dotContainer = document.querySelector('.dots');
  // slides.forEach((s, i) => (s.style.transform = `translateX(${100 * i}%)`));
  // 0,100,200,300

  //Fucntions
  const createDots = function () {
    slides.forEach(function (s, i) {
      dotContainer.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
    });
  };

  const activateDot = function (slide) {
    document
      .querySelectorAll('.dots__dot')
      .forEach(dot => dot.classList.remove('dots__dot--active'));

    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add('dots__dot--active');
  };

  const goToSlide = function (slide) {
    slides.forEach(
      (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
    );
  };

  //next slide
  //Button right
  const nextSlide = function () {
    if (curSlide == maxSlide - 1) {
      curSlide = 0;
    } else {
      curSlide++;
    }
    goToSlide(curSlide);
    activateDot(curSlide);
  };

  //Previou slide
  //Button right
  const prevSlide = function () {
    if (curSlide === 0) {
      curSlide = maxSlide - 1;
    } else {
      curSlide--;
    }
    goToSlide(curSlide);
    activateDot(curSlide);
  };

  const init = function () {
    goToSlide(0);
    createDots();
    activateDot(0);
  };

  init();

  //Event handlers
  btnRight.addEventListener('click', nextSlide);
  btnLeft.addEventListener('click', prevSlide);

  document.addEventListener('keydown', function (e) {
    // console.log(e);
    if (e.key === 'ArrowLeft') prevSlide();
    e.key === 'ArrowRight' && nextSlide();
  });

  dotContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      // console.log('yes');
      const { slide } = e.target.dataset;
      goToSlide(slide);
      activateDot(slide);
    }
  });
};
slider();


/////////////////////////////////////Scrolling animation to nav bar/////////////////////////////////////////////////

// ///////////////////////////////////////////////////////////////////////////////
// // Styles
// // message.style.backgroundColor = '#37383d';
// // message.style.width = '120%';

// // message.style.height =
// //   Number.parseFloat(getComputedStyle(message).height, 10) + 30 + 'px';

// // document.documentElement.style.setProperty('--color-primary', 'orangered');

// //Attributes
// // const logo = document.querySelector('.nav__logo');
// // console.log(logo.alt);
// // console.log(logo.src);
// // console.log(logo.className);

// // logo.alt = 'link name of logo'

// // console.log(logo.designer);
// // console.log(logo.getAttribute('designer'));

// // logo.setAttribute('company', 'Bankist');

// // console.log(logo.src);
// // console.log(logo.getAttribute('src'));

// // const link = document.querySelector('.nav__link--btn');
// // console.log(link.href);
// // console.log(link.getAttribute('href'));

// // // Data attributes
// // console.log(logo.dataset.versionNumber);

// //Classes
// // logo.classList.add('className');
// // logo.classList.remove('className');
// // logo.classList.toggle('className');
// // logo.classList.contains('className');

// // Dont use
// // logo.className = 'Demon';

// //rgb(255,255,255)

// // const randomInt = (min, max) =>
// //   Math.floor(Math.random() * (max - min + 1) + min);
// // const randomColor = () =>
// //   `rgb(${randomInt(0, 255)},${randomInt(0, 255)},${randomInt(0, 255)})`;

// // document.querySelector('.nav__link').addEventListener('click',function(e){
// //   this.style.backgroundColor = randomColor();
// //   // e.stopPropagation(); //parent elements dont change color or anything now if we use this function
// // })
// // document.querySelector('.nav__links').addEventListener('click',function(e){
// //   this.style.backgroundColor = randomColor();
// // })
// // document.querySelector('.nav').addEventListener('click',function(e){
// //   this.style.backgroundColor = randomColor();
// // })

// ///////////////////////////////////////Dom traversing //////////////////////////////////////////////////////
// const h1 = document.querySelector('h1');
// // Going Downwards
// console.log(h1.querySelectorAll('.highlight'));
// console.log(h1.childNodes);
// console.log(h1.children);
// h1.firstElementChild.style.color = 'white';
// h1.lastElementChild.style.color = 'red';

// //Going upward
// console.log(h1.parentNode);
// console.log(h1.parentElement);

// h1.closest('.header').style.background = 'var(--gradient-secondary)';
// h1.closest('h1').style.background = 'var(--gradient-primary)';

// //Going sideways
// console.log(h1.previousElementSibling);
// console.log(h1.nextElementSibling);

// console.log(h1.previousSibling);
// console.log(h1.nextSibling);

// console.log(h1.parentElement.children);
// [...h1.parentElement.children].forEach(function(e){
//   if(e !== h1) e.style.trasform = 'scale(0.5)';
// });
