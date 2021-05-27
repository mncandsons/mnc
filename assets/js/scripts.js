objectFitImages();

// Tabs

var tabber = new HashTabber();
tabber.run();

let portfolioNavItem = document.querySelectorAll('.portfolio-nav li');
for(let i = 0; i < portfolioNavItem.length; i++){
  let hash = window.location.hash;
  if (!hash){
    portfolioNavItem[i].classList.remove('active');
  }
}

// Menu Toggle

let toggleButton = document.querySelector('.toggle-menu');
let menu = document.querySelector('.site-nav');

if (toggleButton){
  toggleButton.addEventListener('click',function(e){
    toggleButton.classList.toggle('is-pushed');
    menu.classList.toggle('active');
  });
}

// Gallery

let lazyLoadInstance = new LazyLoad({
    elements_selector: ".lazy",
    callback_loaded: function(el) {
      if (el.naturalWidth < el.naturalHeight){
        el.classList.add('portrait');
      }
    }
});

let forEach = function (array, callback, scope) {
  for (let i = 0; i < array.length; i++) {
    callback.call(scope, i, array[i]); // passes back stuff we need
  }
};

let galleryRes = document.querySelector('#residential-gallery');
let galleryComm = document.querySelector('#commercial-gallery');

if (galleryRes) {
  resSlider = tns({
    container: '#residential-gallery .slideshow',
    mode: 'gallery',
    nav: false,
    controls: true,
    controlsText: ['<i class="icon icon-arrow-left-sm"></i> Previous project', 'Next project <i class="icon icon-arrow-right-sm"></i> '],
    speed: 800,
    autoplayButtonOutput: false,
    touch: false,
    loop: false,
    nested: 'outer',
    swipeAngle: false,
  });
}

if (galleryComm) {
  commSlider = tns({
    container: '#commercial-gallery .slideshow',
    mode: 'gallery',
    nav: false,
    controls: true,
    controlsText: ['<i class="icon icon-arrow-left-sm"></i> Previous project', 'Next project <i class="icon icon-arrow-right-sm"></i> '],
    speed: 800,
    autoplayButtonOutput: false,
    touch: false,
    loop: false,
    nested: 'outer',
    swipeAngle: false,
  });
}

let innerGallery = document.querySelectorAll('.slideshow-inside');
if (innerGallery) {
  forEach(innerGallery, function (index, value) {
    let innerSlider = tns({
      container: value,
      mode: 'gallery',
      nav: false,
      controls: true,
      controlsText: ['<i class="icon icon-arrow-left-sm"></i> ', '<i class="icon icon-arrow-right-sm"></i> '],
      controlsContainer: value.parentNode.querySelector('.slideshow-inside__controls'),
      speed: 800,
      autoplayButtonOutput: false,
      touch: true,
      loop: false,
      nested: 'inner',
      mouseDrag: true,
      swipeAngle: false,
      disable: true,
      responsive: {
        767: {
          disable: false,
        }
      },
    });

    let sortButton = document.querySelectorAll(".slideshow-inside__sort button");
    for(var i = 0; i < sortButton.length; i++){
      sortButton[i].addEventListener('click',function(e){
        innerSlider.goTo('first');
      });
    }
  });
}


let sortButton = document.querySelectorAll(".slideshow-inside__sort button");
for(var i = 0; i < sortButton.length; i++){
  sortButton[i].addEventListener('click',function(e){
    for(var n = 0; n < sortButton.length; n++){
      sortButton[n].classList.remove('active');
    }

    let slidesBlock = document.querySelectorAll('.slideshow-inside__wrap');
    for(var i = 0; i < slidesBlock.length; i++){
      if (slidesBlock[i].parentNode.querySelectorAll('.slideshow-inside__wrap').length > 1){
        slidesBlock[i].classList.add('hidden');
      }
      else{
        slidesBlock[i].parentNode.querySelector('.slideshow-inside__sort button').classList.add('active');
      }
    }
    if (this.classList.contains('sort-all')){
      let sortButtonAll = document.querySelectorAll('.sort-all');
      for(var m = 0; m < sortButtonAll.length; m++){
        sortButtonAll[m].classList.add('active');
      }
      let slidesAll = document.querySelectorAll('.slides-all');
      for(var m = 0; m < slidesAll.length; m++){
        slidesAll[m].classList.remove('hidden');
      }
    }
    else if (this.classList.contains('sort-exterior')){
      let sortButtonExt = document.querySelectorAll('.sort-exterior');
      for(var m = 0; m < sortButtonExt.length; m++){
        sortButtonExt[m].classList.add('active');
      }
      let slidesExt = document.querySelectorAll('.slides-exterior');
      for(var m = 0; m < slidesExt.length; m++){
        slidesExt[m].classList.remove('hidden');
      }
    }
    else{
      let sortButtonInt = document.querySelectorAll('.sort-interior');
      for(var m = 0; m < sortButtonInt.length; m++){
        sortButtonInt[m].classList.add('active');
      }
      let slidesInt = document.querySelectorAll('.slides-interior');
      for(var m = 0; m < slidesInt.length; m++){
        slidesInt[m].classList.remove('hidden');
      }
    }
  });
}

