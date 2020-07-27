// class the create Bird object
class Bird{

    static velocity = 3;  // static because all the birds will have the same velocity
    
    //define some basic properties
    constructor(){

        this.width = 70;
        this.height = 50;
        this.pseudoheight = 45;
        this.x = canvas.width;  // right edge of the screen
        this.y = Math.random() * (canvas.height - this.height);  // any y coordinate of the canvas
    
    }

    // display bird
    show(){

        //image.width = 65x
        //image.height = 35px
        // for first 5 frames display birdFlapUp and for next 5 frames display birdFlapDown
        if(frameCount % 20 < 10){
            c.drawImage(birdFlapUp, this.x, this.y, this.width, this.height);
        } else{
            c.drawImage(birdFlapDown, this.x, this.y, this.width, this.height);
        }


    }

    // update the coordinates of the bird
    update(){

        this.x -= Bird.velocity;

    }

    // clone with different x and y coordinates
    clone(){

        let clone = new Bird();
        return clone;

    }
}