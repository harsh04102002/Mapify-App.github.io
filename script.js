'use strict'
// prettier-ignore
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const form = document.querySelector('.form');
// const hidden = document.querySelector('.ds');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');
var mapEvent,map;

//getting postion and using geolocation API
navigator.geolocation.getCurrentPosition(function(position){
  const lat=position.coords.latitude;
  const long=position.coords.longitude;
  const arr=[lat ,long ];
// console.log(hidden.classList);

//Leaflet 
map = L.map('map').setView(arr, 13);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);
       map.on('click',function(mapEvnt){
       form.classList.remove('hidden');
       mapEvent=mapEvnt;    
    })
console.log(`https://www.google.com/maps/@${lat},@${long},7z`);
  
},function(){alert('Please allow for permission')});

// display form on click on map
form.addEventListener('submit',function(e){
    e.preventDefault();
    inputCadence.value=inputDistance.value=inputDuration.value=inputElevation.value='';
    const {lat,lng}=mapEvent.latlng;
        const brr=[lat,lng]
        L.marker(brr).addTo(map)
        .bindPopup(L.popup({
            maxwidth:250,
            minwidth:100,
            autoClose:false,
            closeOnClick:false,
                })).setPopupContent('Here are you!')
        .openPopup();
})
// change between cadence and elevation
inputType.addEventListener('change',function(){
    inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
    inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
    
})
