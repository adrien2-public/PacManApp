const canvas = document.querySelector('canvas'); // we are selecting canvas element
// we have a canvas element

const scoreElement = document.querySelector('#scoreElement'); 
const c = canvas.getContext('2d'); // this is the canvas context, it allows us to perform work within the context of the canvas we choose
// we are using the 2D API

console.log(canvas);

canvas.width = window.innerWidth; // innerwidth and height are properties inherent to window
canvas.height = window.innerHeight * .95;



var sock = new SockJS('http://localhost:8081/app/');
sock.onopen = function() {
    console.log('open');
    sock.send('test');
};

sock.onmessage = function(e) {
    console.log('message', e.data);
    sock.close();
};

sock.onclose = function() {
    console.log('close');
};

/*
//function connect() {
  var socket = new SockJS('http://localhost:8081');
  stompClient = Stomp.over(socket);  
  stompClient.connect({}, function(frame) {
      setConnected(true);
      console.log('Connected: ' + frame);

  });
//}

function disconnect() {
  if(stompClient != null) {
      stompClient.disconnect();
  }
  setConnected(false);
  console.log("Disconnected");
}

//connect();
*/


/******************* */
/* Generate Boundary */

/*
Boundaries are interconected squares, in the future these squares must be set as limits that cannot be touched by our circles/items
*/

class Boundary{

    static width = 40; // static values are used so that we will not have to repeat in many places
    static height = 40;

    constructor({position, image}){
        this.position = position;
        this.width = 40;
        this.height = 40;  
        this.image = image;  
    }


    draw(){
        /*
        c.fillStyle = 'blue';
        c.fillRect(this.position.x, this.position.y, this.width, this.height);
        */
        c.drawImage(this.image, this.position.x, this.position.y);
    }


}

class Pellet {
    constructor({position}){

        this.position = position;
        this.radius = 3;
    }

    draw(){
        c.beginPath();
        c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
        c.fillStyle = 'white';
        c.fill();
        c.closePath();
    }

}

const boundary = new Boundary({
    position: {x:0, y:0}

})


class Player {
    constructor({position, velocity}){

        this.position = position;
        this.velocity = velocity;
        this.radius = 15;
    }

    draw(){
        c.beginPath();
        c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
        c.fillStyle = 'yellow';
        c.fill();
        c.closePath();
    }

    update(){
        this.draw();
        this.position.x += this.velocity.x ;
        this.position.y += this.velocity.y ;
    }

}

class Ghost {
  static  myspeed = 5;
    constructor({position, velocity, color = 'red', speed }){

        this.position = position;
        this.velocity = velocity;
        this.color = color;
        this.radius = 15;
        this.previousCollison = [];
        this.speed = speed ;
    
      }

    draw(){
        c.beginPath();
        c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
        c.fillStyle =  this.color;
        c.fill();
        c.closePath();
    }

    update(){
        this.draw();
        this.position.x += this.velocity.x ;
        this.position.y += this.velocity.y ;
    }

}

const player = new Player({
    position:{
        x: Boundary.width + Boundary.width/2 , 
        y: Boundary.height +  Boundary.height/2
    },
    velocity: {
        x: 0 ,
        y: 0
    }

})

/*
                x: j * Boundary.width*4 + Boundary.width / 2,
                y: i * Boundary.height + Boundary.height / 2

*/

/*
const ghosts = [
  new Ghost({
  
  position: {
      x:  Boundary.width*6 + Boundary.width / 2,
      y:  Boundary.height + Boundary.height / 2
  },
  velocity: {
      x: Ghost.speed,
      y: 0
  }
  
  })
  
  ] ;
*/

const ghosts = [
new Ghost({

position: {
    x:  Boundary.width*6 + Boundary.width / 2,
    y:  Boundary.height + Boundary.height / 2
},
velocity: {
    x: Ghost.myspeed,
    y: 0
},
speed: 2

}),
new Ghost({

  position: {
      x:  Boundary.width*8 + Boundary.width / 2,
      y:  Boundary.height + Boundary.height / 2
  },
  velocity: {
      x: Ghost.myspeed,
      y: 0
  }, 
  color: 'green' 
  ,
  speed: 5
  
  })

] 
 

