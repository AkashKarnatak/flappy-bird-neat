let canvas = document.querySelector("canvas");
canvas.height = 660;
canvas.width = 550;
let c = canvas.getContext("2d");

// global game variables
//--------------------------------------------------------------------------------------------------------------------------------
let frameCount = 0;
let score = 0;
let moveGround = 0;
let closestEnemy = [];
let stopId = undefined;
let timeLapse = 1;
let Score = 0;
let showBest= false;

let bird = new Image();
let pipeTop = new Image();
let pipeBottom = new Image();
let background = new Image();
let ground = new Image();

bird.src = "images/Bird.png";
pipeTop.src = "images/pipeTop.png";
pipeBottom.src = "images/pipeBottom.png";
background.src = "images/background.png";
ground.src = "images/ground.png";


bird.addEventListener("load", () => c.drawImage(bird, 0, 0));
pipeTop.addEventListener("load", () => c.drawImage(pipeTop, 0, 0));
pipeBottom.addEventListener("load", () => c.drawImage(pipeBottom, 0, 0,));
background.addEventListener("load", () => c.drawImage(background, 0, 0));
ground.addEventListener("load", () => c.drawImage(ground, 0, 0));


//--------------------------------------------------------------------------------------------------------------------------------

//global neat variables
//--------------------------------------------------------------------------------------------------------------------------------
let noOfInputNodes = 2;
let noOfOutputNodes = 1;
let noOfPlayers = 1000;
let generation = 1;

let networkWindow = {
                        x      : canvas.width - 200,
                        y      : canvas.height - 200,
                        width  : 200,
                        height : 200
                    };

//--------------------------------------------------------------------------------------------------------------------------------


for(let i = 0; i < noOfPlayers; i++){
    Neat.players.push(new Player());
}

let channel = [0,0,0,0,0];

function drawBackground(){

    c.drawImage(background, 0, 0, canvas.width, canvas.height);

}

function drawGround(){

    if(moveGround + canvas.width <= 0){
        moveGround = 0;
    }
    c.drawImage(ground, moveGround, canvas.height - 30, 2 * canvas.width, 30);
    c.drawImage(ground, moveGround + canvas.width, canvas.height - 30, 2 * canvas.width, 30);

}

function restart(){

    score = 0;
    Score = 0;
    frameCount = 0;
    moveGround = 0;
    stopId = undefined;
    // timeLapse = 1;
    PipePair.pipeList = [new PipePair()];
}


addEventListener("keydown", (event) => {
    if(event.keyCode == 221){
        timeLapse++;
    } else if(event.keyCode == 219){
        timeLapse--;
    } else if(event.keyCode == 32){
        humanPlayer.velocity = -7;
    } else if(event.keyCode == 83){
        showBest = true;
    }
});

function findClosestPipe(){

    if(PipePair.pipeList.length == 1){
        return PipePair.pipeList[0];
    } else if(PipePair.pipeList.length == 2){
        let distance = PipePair.pipeList[0].x + PipePair.width - 0.2 * canvas.width;
        if(distance >= 0){
            return PipePair.pipeList[0];
        } else {
            return PipePair.pipeList[1];
        }
    }
    console.log("Unexpected Error");
    return new PipePair();

}

PipePair.pipeList.push(new PipePair())

// display everything
function animate(){

    
    drawBackground();
   
    for(let pipe of PipePair.pipeList){
        pipe.show();
        // pipe.update();
    }

    // for debugging purpose
    // c.beginPath();
    // c.moveTo(Neat.players[0].x, Neat.players[0].y);
    // c.lineTo(closestPipe.x, closestPipe.center);
    // c.lineWidth = 4;
    // c.stroke();
    // c.closePath();



    drawGround();

    //display score
    c.font = "bold " + 20 + "pt Ubuntu";
    c.fillStyle = "#FFFFFF";
    c.fillText("" + Score, canvas.width/2 - c.measureText("" + Score).width/2, 100);
    c.fillText("Generation : " + generation, 10, 50);


    if(showBest){
        if(!Neat.players[0].dead){
            Neat.players[0].show();
        } else {
            for(let i = 0 ; i < noOfPlayers; i++){
                if(!Neat.players[i].dead){
                     Neat.players[i].show();
                     break;
                 }
             }
        }
    } else{
        for(let i = 0 ; i < noOfPlayers; i++){
            if(!Neat.players[i].dead){
                 Neat.players[i].show();
             }
         }
    }
    
    Neat.players[0].brain.drawGenome();

    stopId = requestAnimationFrame(animate);

    //----------------------------------------------------------------------------------------------------------------
    for(let t = 0 ; t < timeLapse; t++){
        score = Math.floor(frameCount / 10);

        for(let pipe of PipePair.pipeList){
            pipe.update();
        }
    
        let closestPipe = findClosestPipe();
        for(let i = 0; i < noOfPlayers; i++){
            if(!Neat.players[i].dead){
                Neat.players[i].observe(closestPipe);
                Neat.players[i].think();
                Neat.players[i].update();
            }
        }
    
        if(allDead()){
            cancelAnimationFrame(stopId);
            restart();
            Neat.evolve();
            animate();
            break;
        }
        frameCount++;
        moveGround--;    
    } 
}

function allDead(){
    for(let i = 0 ; i < Neat.players.length; i++){
        if(!Neat.players[i].dead){
            return false;
        }
    }
    return true;

}

animate();