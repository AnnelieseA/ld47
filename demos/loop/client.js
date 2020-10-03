console.log('hello stuck loop world')

const $ = require('jquery')

$('body').addClass('bg-silver')

//CIRCLE A:
$('body').append(`
  <div class="absolute bg-white inline-block p4 z2" 
     style="border-radius: 100%; width:100px; height: 100px; 
     top: 100px;
     left: 100px;
     ">
      &nbsp;
  </div>
`)

//CIRCLE B:
$('body').append(`
  <div class="absolute bg-black inline-block p4 z2" 
     style="border-radius: 100%; width:100px; height: 100px; 
     top: 240px;
     left: 282px;
     ">
      &nbsp;
  </div>
`)


//CIRCLE tether:
$('body').append(`
  <div class="absolute inline-block p4 border-2 z1 border-gray" 
     style="border-radius: 100%; width:100px; height: 100px; 
      top: 165px;
      left: 181px;
      transform: scale3d(2,2,2);
     ">
      &nbsp;
  </div>
`)