// Set Data Index to Commercial blocks

let commercialRanges = document.querySelectorAll(".p-block.commercial");
for(var i = 0; i < commercialRanges.length; i++){
    commercialRanges[i].setAttribute('data-index', i);
}

// Scroll Function
const easeInCubic = function (t) { return t*t*t }

const scrollToElem = (startTime, currentTime, duration, scrollEndElemTop, startScrollOffset) => {
   const runtime = currentTime - startTime;
   let progress = runtime / duration;

   progress = Math.min(progress, 1);

   const ease = easeInCubic(progress);

   window.scroll(0, startScrollOffset + (scrollEndElemTop * ease));if(runtime < duration){
     requestAnimationFrame((timestamp) => {
       const currentTime = timestamp || new Date().getTime();
       scrollToElem(startTime, currentTime, duration, scrollEndElemTop, startScrollOffset);
     })
   }
 }

// Portfolio blocks

let pbElem = document.querySelectorAll('.p-block');
let slideshowSortButtons = document.querySelectorAll('.slideshow-inside__sort');
let slideshowControls = document.querySelectorAll('.slideshow-inside__controls');
let slideshowCount = document.querySelectorAll('.tns-liveregion');
let galleryImg = document.querySelectorAll('.slideshow-inside__item img');

function galleryImgOver() {
  for(let i = 0; i < slideshowSortButtons.length; i++){
    slideshowSortButtons[i].classList.remove('invisible');
  }

  for(let i = 0; i < slideshowControls.length; i++){
    slideshowControls[i].classList.remove('invisible');
  }

  for(let i = 0; i < slideshowCount.length; i++){
    slideshowCount[i].classList.remove('invisible');
  }
}

function galleryImgLeave() {
  for(let i = 0; i < slideshowSortButtons.length; i++){
    slideshowSortButtons[i].classList.add('invisible');
  }

  for(let i = 0; i < slideshowControls.length; i++){
    slideshowControls[i].classList.add('invisible');
  }

  for(let i = 0; i < slideshowCount.length; i++){
    slideshowCount[i].classList.add('invisible');
  }
}

for(let i = 0; i < pbElem.length; i++){
  const elem = pbElem[i];
  let elemParent = elem.parentNode;
  let elemParentHeight = elemParent.offsetHeight;
  let elemSubBlocks = elemParent.querySelector('.p-block__subblocks');
  if (elemSubBlocks){
    elemParent.style.height = elemParentHeight + 'px';
  }
  elem.addEventListener('click',function(e) {
    let pbBtn = elem.querySelector('.p-block__btn span');
    if (elemSubBlocks){
      let elemSubBlocksHeight = elemSubBlocks.querySelector('.container-fluid-max').offsetHeight;
      if (elemParent.classList.contains('active')){
        elemParent.style.height = elemParentHeight + 'px';
        elemParent.classList.remove('active');
        pbBtn.textContent = 'View All';
      }
      else{
        for(let i = 0; i < pbElem.length; i++){
          if (pbElem[i].parentNode.querySelector('.p-block__subblocks')){
            pbElem[i].querySelector('.p-block__btn span').textContent = 'View All';
          }
          else{
            pbElem[i].querySelector('.p-block__btn span').textContent = 'View';
          }
          pbElem[i].parentNode.style.height = elemParentHeight + 'px';
          pbElem[i].parentNode.classList.remove('active');
        }

        const anim = requestAnimationFrame((timestamp) => {
          const stamp = timestamp || new Date().getTime();
          const duration = 500;
          const start = stamp;

          const startScrollOffset = window.pageYOffset;
          const scrollEndElemTop = elemSubBlocks.getBoundingClientRect().top -200;

          scrollToElem(start, stamp, duration, scrollEndElemTop, startScrollOffset);
        })

        elemParent.classList.add('active');
        pbBtn.textContent = 'Close';
        elemParent.style.height = elemParentHeight + elemSubBlocksHeight + 32 + 'px';
      }
    }

    function hasParentWithMatchingSelector (target, selector) {
      return [...document.querySelectorAll(selector)].some(el =>
        el !== target && el.contains(target)
      )
    }

    if (! elemSubBlocks && ! hasParentWithMatchingSelector(elem, '.p-block__subblocks')){
      for(let i = 0; i < pbElem.length; i++){
        if (pbElem[i].parentNode.querySelector('.p-block__subblocks')){
          pbElem[i].querySelector('.p-block__btn span').textContent = 'View All';
        }
        else{
          pbElem[i].querySelector('.p-block__btn span').textContent = 'View';
        }
        pbElem[i].parentNode.classList.remove('active');
        pbElem[i].parentNode.style.height = elemParentHeight + 'px';
      }
    }

    setTimeout(function () {
      galleryImgLeave();
    }, 3000);

    if (! elemSubBlocks && elem.classList.contains('commercial')){
      let elemIndex = elem.getAttribute('data-index');
      commSlider.goTo(elemIndex);
      galleryComm.classList.add('active');
      document.querySelector('.wrapper').classList.add('active');
      document.querySelector('body').classList.add('overflow-hidden');
    }

    if (! elemSubBlocks && ! elem.classList.contains('commercial')){
      let elemIndex = elem.getAttribute('data-index');
      resSlider.goTo(elemIndex);
      galleryRes.classList.add('active');
      document.querySelector('.wrapper').classList.add('active');
      document.querySelector('body').classList.add('overflow-hidden');
    }
  })
}

