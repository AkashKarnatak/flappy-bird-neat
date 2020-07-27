class Genome {

    constructor(noOfInputNodes, noOfOutputNodes, noGenes) {

        // assign some default values
        this.noOfInputNodes = noOfInputNodes;
        this.noOfOutputNodes = noOfOutputNodes;
        this.nodes = [];
        this.connections = [];
        this.radius = 5;
        this.score = 0;

        if(noGenes){
            return;
        }

        // assign basic properties like x and y coordinate to the input and output nodes
        for (let i = 0; i < this.noOfInputNodes; i++) {
            this.nodes[i] = new NodeGene(i + 1);
            this.nodes[i].bias = 0;
            this.nodes[i].x = networkWindow.x + 0.1 * networkWindow.width;
            this.nodes[i].y = networkWindow.y + networkWindow.height * ((i + 1) / (this.noOfInputNodes + 1));
        }
        for (let i = this.noOfInputNodes, j = 1; i < this.noOfInputNodes + this.noOfOutputNodes; i++) {
            this.nodes[i] = new NodeGene(i + 1 - this.noOfInputNodes);
            this.nodes[i].bias = Math.random() * 2 - 1;
            this.nodes[i].x = networkWindow.x + 0.9 * networkWindow.width;
            this.nodes[i].y = networkWindow.y + networkWindow.height * (j++ / (this.noOfOutputNodes + 1));
        }
    }
    
    // return node with the given innovation number and x coordinate
    getNode(innovationNumber, x){
        for(let i = 0 ; i < this.nodes.length; i++){
            if(this.nodes[i].innovation_number == innovationNumber && this.nodes[i].x == x){
                return this.nodes[i];
            }
        }
    }

    //check whether the genomes is fully connected or not
    fullyConnected(){

        let totalNumberOfConnections = 0;  // count the total no of connections that can be made in this genome
        let noOfNodesInEachLayer = 0;  // count the no of nodes in a particular layer
        let tempX = this.nodes[0].x;  // store the x coordinate of current layer
        let noOfNodesAhead = this.nodes.length;  // count the no of nodes infront of the current layer

        for(let node of this.nodes){
            if(tempX == node.x){
                noOfNodesInEachLayer++;
            } else if(tempX < node.x){
                tempX = node.x;
                noOfNodesAhead -= noOfNodesInEachLayer;
                totalNumberOfConnections += noOfNodesInEachLayer * (noOfNodesAhead);
                noOfNodesInEachLayer = 1;
            }
        }

        if(totalNumberOfConnections == this.connections.length){
            return true;
        } else {
            return false;
        }
    }

    // check whether all the connections are disabled or not
    allDisabled(){

        for(let connection of this.connections){

            if(connection.enabled){
                return false;
            }

        }
        return true;

    }

    // adds a new connection to the genome
    addConnection(from, to){

        /********************************************************
         * As an improvement first search for the newly created *
         * connection in Neat.connections list and assign it a  *
         * proper innovation number. Then check whether this    * 
         * innovation number is less than the innovation number *
         * of the last element of this.connections. If so, only *
         * then search new_connection in this.connections       *
         * otherwise don't.                                     *
         ********************************************************/
 
        if(from.x == to.x){
            // Invalid connection
            return false;
        }

        // swap if from's x coordinate is less than to's x coordinate
        if(from.x > to.x){
            let tmp = from;
            from = to;
            to = tmp;
        }

        let new_connection = new ConnectionGene(from, to, Neat.connections.length + 1, Math.random() * 2 - 1, true);  //ConnectionGene(fromNode, toNode, innovationNumber, weight, isEnabled);

        // check whether the newly created link is already present in the genome to avoid redundant links
        for(let connection of this.connections){
            //Two connections are identical if they start and end in identical nodes
            //Two nodes are identical if they are present in the same layer and have same innovation number 
            if(new_connection.from.innovation_number == connection.from.innovation_number && new_connection.from.x == connection.from.x && new_connection.to.innovation_number == connection.to.innovation_number && new_connection.to.x == connection.to.x){

                //connection already present
                return false;

            }
        }

        let connectionFound = false;

        //check whether this connection has already been made 
        for(let connection of Neat.connections){

            //Two connections are identical if they start and end in identical nodes
            //Two nodes are identical if they are present in the same layer and have same innovation number 
            if(new_connection.from.innovation_number == connection.from.innovation_number && new_connection.from.x == connection.from.x && new_connection.to.innovation_number == connection.to.innovation_number && new_connection.to.x == connection.to.x){

                new_connection.innovation_number = connection.innovation_number;

                //connection found
                connectionFound = true;
                break;

            }
        }

        //if this connection has never been made before add it to Neat.connections list
        if(!connectionFound){
            Neat.connections.push(new_connection);
        }

        // sort links according to innovation number and then add to connections list which is necessary for crossover

        if(this.connections.length == 0){

            this.connections.push(new_connection);
            // add the new connection to connections list of "to" node which will be used to calculate its data
            new_connection.to.connections.push(new_connection);

        } else {

            this.insert_link_sorted(new_connection);

        }

        return new_connection;
    }

    insert_link_sorted(link){
        //insert new connection in ascending order of its innovation number
        for(let i = this.connections.length - 1 ; i >= 0; i--){

            if(link.innovation_number > this.connections[i].innovation_number){

                this.connections.splice(i+1, 0, link);
                // add the new connection to connections list of "to" node which will be used to calculate its data
                link.to.connections.push(link);

                return;

            }

        }
        this.connections.splice(0, 0, link);
        // add the new connection to connections list of "to" node which will be used to calculate its data
        link.to.connections.push(link);
    }
    
    
    addNode(connection){

        // conn is the ConnectionGene to be modified
        let conn = connection;
        

        // if connection is disabled then don't create a new node
        if(!conn.enabled){
            return false;
        }

        //disable this connection
        conn.enabled = false;

        // new node is created with suitable innovation number.
        let new_node = new NodeGene(1, (conn.from.x + conn.to.x)/2, networkWindow.height/2, Math.random() * 2 - 1);  //NodeGene(innovationNumber, x_coordinate_of_node, y_coordinate_of_node)
        let noOfNodes = 1;

        //count the no of nodes in the layer containing new_node
        for(let i = 0; i < this.nodes.length; i++){
            if(this.nodes[i].x == new_node.x){
                noOfNodes++;
            } else if(this.nodes[i].x > new_node.x){
                break;
            }
        }

        //assign proper innovation number to new_node. adjust the y coordinate of all the nodes in this layer
        for(let i = 0, j = 1; i < this.nodes.length; i++){
            if(this.nodes[i].x == new_node.x){
                this.nodes[i].y = networkWindow.y + networkWindow.height * (j++ / (noOfNodes + 1));
                new_node.innovation_number++;
            } else if(this.nodes[i].x > new_node.x){
                new_node.y = networkWindow.y + networkWindow.height * (j++ / (noOfNodes + 1));
                this.nodes.splice(i, 0, new_node);
                break;
            }
        }

        //create two new connection to the  newly created node
        let input_connection =  this.addConnection(conn.from, new_node);
        input_connection.weight = 1;

        let output_connection = this.addConnection(new_node, conn.to);
        output_connection.weight = conn.weight;

        return true;

    }

    mutateWeight(connection){

        // there is 80% chance that weight of the connection will be changed
        if(Math.random < 0.8){
            //90% of the time it will be changed by a small amount
            if(Math.random < 0.9){
                connection.weight += (Math.random() * 2 - 1)/50;

                //weight should not exceed its limit of (-1, 1)
                if(connection.weight > 1){
                    connection.weight = 1;
                } else if(connection.weight < -1){
                    connection.weight = -1;
                }
            }
            // 10% of the time a new random weight will be assigned 
            else {
                connection.weight = Math.random() * 2 - 1;
            }
        }

    }
    
    mutateBias(node){

        // there is 80% chance that bias of node will be changed
        if(Math.random < 0.8){
            //90% of the time it will be changed by a small amount
            if(Math.random < 0.9){
                node.bias += (Math.random() * 2 - 1)/50;

                //bias should not exceed its limit of (-1, 1)
                if(node.bias > 1){
                    node.bias = 1;
                } else if(node.bias < -1){
                    node.bias = -1;
                }
            }
            // 10% of the time a new random weight will be assigned 
            else {
                node.bias = Math.random() * 2 - 1;
            }
        }
    }

    mutate(){

        //mutate all the weights
        for(let i = 0; i < this.connections.length; i++){
            this.mutateWeight(this.connections[i]);
        }

        //mutate all the bias
        for(let i = this.noOfInputNodes; i < this.nodes.length; i++){
            this.mutateBias(this.nodes[i]);
        }

        // add a new connection only if the genome is not fully connected
        if(!this.fullyConnected()){

            // 5% chance that new link will be added if the genome is not fully connected
            if(Math.random() < 0.05){

                //choose two random nodes
                let from = this.nodes[Math.floor(Math.random() * this.nodes.length)];
                let to = this.nodes[Math.floor(Math.random() * this.nodes.length)];

                while(!this.addConnection(from, to)){
                    from = this.nodes[Math.floor(Math.random() * this.nodes.length)];
                    to = this.nodes[Math.floor(Math.random() * this.nodes.length)];
                } 
            }
        }

        // add new node only if all connections are not disabled
        if(!this.allDisabled()){

            // 3% chance that new node will be added
            if(Math.random() < 0.01){
                if(this.connections.length > 0){
                    let random_connection = this.connections[Math.floor(Math.random() * this.connections.length)];

                    while(!this.addNode(random_connection)){
                        random_connection = this.connections[Math.floor(Math.random() * this.connections.length)];
                    }
                }
            }
        }
    }

    clone(){

        // clone all the nodes required
        let cloneGenome = new Genome(this.noOfInputNodes, this.noOfOutputNodes, true);
        for(let i = 0; i < this.nodes.length; i++){
            cloneGenome.nodes[i] = this.nodes[i].clone();
        }

        // clone all the connections required
        for(let i = 0; i < this.connections.length; i++){
            cloneGenome.connections[i] = this.connections[i].clone(cloneGenome);
            cloneGenome.connections[i].to.connections.push(cloneGenome.connections[i]);            
        }
        return cloneGenome;
    }

    distance(genome2){
        // no of matching genes
        let matching = 0;
        // no of excess and disjoint genes
        let excessAndDisjoint = 0;
        // sum of absolute difference of weights of matching genes
        let total_weightDiff = 0;
        // what do you think this is?
        let distance = 0;

        let genome1 = this;

        //calculate the number of matching genes
        let max_iter =  Math.min(genome1.connections.length, genome2.connections.length);
        for(let i = 0, j = 0; i < max_iter && j < max_iter;){
            if(genome1.connections[i].innovation_number == genome2.connections[j].innovation_number){
                matching++;
                total_weightDiff += Math.abs(genome1.connections[i].weight - genome2.connections[j].weight);
                i++;
                j++;
            } else if(genome1.connections[i].innovation_number > genome2.connections[j].innovation_number){
                j++;
            } else{
                i++;
            }
        }

        //calculate the number of excess and disjoint genes
        excessAndDisjoint = genome1.connections.length + genome2.connections.length - 2 * matching;

        //This is large genome normalizer
        let N = Math.max(genome1.connections.length, genome2.connections.length) - 20;

        if(N < 1){
            N = 1;
        }

        // if no gene matches, program will cause divide by zero error.
        if(matching == 0){
            distance = Neat.threshold + 1;
        } else {
            distance = (Neat.excessDisjointCoeff * excessAndDisjoint) / N + (Neat.weightDiffCoeff * total_weightDiff) / matching;
        }

        return distance;
    }

    crossover(genome2){

        //assuming genome1 is fitter compared to genome2
        let genome1 = this;

        let child = new Genome(this.noOfInputNodes, this.noOfOutputNodes, true);

        //the child will ressemble the fitter parent in structure
        for(let i = 0; i < genome1.nodes.length; i++){
            child.nodes[i] = genome1.nodes[i].clone();
        }

        let i = 0;
        let j = 0;
        let max_iter =  Math.min(genome1.connections.length, genome2.connections.length);
        while(i < max_iter && j < max_iter){

            //if the genes have same innovation number
            if(genome1.connections[i].innovation_number == genome2.connections[j].innovation_number){

                let child_connection;
                //there is 50% chance that the gene will be taken from either of the parent
                if(Math.random() < 0.5){
                    child_connection = genome1.connections[i].clone(child);
                } else {
                    child_connection = genome2.connections[j].clone(child);
                }

                //75% of the time child gene will be disabled if it is disabled in either of the parent
                if(!(genome1.connections[i].enabled && genome2.connections[j].enabled)){
                    if(Math.random() < 0.75){
                        child_connection.enabled = false;
                    }
                }
                child_connection.to.connections.push(child_connection);
                child.connections.push(child_connection);
                i++;
                j++;
            } else if(genome1.connections[i].innovation_number > genome2.connections[j].innovation_number){
                j++;
            } else{

                //push the disjoint genes of fitter parent
                let child_connection = genome1.connections[i].clone(child);
                child_connection.to.connections.push(child_connection);
                child.connections.push(child_connection);
                i++;
            }
        }

        for(; i < genome1.connections.length; i++){

            //push the excess genes of fitter parent
            let child_connection = genome1.connections[i].clone(child);
            child_connection.to.connections.push(child_connection);
            child.connections.push(child_connection);
        }

        return child;

    }

    feed_forward(){
        let sum = 0;

        // calculate data of each node
        for(let i = this.noOfInputNodes; i < this.nodes.length; i++){
            sum = 0;
            for(let connection of this.nodes[i].connections){
                if(connection.enabled){
                    sum += connection.weight * connection.from.data;
                }
            }
            this.nodes[i].data = Neat.sigmoid(sum + this.nodes[i].bias);
        }

        let output = [];
        for(let i = this.nodes.length - this.noOfOutputNodes; i < this.nodes.length; i++){
            output.push(this.nodes[i].data);
        }

        return output;
    }

    /*******************************************  DRAWING STUFF  **************************************************** */
    show_link(connection){
        c.beginPath();
        c.moveTo(connection.from.x + this.radius, connection.from.y);
        c.lineTo(connection.to.x - this.radius, connection.to.y);
        c.lineWidth = Math.abs(connection.weight) * (3 - 0.5) + 0.5;
        if(connection.enabled){
            if(connection.weight < 0){
                c.strokeStyle = "red";
                c.stroke();
                c.closePath();
            } else if (connection.weight > 0){
                c.strokeStyle = "blue";
                c.stroke();
                c.closePath();
            }
        }
      //  return connection;
    }

    drawGenome(){
        for (let node of this.nodes) {
            // // console.log(node);   // for debugging purpose
            this.drawCircle(node.x, node.y);
        }

        for(let connection of this.connections){
            if(connection.enabled){
                this.show_link(connection);
            }
        }
    }

    drawCircle(x, y){
        c.beginPath();
        c.lineWidth = 1;
        c.strokeStyle = "black";
        c.fillStyle = "white";
        c.arc(x, y, this.radius, 0, 2*Math.PI, false);
        c.stroke();
        c.fill();
        c.closePath();
    }

}
