class PipePair{

    //static memebers since all the objects will share these properties
    static width =  90;
    static height = 800;
    static gapHeight = 150;
    static velocity = -2;
    static pipeList = [];

    //define some basic properties
    constructor(){

        this.x = canvas.width;
        this.center = Math.random() * (canvas.height - 2 * (40 + PipePair.gapHeight/2)) + 40 + PipePair.gapHeight/2;
        
    }

    show(){

        c.drawImage(pipeTop, this.x, this.center - PipePair.gapHeight/2  - PipePair.height, PipePair.width, PipePair.height);
        c.drawImage(pipeBottom, this.x, this.center + PipePair.gapHeight/2, PipePair.width, PipePair.height);

    }

    update(){

        if(this.x + PipePair.width < 0){
            PipePair.pipeList.splice(0, 1);
        }

        if(PipePair.pipeList.length == 1 && PipePair.pipeList[0].x < Math.random() * 0.2 * canvas.width + 0.2 * canvas.width){
            PipePair.pipeList.push(new PipePair());
        }

        if(this.x + PipePair.width/2 < 0.2 * canvas.width + Player.width/2 && !this.cleared){
            this.cleared = true;
            Score++;
        }

        this.x += PipePair.velocity;

    }
}