window.onmousemove = function(e){
  for(let i = 0; i < galleryImg.length; i++){
    if (galleryImg[i].matches(":hover")){
      galleryImgOver();
    }
  }
}

for(let i = 0; i < galleryImg.length; i++){
  galleryImg[i].addEventListener("mouseleave", function(event){
    galleryImgLeave()
  }, false);
}

for(let i = 0; i < slideshowSortButtons.length; i++){
  slideshowSortButtons[i].addEventListener("mouseover", function(event){
    galleryImgOver()
  }, false);
}

for(let i = 0; i < slideshowControls.length; i++){
  slideshowControls[i].addEventListener("mouseover", function(event){
    galleryImgOver()
  }, false);
}

for(let i = 0; i < slideshowCount.length; i++){
  slideshowCount[i].addEventListener("mouseover", function(event){
    galleryImgOver()
  }, false);
}

let galleryBackBtn = document.querySelectorAll('.gallery .btn-back');
let galleryAll = document.querySelectorAll('.gallery');
for(let i = 0; i < galleryBackBtn.length; i++){
  galleryBackBtn[i].addEventListener('click',function(e) {
    for(let i = 0; i < galleryAll.length; i++){
      galleryImgOver();
      galleryAll[i].scrollTop = 0;
      galleryAll[i].classList.remove('active');
      document.querySelector('.wrapper').classList.remove('active');
      document.querySelector('body').classList.remove('overflow-hidden');
    }
  });
}

let galleryButtons = document.querySelectorAll('.tns-controls button');
for(let i = 0; i < galleryButtons.length; i++){
  galleryButtons[i].addEventListener('click',function(e) {
    for(let i = 0; i < galleryAll.length; i++){
      galleryAll[i].scrollTop = 0;
    }
  });
}


// Gallery Info Expand

let galleryHeading = document.querySelectorAll('.slideshow__info h3');
let slideshowListInnerAll = document.querySelectorAll('.slideshow__list-inner');

let arrayLength = slideshowListInnerAll.length;
let heights = [];
for (let i = 0; i < arrayLength; i++) {
    heights.push(slideshowListInnerAll[i].offsetHeight);
}
function getHighest() {
  return Math.max(...heights);
}
let tallest = getHighest();
for (let i = 0; i < slideshowListInnerAll.length; i++) {
    slideshowListInnerAll[i].style.height = tallest + "px";
}

for(let i = 0; i < galleryHeading.length; i++){
  let elem = galleryHeading[i];
  let slideshowList = elem.parentNode.querySelector('.slideshow__list');
  if (slideshowList){
    elem.classList.add('clickable');
  }
  elem.addEventListener('click',function(e) {
    if (elem.classList.contains('active')){
      for(let i = 0; i < galleryHeading.length; i++){
        if (galleryHeading[i].parentNode.querySelector('.slideshow__list')){
          galleryHeading[i].classList.remove('active');
          galleryHeading[i].parentNode.querySelector('.slideshow__list').style.height = 0 + 'px';
        }
      }
    }
    else{
      for(let i = 0; i < galleryHeading.length; i++){
        if (galleryHeading[i].parentNode.querySelector('.slideshow__list')){
          galleryHeading[i].classList.add('active');
          galleryHeading[i].parentNode.querySelector('.slideshow__list').style.height = tallest + 'px';
        }
      }
    }
  });
}


