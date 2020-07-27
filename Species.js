class Species{

    constructor(representative){
        this.representative = representative;  // a player which will represent this species
        this.representative.species = this;
        this.players = [this.representative];  // list of players which are in this species
        this.fitness = 0;                      // average fitness of the species
        this.staleness = 0;                    // measure of how many generations have the species lived without increase in its best Score
        this.bestFitness = 0;                  // best ever fitness score achived by its member
    }

    // returns a baby of this species
    giveMeBaby(){

        let baby;

        // no crossover 25% of the time
        if(Math.random() < 0.25){
            baby = this.selectMostProbablePlayer();
        } else {
            let player1 = this.selectMostProbablePlayer();
            let player2 = this.selectMostProbablePlayer();
            baby = player1.crossover(player2);
        }

        // mutate the baby
        baby.mutate();

        return baby;
    }


    // return the most probable player
    selectMostProbablePlayer(){
        let sum = 0;
        for(let player of this.players){
            sum += player.fitness;
        }
        let random_number = Math.random() * sum;
        for(let i = 0; i < this.players.length; i++){

            random_number = random_number - this.players[i].fitness;
            if(random_number <= 0){
                return this.players[i];
            }
        }
        return this.players[0];
    }

}