const pellets = [];
const boundaries = [];


const myMap = [
    ['1', '-', '-', '-', '-', '-', '-', '-', '-', '-', '2'],
    ['|', '.', '.', '.', '.', '.', '.', '.', '.', '.', '|'],
    ['|', '.', 'b', '.', '[', '7', ']', '.', 'b', '.', '|'],
    ['|', '.', '.', '.', '.', '_', '.', '.', '.', '.', '|'],
    ['|', '.', '[', ']', '.', '.', '.', '[', ']', '.', '|'],
    ['|', '.', '.', '.', '.', '^', '.', '.', '.', '.', '|'],
    ['|', '.', 'b', '.', '[', '+', ']', '.', 'b', '.', '|'],
    ['|', '.', '.', '.', '.', '_', '.', '.', '.', '.', '|'],
    ['|', '.', '[', ']', '.', '.', '.', '[', ']', '.', '|'],
    ['|', '.', '.', '.', '.', '^', '.', '.', '.', '.', '|'],
    ['|', '.', 'b', '.', '[', '5', ']', '.', 'b', '.', '|'],
    ['|', '.', '.', '.', '.', '.', '.', '.', '.', 'p', '|'],
    ['4', '-', '-', '-', '-', '-', '-', '-', '-', '-', '3']
  ];

function createImage(src){
    const image = new Image();
    image.src = src;
    return image;
}


 
 

// Additional cases (does not include the power up pellet that's inserted later in the vid)
myMap.forEach((row, i) => {
    row.forEach((symbol, j) => {
      switch (symbol) {
        case '-':
          boundaries.push(
            new Boundary({
              position: {
                x: Boundary.width * j,
                y: Boundary.height * i
              },
              image: createImage('./images/pipeHorizontal.png')
            })
          )
          break
        case '|':
          boundaries.push(
            new Boundary({
              position: {
                x: Boundary.width * j,
                y: Boundary.height * i
              },
              image: createImage('./images/pipeVertical.png')
            })
          )
          break
        case '1':
          boundaries.push(
            new Boundary({
              position: {
                x: Boundary.width * j,
                y: Boundary.height * i
              },
              image: createImage('./images/pipeCorner1.png')
            })
          )
          break
        case '2':
          boundaries.push(
            new Boundary({
              position: {
                x: Boundary.width * j,
                y: Boundary.height * i
              },
              image: createImage('./images/pipeCorner2.png')
            })
          )
          break
        case '3':
          boundaries.push(
            new Boundary({
              position: {
                x: Boundary.width * j,
                y: Boundary.height * i
              },
              image: createImage('./images/pipeCorner3.png')
            })
          )
          break
        case '4':
          boundaries.push(
            new Boundary({
              position: {
                x: Boundary.width * j,
                y: Boundary.height * i
              },
              image: createImage('./images/pipeCorner4.png')
            })
          )
          break
        case 'b':
          boundaries.push(
            new Boundary({
              position: {
                x: Boundary.width * j,
                y: Boundary.height * i
              },
              image: createImage('./images/block.png')
            })
          )
          break
        case '[':
          boundaries.push(
            new Boundary({
              position: {
                x: j * Boundary.width,
                y: i * Boundary.height
              },
              image: createImage('./images/capLeft.png')
            })
          )
          break
        case ']':
          boundaries.push(
            new Boundary({
              position: {
                x: j * Boundary.width,
                y: i * Boundary.height
              },
              image: createImage('./images/capRight.png')
            })
          )
          break
        case '_':
          boundaries.push(
            new Boundary({
              position: {
                x: j * Boundary.width,
                y: i * Boundary.height
              },
              image: createImage('./images/capBottom.png')
            })
          )
          break
        case '^':
          boundaries.push(
            new Boundary({
              position: {
                x: j * Boundary.width,
                y: i * Boundary.height
              },
              image: createImage('./images/capTop.png')
            })
          )
          break
        case '+':
          boundaries.push(
            new Boundary({
              position: {
                x: j * Boundary.width,
                y: i * Boundary.height
              },
              image: createImage('./images/pipeCross.png')
            })
          )
          break
        case '5':
          boundaries.push(
            new Boundary({
              position: {
                x: j * Boundary.width,
                y: i * Boundary.height
              },
              color: 'blue',
              image: createImage('./images/pipeConnectorTop.png')
            })
          )
          break
        case '6':
          boundaries.push(
            new Boundary({
              position: {
                x: j * Boundary.width,
                y: i * Boundary.height
              },
              color: 'blue',
              image: createImage('./images/pipeConnectorRight.png')
            })
          )
          break
        case '7':
          boundaries.push(
            new Boundary({
              position: {
                x: j * Boundary.width,
                y: i * Boundary.height
              },
              color: 'blue',
              image: createImage('./images/pipeConnectorBottom.png')
            })
          )
          break
        case '8':
          boundaries.push(
            new Boundary({
              position: {
                x: j * Boundary.width,
                y: i * Boundary.height
              },
              image: createImage('./images/pipeConnectorLeft.png')
            })
          )
          break
        case '.':
          pellets.push(
            new Pellet({
              position: {
                x: j * Boundary.width + Boundary.width / 2,
                y: i * Boundary.height + Boundary.height / 2
              }
            })
          )
          break
      }
    })
  })

 


 
