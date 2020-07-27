class NodeGene{


    // object to store necessary properties of a node gene
    constructor(innovation_number, x, y, bias) {

        this.x = x;
        this.y = y;
        this.innovation_number = innovation_number;
        this.data = 0;
        this.connections = [];
        this.bias = bias;
    }

    //clone the current node
    clone(){
        let clone = new NodeGene(this.innovation_number, this.x, this.y, this.bias);
        return clone;
    }

}