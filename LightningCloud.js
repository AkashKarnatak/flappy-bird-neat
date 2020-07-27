class LightningCloud{

    // static because all the clouds will have same properties
    static velocity = 1;  

    // declare some basic properties
    constructor(){

        this.width = 130;
        this.height = 110;
        this.pseudoheight = 80;
        this.x = canvas.width;
        this.offset = Math.random() * (canvas.height - this.height);  // any y coordinate of the canvas
        this.y = this.offset;

    }

    // the display the cloud
    show(){

        //image.width = 100px
        //image.height = 80px
        c.drawImage(lightningCloud, this.x, this.y, this.width, this.height);

    }

    // to update the parameter of the cloud
    update(){

        this.x -= LightningCloud.velocity;  // subtracting because we have to go in -ve direction
        this.y = this.offset + canvas.height * 0.01 * Math.sin(20 * Math.PI * this.x / canvas.width);

    }

    //clone with different x and y coordinate
    clone(){

        let clone = new LightningCloud();
        return clone;

    }

}