let score = 0;
let lastKey = '';

const keys = {
// to hel determine the keys that are currently being pressed down

ArrowUp: {
    pressed: false
    },
    ArrowLeft: {
        pressed: false
    },
    ArrowDown: {
        pressed: false
    },
    ArrowRight : {
        pressed: false
    }

}

window.addEventListener('keydown', (event) =>{

    event.preventDefault();
    const key = event.key;
    console.log(key); 
    switch(key){
        case 'ArrowUp':
            keys.ArrowUp.pressed = true;
            lastKey = 'ArrowUp';
            break;
        case 'ArrowLeft' :
            keys.ArrowLeft.pressed = true;
            lastKey = 'ArrowLeft';
            break;
         case 'ArrowDown' :
            keys.ArrowDown.pressed = true;
            lastKey = 'ArrowDown';
            break;
        case 'ArrowRight' :
            keys.ArrowRight.pressed = true;
            lastKey = 'ArrowRight';
            break;  


               
    }
})

window.addEventListener('keyup', ({key}) =>{
    console.log(key); 
    switch(key){
        case 'ArrowUp':
            keys.ArrowUp.pressed = false;
            lastKey ;
            break;
        case 'ArrowLeft' :
            keys.ArrowLeft.pressed = false;
            lastKey ;
            break;
         case 'ArrowDown' :
            keys.ArrowDown.pressed = false;
            lastKey ;
            break;
        case 'ArrowRight' :
            keys.ArrowRight.pressed = false;
            lastKey ;
            break;   

            
    }
})



let animationId   ; 

