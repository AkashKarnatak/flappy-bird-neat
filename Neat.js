class Neat{

    /************************************************
     *  static variables which are declared here    *
     *  are not supported in some of the web        *
     *  browsers. So inorder for this to work       *
     *  copy only these static variables, paste     *
     *  them outside this class and use class name  *
     *  to initialize them. For example:            *
     *  static hello = "hello" --> inside the class *
     *  will change to                              *
     *  Neat.hello = "hello"  --> outside the class *
     *  Don't ask me why I am not doing it myself   *
     *  Coz I am lazy                               *
     ************************************************/

    //some Neat parameters
    static excessDisjointCoeff = 1;
    static weightDiffCoeff = 0.4;
    static threshold = 3;
    static kill_rate = 0.5;

    //list to store all the unique connections made by players
    static connections = [];
    
    //list of all the players 
    static players = [];

    //list of all the species
    static species = [];


    // sigmoid activation function
    static sigmoid(x){
        return 1/(1 + Math.exp(-4.9 * x));
    }

    //natural selection process
    static evolve(){

        Neat.speciation();
        Neat.calculateFitness();
        Neat.sortSpecies();
        Neat.kill_the_weaklings();
        Neat.remove_stale_species();
        Neat.remove_bad_species();
        Neat.createNewGeneration();

    }

    // remove players from all the species expect the representative
    static resetSpecies(){

        for(let sample of Neat.species){
            for(let player of sample.players){
                player.species = undefined;
            }
            sample.representative.species = sample;
            sample.players = [sample.representative];
        }
    }

   
    // assign each player to a species
    static speciation(){

        Neat.resetSpecies();

        // add players to its compatible species
        // else create a new species with the player as representative
        for(let player of Neat.players){

            if(player.species != undefined){
                continue;
            }
            
            let found = false;

            for(let sample of Neat.species){
                if(player.distance(sample.representative) < Neat.threshold){
                    found = true;
                    player.species = sample;
                    sample.players.push(player);
                    break;
                }
            }

            if(!found){
                Neat.species.push(new Species(player));
            }
        }
        
    }

    static calculateFitness(){

        // simple stuff
        for(let player of Neat.players){
            player.calculateFitness();
        }

    }

    static sortSpecies(){
        for(let sample of Neat.species){
            // sort all the players of a species in descending order
            sample.players.sort((a, b) => b.fitness - a.fitness);


            //calculate staleness of species
            if(sample.players[0].fitness > sample.bestFitness){
                sample.staleness = 0;
                sample.bestFitness = sample.players[0].fitness;
                sample.representative = sample.players[0].clone();
            } else {
                sample.staleness++;
            }
        }

        //sort all the species according to their bestFitness
        Neat.species.sort((a, b) => b.bestFitness - a.bestFitness);

    }

    //kill bottom fraction of all the species
    static kill_the_weaklings(){
        for(let sample of Neat.species){
            let kill_amount = Math.floor(Neat.kill_rate * sample.players.length);
            while(kill_amount--){
                sample.players.pop();
            }
        }
        //this is required to prevent a single species to dominate over entire population
        Neat.explicit_fitness_sharing();
    }

    //kill all the species which are not even capable to produce a single child
    static remove_bad_species(){
        let total_sum = Neat.calculateSpeciesFitness();

        for(let i = 0; i < Neat.species.length; i++){
            if(Math.floor((Neat.species[i].fitness / total_sum) * Neat.players.length) < 1){
                // remove the element at ith index
                Neat.species.splice(i, 1);
                i--;
            }
        }
    } 

    //kill all the species which haven't progressed since 15 generations
    static remove_stale_species(){

        for(let i = 2; i < Neat.species.length; i++){
            if(Neat.species[i].staleness >= 15){
                // remove the element at ith index
                Neat.species.splice(i, 1);
                i--;
            }
        }

    }

    // create new generation
    static createNewGeneration(){

        let nextGen = [];
        let total_sum = Neat.calculateSpeciesFitness();
        for(let i = 0; i < Neat.species.length; i++){
            nextGen.push(Neat.species[i].players[0].clone());

            // fraction of kids that a species will produce (this is in accordance with fitness of the species)
            let noOfChildren = Math.floor((Neat.species[i].fitness / total_sum) * Neat.players.length) - 1;

            for(let j = 0; j < noOfChildren; j++){
                nextGen.push(Neat.species[i].giveMeBaby());
            }
        }

        // if enough kids have not been produced due to flooring, produce required kids from the best species 
        while(nextGen.length < noOfPlayers){
            nextGen.push(Neat.species[0].giveMeBaby());
        }

        generation++;
        Neat.players = nextGen;
    }


    // calculate fitness of each species
    static calculateSpeciesFitness(){
        let total_sum = 0;
        for(let sample of Neat.species){
            sample.fitness = 0;
            for(let player of sample.players){
                sample.fitness += player.fitness;
            }
            total_sum += sample.fitness;
        }
        return total_sum;
    }

    // static calculateSpeciesAverageFitness(){
    //     let total_sum = 0;
    //     for(let sample of Neat.species){
    //         sample.fitness = 0;
    //         for(let player of sample.players){
    //             sample.fitness += player.fitness;
    //         }
    //         sample.fitness /= sample.players.length;
    //         total_sum += sample.fitness;
    //     }
    //     return total_sum;
    // }

    //find out yourself what it does
    static explicit_fitness_sharing(){
        for(let sample of Neat.species){
            for(let player of sample.players){
                player.fitness /= sample.players.length;
            }
        }
    }

}