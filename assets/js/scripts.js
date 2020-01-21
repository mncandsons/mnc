objectFitImages();

// Tabs

var tabber = new HashTabber();
tabber.run();

// Get Year
let dateSelector = document.querySelector('.about-badge span');
if (dateSelector){
  let date = dateSelector.getAttribute('data-time');
  function getAge(dateString) {
      let today = new Date();
      let birthDate = new Date(dateString);
      let age = today.getFullYear() - birthDate.getFullYear();
      let m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
          age--;
      }
      return age;
  }
  dateSelector.textContent = getAge(date);
}


// Menu Toggle

let toggleButton = document.querySelector('.toggle-menu');
let menu = document.querySelector('.site-nav');

toggleButton.addEventListener('click',function(e){
  toggleButton.classList.toggle('is-pushed');
  menu.classList.toggle('active');
});


// Gallery

let lazyLoadInstance = new LazyLoad({
    elements_selector: ".lazy"
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
    swipeAngle: false
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
    swipeAngle: false
  });
}

let innerGallery = document.querySelectorAll('.slideshow-inside');
if (innerGallery) {
  forEach(innerGallery, function (index, value) {
    innerSlider = tns({
      container: value,
      mode: 'gallery',
      nav: true,
      controls: false,
      speed: 800,
      autoplayButtonOutput: false,
      touch: true,
      loop: false,
      nested: 'inner',
      mouseDrag: true,
      swipeAngle: false
    });
  });
}

// Set Data Index to Commercial blocks

let commercialRanges = document.querySelectorAll(".p-block.commercial");
for(var i = 0; i < commercialRanges.length; i++){
    commercialRanges[i].setAttribute('data-index', i);
}

// Portfolio blocks

let pbElem = document.querySelectorAll('.p-block');
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
      let elemSubBlocksHeight = elemSubBlocks.querySelector('.portfolio-container').offsetHeight;
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

let galleryBackBtn = document.querySelectorAll('.gallery .btn-back');
let galleryAll = document.querySelectorAll('.gallery');
for(let i = 0; i < galleryBackBtn.length; i++){
  galleryBackBtn[i].addEventListener('click',function(e) {
    for(let i = 0; i < galleryAll.length; i++){
      galleryAll[i].classList.remove('active');
      document.querySelector('.wrapper').classList.remove('active');
      document.querySelector('body').classList.remove('overflow-hidden');
    }
  });
}

// Gallery Info Expand

let galleryHeading = document.querySelectorAll('.slideshow__info h3');
for(let i = 0; i < galleryHeading.length; i++){
  let elem = galleryHeading[i];
  let slideshowList = elem.parentNode.querySelector('.slideshow__list');
  let slideshowListInner = elem.parentNode.querySelector('.slideshow__list-inner');
  let slideshowListHeight = slideshowListInner.offsetHeight;
  if (slideshowList){
    elem.classList.add('clickable');
  }
  elem.addEventListener('click',function(e) {
    if (elem.classList.contains('active')){
      elem.classList.remove('active');
      slideshowList.style.height = 0 + 'px';
    }
    else{
      elem.classList.add('active');
      slideshowList.style.height = slideshowListHeight + 'px';
    }
  });
}


// Scroll to Anchor

const scrollElems = document.querySelectorAll('.site-nav__link');
for(let i = 0; i < scrollElems.length; i++){
  const elem = scrollElems[i];
  elem.addEventListener('click',function(e) {
   e.preventDefault();

   menu.classList.remove('active');
   toggleButton.classList.remove('is-pushed');

   let scrollElemId = e.target.href.split('#')[1];
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


// Form Validation

let formHandle = document.querySelector('form[name="contact-form"]');
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
      grecaptcha.execute('6Leqb9EUAAAAANBVxAoiJhHl7kNiTv9_a8RZNWr9', {action: 'homepage'}).then(function(token) {
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
              btn.innerHTML = '<div class="text-center">Thank you</div>';

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
