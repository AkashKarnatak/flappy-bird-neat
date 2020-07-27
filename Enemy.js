class Enemy{
    
    //define some basic properties
    constructor(){

        // to store all the enemies which are displayed on the screen
        this.enemies = [];
        this.enemyList = [new Bird()];
        this.LCadded = false;
        this.RCadded = false;
        this.enemiesOnScreen = 3;   // no of enemies that should be present on the screen based on the current score
        this.distance = 0;    // distance from the player
        this.canKill = false;

    }

    update(){

        this.enemiesOnScreen = Math.floor(Math.sqrt(score / 500) * 7);

        if(this.enemiesOnScreen > 7){
            // enemies on screen should not exceed 15
            this.enemiesOnScreen = 7;
        }

        // console.log("enemies length " +this.enemies.length);
        // console.log("enemies on screen "+this.enemiesOnScreen);
        while(this.enemies.length < this.enemiesOnScreen){
            this.enemies.push(this.randomEnemy());
        }

        if(score > 30 && !this.LCadded){
            this.LCadded = true;
            this.enemyList.push(new Bird());
            this.enemyList.push(new LightningCloud());
        } else if(score > 150 && !this.RCadded){
            this.RCadded = true;
            this.enemyList.push(new Bird());
            this.enemyList.push(new LightningCloud());
            this.enemyList.push(new RainyCloud());
        }

        closestEnemy = [];
        channel = [0,0,0,0,0,0,0,0,0,0];

        for(let i = 0; i < this.enemies.length; i++){
            // remove enemy from this.enemies list if its not present on the screen
            if(this.enemies[i].x + this.enemies[i].width < 0){
                this.enemies.splice(i, 1);
                i--;
            } else {
                for(let t = Math.floor(this.enemies[i].y * 10 / canvas.height) - 1; t <= Math.floor((this.enemies[i].y + this.enemies[i].pseudoheight) * 10 / canvas.height) - 1; t++){
                    channel[t] += 1;    
                }
                //check the distance of enemy from the player
                this.distance = this.enemies[i].x + this.enemies[i].width - (0.1 * canvas.width + Player.width - Player.pseudoWidth);   // this enemy's distance from Player's x (= 0.1 * canvas.width)
                if(this.distance >= 0){
                    if(this.distance <= Player.pseudoWidth + this.enemies[i].width){
                        closestEnemy.push(this.enemies[i])
                    }
                }
                this.enemies[i].update();
            }
        }
        
        closestEnemy.sort((a,b) => a.distance - b.distance)

    }

    show(){
        for(let i = 0; i < this.enemies.length; i++){
            this.enemies[i].show();
        }
    }

    randomEnemy(){
        return this.enemyList[Math.floor(Math.random() * this.enemyList.length)].clone();
    }

}