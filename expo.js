'use strict'

//global variable
var tdis,dist;
var drone_velocity =0.0001;
const time_int = 5;
var latlngs = [];
var route = [];
var len;
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const form = document.querySelector('.form');
const delivery = document.querySelector('.delivery');
const pickup = document.querySelector('.pickup');
// const hidden = document.querySelector('.ds');
const containerWorkouts = document.querySelector('.workouts');
// const containerWorkout = document.querySelector('.workout');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');
// point generator function 
function getPoint(latlngs, cur_lat, cur_lng) {
     tdis = Math.pow((latlngs[len-1][0] - latlngs[len-2][0]), 2) + Math.pow((latlngs[len-1][1] - latlngs[len-2][1]), 2);
    tdis = Math.sqrt(tdis);
    console.log('vel',drone_velocity);
    var param =  drone_velocity / tdis;
    // var prev_dis = tdis;
  
     var new_lat = cur_lat + param * (latlngs[len-1][0] - latlngs[len-2][0]);
     var new_lng = cur_lng + param * (latlngs[len-1][1] - latlngs[len-2][1]);
  
    return [new_lat, new_lng];
  
  }

//distance calculator function
function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2-lat1);  // deg2rad below
  var dLon = deg2rad(lon2-lon1); 
  var a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ; 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var d = R * c; // Distance in km
  return d;
}

function deg2rad(deg) {
  return deg * (Math.PI/180)
}


class Workout{
constructor(coords,duration,distance){
this.coords=coords;
this.duration=duration;
this.distance=distance;
};


}
class Running extends Workout {
    constructor(type,coords,duration,distance,cadence){
   super(coords,duration,distance);
    this.cadence=cadence;
    this.type=type;    

}

calcPace(){
    
    return this.distance/this.duration;
}

}


class Cycling extends Workout {
    constructor(type,coords,duration,distance,elevationGain){
   super(coords,duration,distance);
    this.elevationGain=elevationGain;    
   this.type=type;
}
calcPace(){
    return this.distance/this.duration;
}
}
class  App{
    
   
    #map;
    #mapEvent;
    // #brr
constructor(){
    this._getPosition();
    form.addEventListener('submit',this._newWorkout.bind(this));
    inputType.addEventListener('change',this._interchange)
    // this._loadRoute=this;
}

_getPosition(){

    navigator.geolocation.getCurrentPosition(this._loadMap.bind(this),function(){alert('Invalid Response')});
   
    
}


_loadMap(position){
    const lats=position.coords.latitude;
    const long=position.coords.longitude;

    const arr=[lats ,long ];
    this.L=L;
    
    this.#map = L.map('map').setView(arr, 13);  
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.#map);
    
   
    this.#map.on('click',function(mapEvnt){
        var newMarker = L.marker([mapEvnt.latlng.lat, mapEvnt.latlng.lng]).addTo(this.#map);
        latlngs.push([mapEvnt.latlng.lat,mapEvnt.latlng.lng]);
        len=latlngs.length;
        if(len%2!=0)
        { 
          console.log('sjdk');
          delivery.classList.remove('hidden');
          pickup.classList.add('hidden');
          
        }
        if (len%2 == 0) {
         
          dist=getDistanceFromLatLonInKm(latlngs[len-2][0],latlngs[len-2][1],latlngs[len-1][0],latlngs[len-1][1]);  
          form.classList.remove('hidden');
          this.#mapEvent=mapEvnt; 
       
        } 


    // Code to open the form 
        
     }.bind(this))
    //  this.#map.on('click',this._displayform.bind(this));

    }
