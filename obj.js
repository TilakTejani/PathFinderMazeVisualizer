class Maze{
    constructor(rowCount, colCount){
        this.rows = rowCount
        this.cols = colCount
        this.el
        this.matrix = this.preparemaze(this.rows, this.cols)
        this.startNode = this.matrix[0][0]
        this.endNode = this.matrix[1][1]
        


        this.el.addEventListener("toggleWall", () => {
            onmousedown = (e) => {
                console.log(e.srcElement)
            }
        })
    }

    preparemaze(rowCount, colCount){
        let mazeEl = document.getElementById("maze")
        let maze = new Array(rowCount)
        for(let i = 0 ; i < rowCount ; ++i){
            let row = new Array(colCount)
            let rowEl = document.createElement("tr")
            rowEl.id = getrowId(i)
            rowEl.className = "row"
            for(let j = 0 ; j < colCount ; ++j){
                let node = new Node(i, j, this)
                row[j] = node
                rowEl.appendChild(node.el)
            }
            maze[i] = row
            mazeEl.appendChild(rowEl)
        }
        
        startNode = maze[0][0]
        endNode = maze[rowCount - 1][colCount - 1]
        startNode.el.draggable = "true"
        endNode.el.draggable = "true"
        
        for(let i = 0 ; i < rowCount ; ++i){
            for (let j = 0; j < colCount; j++) {
                maze[i][j].setNeighbors(maze)
            }
        }
        this.el = mazeEl
        return maze
    }

    clearMaze(){
        this.matrix.forEach(row => {
            row.forEach(node => {
                node.removeClass("searching")
                node.removeClass("curr")
                node.removeClass("inWay")
                sleep(1)
                node.el.innerHTML = ""
            })
        })
    }


    newMaze(){
        this.el.innerHTML = ""
        this.el, this.matrix = this.preparemaze(this.rows, this.cols)
        this.startNode = this.matrix[0][0]
        this.endNode = this.matrix[1][1]
    }
    setStartNode(i, j){
        this.startNode.isStart = false
        this.startNode.removeClass("startNode")
        this.startNode.el.draggable = false
        
        this.startNode = this.matrix[i][j]
        this.startNode.isStart = true
        this.startNode.addClass("startNode")
        this.startNode.el.draggable = true
    }
    setEndNode(i, j){
        this.endNode.isEnd = false
        this.endNode.removeClass("endNode")
        this.endNode.el.draggable = false
        
        this.endNode = this.matrix[i][j]
        this.endNode.isEnd = true
        this.endNode.addClass("endNode")
        this.endNode.el.draggable = true
    }
    static getLoc(id){
        return id.split('-').map(e => parseInt(e))
    }
   
    
}

class Node{
    constructor(i, j, maze){
        this.maze = maze
        this.i = i
        this.j = j
        this.sides = 4
        this.border = new Array(0, 0, 0, 0)
        this.neighbors = new Array(4)
        this.parent = undefined
        this.isWall = false
        this.isStart = false
        this.isEnd = false
        this.temp = new Array(0, 0, 0, 0)         // temp border for prev wall memory, can be used if old memory removed

        this.el = document.createElement("td")
        this.el.id = getId(this.i, this.j)
        this.el.className = "node"

        this.el.ondragstart = (e) => {
            if(this.isStart || this.isEnd) this.drag(e)
        }
        this.el.ondragover = (e) => {
            if(e.dataTransfer.getData("data") != "wall") e.preventDefault()
        }

        this.el.ondrop = (e) => this.drop(e)

        this.el.onmousedown = (e) => {this.mouseEvent(e, "down")}
        this.el.onmouseover = (e) => {this.mouseEvent(e, "over")}
        this.el.onmouseup = (e) => {this.mouseEvent(e, "up")}
    }

    mouseEvent(event, type){
        // event.preventDefault()
        switch(type){
            case "down":
                if(!this.isStart && !this.isEnd)    Node.clicked = true
                break
            case "up":
                Node.clicked = false
                break
            case "over":
                if(!this.isStart && !this.isEnd && Node.clicked)
                    this.toggleWall()
                break

        }
    }

    drag(event){
        event.dataTransfer.setData("data", this.isStart ? "start" : "end")
        this.removeClass("startNode")
        this.removeClass("endNode")
    }

    drop(event){
        event.preventDefault()
        let data = event.dataTransfer.getData("data")
        let loc = Maze.getLoc(event.target.id)
        if(data == "start" && !this.isEnd){
            this.maze.setStartNode(loc[0], loc[1])
        }
        if(data == "end" && !this.isStart){
            this.maze.setEndNode(loc[0], loc[1])
        }
    }

    addClass(name){
        this.el.classList.add(name)
    }
    removeClass(name){
        this.el.classList.remove(name)
    }

    
    toggleWall(){
        if(this.isWall){
            // removing wall
            this.isWall = false
            this.removeClass("wall")
            this.border = this.temp
            if(this.border.toString() != "0,0,0,0"){
                for(let i = 0 ; i < this.sides && !this.temp ; ++i)
                    this.removeWall(i)
            }
        }
        else{
            // building wall
            if((this.border.toString() != "1,1,1,1")){
                console.log("here");
                this.temp = new Array(...this.border)
            }
            this.isWall = true
            this.addClass("wall")
            for(let i = 0 ; i < this.sides ; ++i)
                this.addWall(i)
        }
    }

    addWall(i){
        this.border[i] = 1
        switch(i){
            case 0:
                this.el.style.borderLeftWidth = 1
                break
            case 1:
                this.el.style.borderTopWidth = 1
                break
            case 2:
                this.el.style.borderRightWidth = 1
                break
            case 3:
                this.el.style.borderBottomWidth = 1
                break
        }
    }

    removeWall(i){
        this.border[i] = 0;
        switch(i){
            case 0:
                this.el.style.borderLeftWidth = 0
                break
            case 1:
                this.el.style.borderTopWidth = 0
                break
            case 2:
                this.el.style.borderRightWidth = 0
                break
            case 3:
                this.el.style.borderBottomWidth = 0
                break
        }
    }

    setNeighbors(maze){
        let rowCount = maze.length
        let colCount = maze[0].length
        let i = this.i
        let j = this.j
        if((i + 1 < rowCount)){
            this.neighbors[3] = maze[i+1][j]
        }
        if(j + 1 < colCount){
            this.neighbors[2] = maze[i][j+1]
        }
        if(i > 0){
            this.neighbors[1] = maze[i-1][j]
        }
        if(j > 0){
            this.neighbors[0] = maze[i][j-1]
        }
    }
    
}