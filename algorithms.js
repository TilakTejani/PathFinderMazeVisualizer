let dirIndication = ["r", "d", "l", "u"]

let sleep = (sec = 100) => {
    return new Promise(x => setTimeout(x, sec))
}

async function createMazeGoTo(node, from, isVisited = new Map()){
    node.addClass("cur")
    node.removeClass("wall")
    let fromdir = {"left" : 0, "up" : 1, "right" : 2, "down" : 3}
    let todir = {0 : "right", 1 : "down", 2 : "left", 3 : "up"}
    
    let shuffle = (arr) => {
        let n = arr.length
        for(let i = n - 1 ; i >= 0 ; i--){
            let rand = Math.floor(Math.random() * (i + 1))
            let temp = arr[i]
            arr[i] = arr[rand]
            arr[rand] = temp
        }
        return arr
    }
    
    if(!isVisited[node]){
        isVisited.set(node, true)
        node.removeWall(fromdir[from])
        let random = shuffle([0,1,2,3])
        for(let i = 0 ; i < random.length ; ++i){


            await sleep(1)
            
            
            if(node.neighbors[random[i]] && !isVisited.get(node.neighbors[random[i]])){
                node.removeWall(random[i])
                node.removeClass("cur")
                await createMazeGoTo(node.neighbors[random[i]], todir[random[i]], isVisited)
                node.addClass("cur")
            }
        }
    }
    
    node.removeClass("cur")
}


async function BFSsearch(maze, start, end, isDone = new Map(), parent = new Map(), dis = new Map(), dir = new Map()){
    
    let queue = new Array()
    queue.push(start)
    dis.set(start, 0)
    parent.set(start, undefined)
    
    while(queue.length){
        let node = queue.shift()
        if(!isDone.get(node)){

            await sleep(10)
            isDone.set(node, true)
            node.addClass("searching")
            
            if(node == end){
                await backtrack(end, start, parent, dir)
                break;
            }
            

            for(let i = 0 ; i < node.sides ; ++i){
                if(!node.border[i] && node.neighbors[i] && !isDone.get(node.neighbors[i])){
                    if(!dis.get(node.neighbors[i]) || dis.get(node.neighbors[i]) > dis.get(node) + 1){
                        parent.set(node.neighbors[i], node)
                        dis.set(node.neighbors[i], dis[node] + 1)
                        dir.set(node.neighbors[i], dirIndication[i])
                    }
                    queue.push(node.neighbors[i])
                }
            }
        }
    }
}

async function dijkstraSearch(maze, start, end, isDone = new Map(), parent = new Map(), dis = new Map(), dir = new Map()){
    
    // start.addClass("startNode")
    // end.addClass("endNode")
    
    let queue = new Array()
    queue.push(start)
    dis.set(start, 0)
    parent.set(start, undefined)
    
    while(queue.length){
        let node = queue.shift()
        if(!isDone.get(node)){
            await sleep(10)
            isDone.set(node, true)
            node.addClass("searching")
            
            if(node == end){
                await backtrack(end, start, parent, dir)
                break;
            }
            

            for(let i = 0 ; i < node.sides ; ++i){
                if(!node.border[i] && node.neighbors[i] && !isDone.get(node.neighbors[i])){
                    if(!dis.get(node.neighbors[i]) || dis.get(node.neighbors[i]) > dis.get(node) + 1){
                        parent.set(node.neighbors[i], node)
                        dis.set(node.neighbors[i], dis[node] + 1)
                        dir.set(node.neighbors[i], dirIndication[i])
                    }
                    queue.push(node.neighbors[i])
                }
            }
        }
    }
}

async function AstarSearch(maze, start, end, isDone = new Map(), gscore = new Map(), fscore = new Map(), parent = new Map(), dir = new Map()){
    let dis = (x, y) => {
        return Math.hypot(x.i - y.i, x.j - y.j)
    }

    let getMin = (openSet, fscore) => {
        let min = Math.min(...openSet.map(el => fscore.get(el)))

        for(let i = 0 ; i < openSet.length ; i++){
            if(fscore.get(openSet[i]) == min){
                let ans = openSet[i]
                openSet.splice(i, 1)
                return ans
            }
        }
    }

    let openSet = []
    
    openSet.push(start)
    
    parent.set(start, undefined)
    gscore.set(start, 0)
    fscore.set(start, dis(start, end))
    isDone.set(start, true)
    while(openSet.length){
        let curr = getMin(openSet, fscore)
        curr.addClass("searching")
        if(curr == end){
            await backtrack(end, start, parent, dir)
            return 
        }

        isDone.set(curr, true)
        
        for(let i = 0 ; i < curr.border.length ; ++i){
            await sleep(10)
            
            let n = curr.neighbors[i]
            if(n && !curr.border[i] && !isDone.get(n)){
                let tempG = gscore.get(curr) + dis(curr, n)

                if(!gscore.get(n) || tempG < gscore.get(n)){
                    parent.set(n, curr)
                    dir.set(n, dirIndication[i])
                    gscore.set(n, tempG)
                    fscore.set(n, gscore.get(n) + dis(n, end))
                    
                }

                if(!(openSet.find(el => el == n))) {
                    openSet.push(n)
                }
            }
        }
    }
}

async function DFSsearch(maze, node, end, isDone = new Map(), parent = new Map(), dis = new Map(), dir = new Map()){
    if(node == end){
        await backtrack(end, start, parent, dir)
        return true
    }
    if(isDone.get(node)){
        return
    }
    isDone.set(node, true)
    
    node.addClass("searching")
    await sleep(10)

    for(let i = 0; i < node.sides ; ++i){
        if(!node.border[i] && node.neighbors[i] && !isDone.get(node.neighbors[i])){
            if((!dis.get(node) || dis.get(node[i]) + 1 > dis.get(node.neighbors[i]))){
                dis.set(node.neighbors[i], dis.get(node) + 1)
                parent.set(node.neighbors[i], node)
                dir.set(node.neighbors[i], dirIndication[i])
            }
            if(await DFSsearch(maze, node.neighbors[i], end, isDone, parent ,dis, dir))
                return true
        }
    }
}

async function backtrack(end, start, parent, dir){
    let node = end
    let to = ""
    while(node){
        await sleep(10)
        
        node.removeClass("searching")
        node.addClass("inWay")
        node.el.innerHTML = to
        switch(dir.get(node)){
            case "u":
                to = '🠋'
                break;
            case "d":
                to = '🠉'
                break;
            case "r":
                to = '🠈'
                break;
            case "l":
                to = '🠊'
                break;
        }

        node = parent.get(node)
    }

}