_loadRoute(){
  
// creating a poyline between start and destination 
var arr=[latlngs[len-2],latlngs[len-1]];
  var polyline = this.L.polyline(arr, {
  color: 'blue'
}).addTo(this.#map);
  this.#map.fitBounds(polyline.getBounds());

// pushing the initial coordinates to route 
route.push(latlngs[len-2]);
// to store the starting index for the next order as the route will be filled after the first order 
this.prev=route.length-1;
console.log(this.prev);
//calculating total distance from intial and final coords
 tdis = Math.pow((latlngs[len-1][0] - route[len-2][0]), 2) + Math.pow((latlngs[len-1][1] - route[len-2][1]), 2);
var prev_dis = tdis;

var prev_lat = latlngs[len-2][0];
var prev_lng = latlngs[len-2][1];

var idx = 1;
for (idx = 1; ; idx++) 
{
   var next_pt = getPoint(latlngs, prev_lat, prev_lng);  //getting next point from the current point 
   var cur_dis = Math.pow((latlngs[len-2][0] - next_pt[0]), 2) + Math.pow((latlngs[len-2][1] - next_pt[1]), 2); //current distance with the destination
   if (cur_dis > prev_dis)
    break;
  route.push(next_pt);     //pushing the point into our route 
  prev_lat = next_pt[0];   //updating prrevious coordinates to current 
  prev_lng = next_pt[1];
}

}
_newWorkout(e){
  let workout;
  e.preventDefault();
  
  this.month=months[new Date().getMonth()];
    this.date=(new Date()).getDate();
    //get data from form
    // console.log(this.date);
    
    const {lat,lng}=this.#mapEvent.latlng;
    const brr=[lat,lng]
    //check data validity 
     if(inputDuration.value<0)
     {
        alert('Input values should be positive');
     }
     else{
    //if workout ,create workout object
     if(inputType.value=='lightweight')
    {    workout=new Running('light',brr,inputDuration.value,(dist),10);
         this.event='Order of '+this.month+' '+this.date;
    }
        //if cyceling create  cycling object
    else{
        workout=new Cycling('heavy',brr,inputDuration.value,dist,10);
         this.event='Order of '+this.month+' '+this.date;
    }   
    //render this data on map
    // L.marker(brr).addTo(this.#map)
    //     .bindPopup(L.popup({
    //         maxwidth:250,
    //         minwidth:100,
    //         autoClose:false,
    //         closeOnClick:false,
    //             })).setPopupContent(this.event)
    //     .openPopup();
    drone_velocity=0.0005*dist/inputDuration.value;
// console.log('calcpace',drone_velocity);
    console.log('vel32',drone_velocity);
    this._loadRoute();  
    route.push(latlngs[len-1]); 
     console.log('route',route);
    var marker = this.L.marker(latlngs[len-2], {}).addTo(this.#map);
    var n=route.length;
    //  marker.setLatLng([route[4][0],route[4][1]]);
    console.log('prevhere',this.prev);
    var cc=0;
    for(let i=this.prev;i<route.length;i++)
    //  route.forEach(function (coord, index) 
    {
      
      setTimeout(function () {
        marker.setLatLng([route[i][0],route[i][1]]);
        
        // marker.setLatLng([coord[0],coord[1]]);
        // var polyline = L.polyline([latlngs[0],[coord[0], coord[1]]], {
       //   color: 'red'
       // }).addTo(map);
       // map.fitBounds(polyline.getBounds());
       
      }, 50 * cc)
    cc++;
    }
    //set the message again
    pickup.classList.remove('hidden');
    delivery.classList.add('hidden');
    //render this data as block
     this._renderBlock(workout);
    
     //hide the form
     this._hideform(workout);
            }
    
}

_hideform(workout){
    inputDuration.value=inputElevation.value='';
    form.style.display='none';
    form.classList.add('hidden');
    setTimeout(() => (form.style.display = 'grid'), 2000);
    
  }

  
_renderBlock(workout){
    
     let html=`<li class="workout workout--running" data-id="1234567890">
     <h2 class="workout__title">${this.event}</h2>
     <div class="workout__details">
     <span class="workout__icon">${workout.type=='run'?'🏃‍♂️':'🚴‍♀️'}</span>
     <span class="workout__value">${workout.distance}</span>
     <span class="workout__unit">km</span>
   </div>  
     <div class="workout__details">
       <span class="workout__icon">⏱</span>
       <span class="workout__value">${workout.duration}</span>
       <span class="workout__unit">min</span>
     </div>
     <div class="workout__details">
     <span class="workout__icon">⚡️</span>
     <span class="workout__value">${workout.calcPace()}</span>
     <span class="workout__unit">km/min</span>
   </div>
     `;
     if(workout.type=='run')
     {
        html+=`   
      <div class="workout__details">
        <span class="workout__icon">🦶🏼</span>
        <span class="workout__value">${workout.cadence}</span>
        <span class="workout__unit">spm</span>
      </div>`
     }
     else
     {
        html+=`   
      <div class="workout__details">
        <span class="workout__icon">🦶🏼</span>
        <span class="workout__value">${workout.elevationGain}</span>
        <span class="workout__unit">spm</span>
      </div>`
     }
     html+=`<\li>`;
     form.insertAdjacentHTML('afterend',html);
}
_interchange(){
    // inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
    inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
    
}










};
//getting postion and using geolocation API
 const myapp=new App();

// display form on click on map

// change between cadence and elevation

