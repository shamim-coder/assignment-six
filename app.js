const imagesArea = document.querySelector('.images');
const gallery = document.querySelector('.gallery');
const galleryHeader = document.querySelector('.gallery-header');
const searchBtn = document.getElementById('search-btn');
const sliderBtn = document.getElementById('create-slider');
const sliderContainer = document.getElementById('sliders');
const searchInput = document.getElementById('search')
const duration = document.getElementById('duration')
const imageCount = document.getElementById('image-count');
// selected image 
let sliders = [];


// If this key doesn't work
// Find the name in the url and go to their website
// to create your own api key
const KEY = '15674931-a9d714b6e9d654524df198e00&q';

// show images 
const showImages = (images) => {
  imagesArea.style.display = 'block';
  gallery.innerHTML = '';
  // show gallery title
  galleryHeader.style.display = 'flex';
  setSpinner()

  images.forEach(image => {
    const div = document.createElement('div');
    const mainDiv = document.createElement('div');
    const iconDiv = document.createElement('div');
    mainDiv.appendChild(div)

    iconDiv.className = 'image-icons'
    div.className = 'image-icons-container'
    iconDiv.innerHTML = `
    <i class="far fa-thumbs-up"> ${image.likes} </i> 
    <i class="far fa-star"> ${image.favorites} </i>
    <i class="far fa-comment"> ${image.comments} </i>`;
    mainDiv.className = 'col-lg-3 col-md-4 col-xs-6 img-item mb-4 image-area';
    div.innerHTML = `<img class="img-fluid img-thumbnail" onclick=selectItem(event,"${image.webformatURL}") src="${image.webformatURL}" alt="${image.tags}">`;
    div.appendChild(iconDiv)
    gallery.appendChild(mainDiv)

  })

}

const getImages = (query) => {
  setSpinner()
  fetch(`https://pixabay.com/api/?key=${KEY}=${query}&image_type=photo&pretty=true`)
    .then(response => response.json())
    .then(data => showImages(data.hits))
    .catch(err => console.log(err))
}

// Select Image Item
let slideIndex = 0;
const selectItem = (event, img) => {
  let element = event.target;
  element.classList.toggle('added');
  let item = sliders.indexOf(img);
  
  if (item === -1) {
    sliders.push(img);
    
  } else if (item || item === 0) {
    sliders.splice(item, 1);
  }

  imageCount.innerText = `${sliders.length} Images Selected`;
}
var timer
const createSlider = () => {
  // check slider image length
  if (sliders.length < 2) {
    alert('Select at least 2 image.')
    return;
  }
  // crate slider previous next area
  sliderContainer.innerHTML = '';
  const prevNext = document.createElement('div');
  prevNext.className = "prev-next d-flex w-100 justify-content-between align-items-center";
  prevNext.innerHTML = ` 
  <span class="prev" onclick="changeItem(-1)"><i class="fas fa-chevron-left"></i></span>
  <span class="next" onclick="changeItem(1)"><i class="fas fa-chevron-right"></i></span>
  `;

  sliderContainer.appendChild(prevNext)
  document.querySelector('.main').style.display = 'block';
  // hide image aria
  imagesArea.style.display = 'none';

  const duration = Math.abs(document.getElementById('duration').value) || 1500;
  document.getElementById('duration').value = ''
  sliders.forEach(slide => {
    let item = document.createElement('div')
    item.className = "slider-item";
    item.innerHTML = `<img class="w-100"
    src="${slide}"
    alt="">`;
    sliderContainer.appendChild(item)
  })
  changeSlide(0)
  timer = setInterval(() => {
    slideIndex++;
    changeSlide(slideIndex);
  }, duration);
}

// change slider index 
const changeItem = index => {
  changeSlide(slideIndex += index);
}

// change slide item
const changeSlide = (index) => {

  const items = document.querySelectorAll('.slider-item');
  if (index < 0) {
    slideIndex = items.length - 1
    index = slideIndex;
  };

  if (index >= items.length) {
    index = 0;
    slideIndex = 0;
  }

  items.forEach(item => {
    item.style.display = "none"
  })

  items[index].style.display = "block"
}

// Add Key Press Event
const enterPress = (inputId, btnId) => {
  inputId.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
      btnId.click()
    }
  })
}

enterPress(searchInput, searchBtn)
enterPress(duration, sliderBtn)

// Search Images
searchBtn.addEventListener('click', () => {
  gallery.innerHTML = ''
  document.querySelector('.main').style.display = 'none';
  clearInterval(timer);
  const search = document.getElementById('search');
  getImages(search.value)
  sliders.length = 0;
  imageCount.innerText = ''
  search.value = ''
})

sliderBtn.addEventListener('click', () => {
  createSlider()
})

// Add Spinner
const setSpinner = () => {
  const spinner = document.getElementById('spinner')
  spinner.classList.toggle('d-none')
}