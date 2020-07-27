class Player{

    static width = 58;
    static height = 40;
    static pseudoHeight = 58;
    static pseudoWidth = 58;

    constructor(){
        
        //game properties
        this.x = 0.2 * canvas.width;   // x coordinate at 10% of canvas width
        this.y = canvas.height/2;      // y coordinate at center of the screen
        this.velocity = 0;             // velocity of the player
        this.gravity = 0.5;            // the force with which the player is being pulled down
        this.isJumping = false;        // keeps track of jumping state of player  
        this.noOfObstaclesCrossed = 0;

         //Neat properties
         this.fitness = 0;  // fitness will be a function of score of the player
         this.action = [];  // stores the output values of the neural network
         this.score = 0;
         this.dead = false; // check whether the player is dead or not
         this.species = undefined;  // store species of this player
         this.brain = new Genome(noOfInputNodes, noOfOutputNodes);  // brain isn't it
         this.brain.addConnection(this.brain.nodes[Math.floor(Math.random() * this.brain.noOfInputNodes)], this.brain.nodes[noOfInputNodes]);
    }

    // mutate the player
    mutate(){
        this.brain.mutate();
    }

    // calculate the distance between two players
    distance(player2){
        return this.brain.distance(player2.brain);
    }

    crossover(player2){

        let child;
        let player1;

        // set player1 to be the fitter parent
        if(this.fitness >= player2.fitness){
            player1 = this;
        } else {
            player1 = player2;
            player2 = this;
        }

        child = new Player();
        child.brain = player1.brain.crossover(player2.brain);

        return child;
        
    }

    // fitness function of the player
    calculateFitness(){

        this.fitness = this.score * this.score;
         
    }

    // clone the player
    clone(){

        let clonePlayer = new Player();
        clonePlayer.brain = this.brain.clone();
        return clonePlayer;
    }

    //show the player
    show(){

        c.save();
        c.translate(this.x + Player.width/2, this.y + Player.height/2);
        let angle = (this.velocity * 6) * Math.PI/ 180;
        if(angle > Math.PI/2) angle = Math.PI/2
        c.rotate(angle);
        c.drawImage(bird, -Player.width/2, -Player.height/2, Player.width , Player.height)
        c.restore();
    }

    observe(closestPipe){

        let distanceToClosestPipe = closestPipe.x - this.x;

        this.brain.nodes[0].data = distanceToClosestPipe / canvas.width;
        this.brain.nodes[0].data = (this.y + Player.height/2 - closestPipe.center) / canvas.height;
        
    }


    think(){

        this.action = this.brain.feed_forward();

        if(this.action[0] > 0.5){
            this.velocity = -7;
        }

    }

    update(){  

        this.collided();

        if(this.x + Player.width/2 == PipePair.pipeList[0].x + PipePair.width/2){
            this.noOfObstaclesCrossed++;
        }

        this.score = score + 40 * this.noOfObstaclesCrossed;
        
        this.y += this.velocity;
        this.velocity += this.gravity;    
        
    }

    // check whether the player had a collision or not
    collided(){

        if(this.y < 0){
            this.dead  = true;
        } else if(this.y + Player.height > canvas.height - 30) {
            this.dead = true;
        }

        if(Math.abs(this.x + Player.width/2 - PipePair.pipeList[0].x - PipePair.width/2) < Player.width/2 + PipePair.width/2){
            if(this.y + Player.height > PipePair.pipeList[0].center + PipePair.gapHeight/2 || this.y < PipePair.pipeList[0].center - PipePair.gapHeight/2){
                this.dead = true;
            }
        }

    }
}