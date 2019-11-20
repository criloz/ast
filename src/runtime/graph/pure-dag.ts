    constructor(parent: Hierarchy | Graph) {
        this.parent = parent;
        this.nodes = new Map();
        this.id = ulid();
    }
