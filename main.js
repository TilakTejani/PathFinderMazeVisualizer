let maze

// const rowCount = 20
// const colCount = 62
let startNode, endNode

const rowCount = 20
const colCount = 20

let getId = (i, j) => {
    return  i +"-"+j
}
let getrowId = (i) =>{
    return "row " + i   
}
let getStyle = (i, j, rows, cols) => {
    return ""
}

preCompute()
function preCompute(){
    
    maze = new Maze(rowCount, colCount)
    maze.setStartNode(Math.floor(rowCount/4),Math.floor(colCount/4))
    maze.setEndNode(Math.floor(rowCount/4),Math.floor(3 *colCount/4))
    // generateMaze()
}




function start(){
    let algoUsed = document.getElementById("algoUsed").value
    switch(algoUsed){
        case "bfs":
            BFSsearch(maze, maze.startNode, maze.endNode)
            break
        case "dijkstra":
            dijkstraSearch(maze, maze.startNode, maze.endNode)
            break
        case "astar":
            AstarSearch(maze, maze.startNode, maze.endNode)
            break
        case "dfs":
            DFSsearch(maze, maze.startNode, maze.endNode)
            break

    }
}

function updateInput(){

}
 
function generateMaze(){
    newMaze()
    maze.matrix.forEach(row => {
        row.forEach(node => {
            node.addWall(0)
            node.addWall(1)
            node.addWall(2)
            node.addWall(3)
            node.addClass("wall")
        })
    })
    createMazeGoTo(maze.matrix[0][0], "up")
}

// function to clear all visited non visited for new algorithm
function clearMaze(){
    maze.clearMaze()
}

function newMaze(){
    maze.newMaze()
    maze.setStartNode(Math.floor(rowCount/4),Math.floor(colCount/4))
    maze.setEndNode(Math.floor(rowCount/4),Math.floor(3 *colCount/4))
}


