class RainyCloud{

    static velocity_x = 1;   // static because all the clouds will share the same velocity

    // declare some basic properties
    constructor(){

        this.width = 90;
        this.height = 50;
        this.pseudoheight = 40;
        this.x = canvas.width;
        this.y = Math.random() * (canvas.height - this.height);
        
        //set y velocity to be either 1 or -1
        if(Math.random() < 0.5){
            this.velocity_y = 1.2;
        } else {
            this.velocity_y = -1.2;
        }

    }

    // display the cloud
    show(){

        //image.width = 80px
        //image.height = 50px
        c.drawImage(rainyCloud, this.x, this.y, this.width, this.height);

    }

    //update the parameters of the cloud
    update(){

        this.x -= RainyCloud.velocity_x;
        this.y += this.velocity_y;
        // check whether the cloud is going outside the boundaries or not
        if(this.y + this.velocity_y > canvas.height || this.y + this.velocity_y < 0){
            this.velocity_y = -this.velocity_y;
        }
    }

    // clone with different x and y coordinates
    clone(){

        let clone = new RainyCloud();
        return clone;

    }
}