function animate(){

   animationId =  requestAnimationFrame(animate);
    c.clearRect(0,0, canvas.width, canvas.height);


for(let i = pellets.length - 1; 0 < i; i--){

    const pellet = pellets[i];
    pellet.draw();

    if(Math.hypot(
        pellet.position.x - player.position.x, pellet.position.y - player.position.y ) < pellet.radius + player.radius ){
        console.log("touching pellets");
        pellets.splice(i,1);
        score += 10 ;
        scoreElement.innerHTML = score;
        } 
}





    boundaries.forEach((boundary) => {
        
        boundary.draw();
        if(circleCollidesWithRectange({circle: player, rectangle: boundary })){
                
                console.log("you are colliding with borders");
                player.velocity.y = 0;
                player.velocity.x = 0;
                
            }

    });

    player.update();

/*
    ghosts.forEach( (ghost) => { 
       ghost.update();    
       const collisions = [];   

       boundaries.forEach( (boundary) => {

        if(!collisions.includes('right')  && circleCollidesWithRectange({
          circle: {
            ...ghost,
            velocity: {
              x: ghost.speed,
              y: 0
            }
          },
          rectangle: boundary
        })){
          collisions.push('right');
        }

        
          if( !collisions.includes('left') && circleCollidesWithRectange({
            circle: {
              ...ghost,
              velocity: {
                x: -ghost.speed,
                y: 0
              }
            },
            rectangle: boundary
          })){
            collisions.push('left');
          }

          
          if( !collisions.includes('up') && circleCollidesWithRectange({
            circle: {
              ...ghost,
              velocity: {
                x: 0,
                y: -ghost.speed
              }
            },
            rectangle: boundary
          })){
            collisions.push('up');
          }


          if( !collisions.includes('down') && circleCollidesWithRectange({
            circle: {
              ...ghost,
              velocity: {
                x: 0,
                y: ghost.speed
              }
            },
            rectangle: boundary
          })){
            collisions.push('down');
          }

       })

       if(collisions.length > ghost.previousCollison.length){
         ghost.previousCollison = collisions;
         //console.log(collisions);
       }

       if( JSON.stringify(collisions) !== JSON.stringify(ghost.previousCollison) ){
        console.log(collisions);

        if(ghost.velocity.x > 0){
          ghost.previousCollison.push('right');
        }else if (ghost.velocity.x < 0){
          ghost.previousCollison.push('left');
        }else if(ghost.velocity.y > 0){
          ghost.previousCollison.push('down');
        }else if (ghost.velocity.y < 0){
          ghost.previousCollison.push('up');
        }

        const pathways = ghost.previousCollison.filter((collision) => {
          return !collisions.includes(collision);
        })

        console.log(pathways);
       
      const direction = pathways[Math.floor(Math.random() * pathways.length)] ;
      console.log(direction);
      

      switch(direction){
        case 'down:':
          ghost.velocity.y = ghost.speed;
          ghost.velocity.x = 0;
          break;
        case 'up':
          ghost.velocity.y = -ghost.speed;
          ghost.velocity.x = 0;
          break;
        case 'left':
          ghost.velocity.y = 0;
          ghost.velocity.x = -ghost.speed;
          break;
        case 'right':
          ghost.velocity.y = 0;
          ghost.velocity.x = ghost.speed;
          break;
      }

      ghost.previousCollison = [] ;

      }


    })
    */
  
    ghosts.forEach( (ghost) => { 
      ghost.update();    

      if(Math.hypot(ghost.position.x - player.position.x, ghost.position.y - player.position.y) < ghost.radius + player.radius){
          cancelAnimationFrame(animationId);
          console.log("you lose");

          disconnect();
      }


      const collisions = [];   

      boundaries.forEach( boundary => {

       if(!collisions.includes('right')  && circleCollidesWithRectange({
         circle: {
           ...ghost,
           velocity: {
             x: ghost.speed,
             y: 0
           }
         },
         rectangle: boundary
       })){
         collisions.push('right');
       }

       
         if( !collisions.includes('left') && circleCollidesWithRectange({
           circle: {
             ...ghost,
             velocity: {
               x: -ghost.speed,
               y: 0
             }
           },
           rectangle: boundary
         })){
           collisions.push('left');
         }

         
         if( !collisions.includes('up') && circleCollidesWithRectange({
           circle: {
             ...ghost,
             velocity: {
               x: 0,
               y: -ghost.speed
             }
           },
           rectangle: boundary
         })){
           collisions.push('up');
         }


         if( !collisions.includes('down') && circleCollidesWithRectange({
           circle: {
             ...ghost,
             velocity: {
               x: 0,
               y: ghost.speed
             }
           },
           rectangle: boundary
         })){
           collisions.push('down');
         }

      })

      //console.log(collisions);


      if(collisions.length > ghost.previousCollison.length){
        ghost.previousCollison = collisions;
        console.log('collisions: ' + collisions);
      }

      if( JSON.stringify(collisions) !== JSON.stringify(ghost.previousCollison) ){
       console.log('collisions: ' + collisions);

       if(ghost.velocity.x > 0){
         ghost.previousCollison.push('right');
       }else if (ghost.velocity.x < 0){
         ghost.previousCollison.push('left');
       }else if(ghost.velocity.y > 0){
         ghost.previousCollison.push('down');
       }else if (ghost.velocity.y < 0){
         ghost.previousCollison.push('up');
       }

       const pathways = ghost.previousCollison.filter((collision) => {
         return !collisions.includes(collision);
       })

       console.log(pathways);
     
     const direction = pathways[Math.floor(Math.random() * pathways.length)] ;
     console.log(direction);
     
 
/*
              
                stompClient.send("/app/chat", {}, 
                  JSON.stringify({'animationid':animationId, 'color':text , 'direction': direction }));
*/

     console.log('animationid: ' + animationId ,'color: ' +   ghost.color , 'direction: ' + direction  );
    

     switch(direction){
       case 'down':
         ghost.velocity.y = ghost.speed;
         ghost.velocity.x = 0;
         break;
       case 'up':
         ghost.velocity.y = -ghost.speed;
         ghost.velocity.x = 0;
         break;
       case 'left':
         ghost.velocity.y = 0;
         ghost.velocity.x = -ghost.speed;
         break;
       case 'right':
         ghost.velocity.y = 0;
         ghost.velocity.x = ghost.speed;
         break;
     }

 ghost.previousCollison = [] ;
     

     }


   })
 



  if(keys.ArrowUp.pressed && ( lastKey === 'ArrowUp')  ) {

    

        for(let i = 0; i < boundaries.length; i++){
            const boundary = boundaries[i];

            if(circleCollidesWithRectange({circle: {...player, velocity: {x: 0, y: -5}}, rectangle: boundary })){        
                player.velocity.y = 0;
                break;
            }else{
                player.velocity.y = -5;
            }
        }

       

  

   
 
    }else if(keys.ArrowLeft.pressed && (lastKey === 'ArrowLeft')  ) {

        
        for(let i = 0; i < boundaries.length; i++){
            const boundary = boundaries[i];

            if(circleCollidesWithRectange({circle: {...player, velocity: {x: -5, y: 0}}, rectangle: boundary })){        
                player.velocity.x = 0;
                break;
            }else{
                player.velocity.x = -5;
            }
        }
        

    }else if(keys.ArrowDown.pressed && ( lastKey === 'ArrowDown') ) {


        for(let i = 0; i < boundaries.length; i++){
            const boundary = boundaries[i];

            if(circleCollidesWithRectange({circle: {...player, velocity: {x: 0, y: 5}}, rectangle: boundary })){        
                player.velocity.y = 0;
                break;
            }else{
                player.velocity.y = 5;
            }
        }

 
         


    }else if(keys.ArrowRight.pressed && ( lastKey === 'ArrowRight') ) {


        for(let i = 0; i < boundaries.length; i++){
            const boundary = boundaries[i];

            if(circleCollidesWithRectange({circle: {...player, velocity: {x: 5, y: 0}}, rectangle: boundary })){        
                player.velocity.x = 0;
                break;
            }else{
                player.velocity.x = 5;
            }
        }


    }

 
//win condition

if(pellets.length === 0){
  cancelAnimationFrame(animationId);
  console.log('you win');
}

}

animate();




function circleCollidesWithRectange({ circle, rectangle}){

  const padding = Boundary.width / 2 - circle.radius - 1;
    return (circle.position.y - circle.radius + circle.velocity.y <= rectangle.position.y + rectangle.height + padding &&
        circle.position.x + circle.radius + circle.velocity.x >= rectangle.position.x - padding &&
        circle.position.y + circle.radius + circle.velocity.y >= rectangle.position.y - padding &&
        circle.position.x - circle.radius + circle.velocity.x <= rectangle.position.x + rectangle.width + padding )
};


