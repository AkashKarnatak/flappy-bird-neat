class ConnectionGene{
    
    // object to store necessary properties of a connection gene
    constructor(from, to, innovation_number, weight, enabled){

        this.from = from;
        this.to = to;
        this.innovation_number = innovation_number;
        this.weight = weight;
        this.enabled = enabled;

    }

    // return clone of this connection
    clone(genome){
        let clone = new ConnectionGene(genome.getNode(this.from.innovation_number, this.from.x), genome.getNode(this.to.innovation_number, this.to.x), this.innovation_number, this.weight, this.enabled);
        return clone;
    }
}