// Scroll to Anchor

const scrollElems = document.querySelectorAll('.rel-link');
for(let i = 0; i < scrollElems.length; i++){
  const elem = scrollElems[i];
  elem.addEventListener('click',function(e) {
    if (elem.classList.contains('site-nav__link')){
      e.preventDefault();
    }
   menu.classList.remove('active');
   toggleButton.classList.remove('is-pushed');

   let scrollElemId = this.getAttribute('data-href').split('#')[1];
   let hash = window.location.hash;

   if (hash === '#portfolio=commercial' && scrollElemId === 'about-res'){
     scrollElemId = 'about-comm';
   }

   const scrollEndElem = document.getElementById(scrollElemId);

   const anim = requestAnimationFrame((timestamp) => {
     const stamp = timestamp || new Date().getTime();
     const duration = 500;
     const start = stamp;

     const startScrollOffset = window.pageYOffset;
     const scrollEndElemTop = scrollEndElem.getBoundingClientRect().top + 1;

     scrollToElem(start, stamp, duration, scrollEndElemTop, startScrollOffset);
   })
})
}

// Form Validation

let formHandle = document.querySelector('form[name="contact-form"]');
if (formHandle) {
  let options = {
      eventsList: ['change', 'blur']
  };

  // Check if the field is not empty
  function checkEmpty(item) {
    if (item.value){
      item.classList.add('filled');
    }
    else{
      item.classList.remove('filled');
    }
  }
  let input = document.querySelectorAll('.form-control');
  for(let i = 0; i < input.length; i++){
    document.addEventListener('DOMContentLoaded',function(e) {
      checkEmpty(input[i]);
    });
    input[i].addEventListener('change',function(e) {
      checkEmpty(input[i]);
    });
    input[i].addEventListener('blur',function(e) {
      checkEmpty(input[i]);
    });
  }


  // Got to validation

  new Validator(formHandle, function (err, res) {
    if (res){
      var form = document.querySelector('form[name="contact-form"]');
      var btn = form.querySelector('button[type=submit]');
      var successContainer = document.querySelector('.contact__result');
      btn.innerHTML = 'Sending...';
      btn.disabled = true;
      grecaptcha.ready(function() {
        grecaptcha.execute('6LecW9IUAAAAACcUkxAr6ttOCkVIGkZD3pyo1Dz1', {action: 'homepage'}).then(function(token) {
          var data = new FormData(form);
          data.append('g-recaptcha-response', token);
          var request = new XMLHttpRequest();
          request.onload = function() {
            btn.innerHTML = 'Send <i class="icon icon-arrow-right"></i>';
            var response = {};
            try {
              response = JSON.parse(this.responseText);
            } catch(err) {}
            if (this.status === 200 && response.success) {
              form.reset();
              if (response.message) {
                successContainer.style.display = 'block';
                successContainer.classList.remove('error');
                successContainer.classList.add('success');
                successContainer.innerHTML = '<span>' + response.message + '</span>';
                btn.innerHTML = '<div class="ml-auto mr-auto">Thank you</div>';

                setTimeout(function () {
                  successContainer.classList.remove('success');
                  successContainer.style.display = 'none';
                  btn.innerHTML = 'Send <i class="icon icon-arrow-right"></i>';
                  btn.classList.remove('success');
                  btn.disabled = false;
                }, 10000);
              }
              return true;
            }
            else if (this.status === 200 && response.success === false) {
              successContainer.style.display = 'block';
              successContainer.classList.add('error');
              successContainer.innerHTML = '<span>' + response.message + '</span>';
              btn.disabled = false;
            }
            else {
              successContainer.style.display = 'block';
              successContainer.classList.add('error');
              successContainer.innerHTML = 'Something went wrong. Please, try again later.</span>';
              btn.disabled = false;
            }
          }
          request.onerror = function(err) {
            btn.innerHTML = 'Send <i class="icon icon-arrow-right"></i>';
            btn.disabled = false;
          }
          request.open(form.method, form.action);
          request.setRequestHeader('Content-type', 'application/json; charset=utf-8');
           var requestData = {};
           data.forEach(function(value, key) {
             requestData[key] = value;
           });
           request.send(JSON.stringify(requestData));
      });
    });
    }
    return false;
  }, options);
}
