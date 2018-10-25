enum CatStatus {
    AVAILABLE = 0, // 还有路走
    UNAVAILABLE = 1 // 无路可走
}

class RunPath extends Point {
    public step: number = 0
    public firstStep: Point

    public copy(): RunPath {
        let n = new RunPath(this.x, this.y)
        n.step = this.step
        n.firstStep = this.firstStep.copy()
        return n
    }
}

class SearchResult {
    public nextStep: Point // 下一步
    public hasPath: boolean = true // 是否可以走出去
}

/**
 * 猫
 */
class Cat extends egret.Sprite {

    private catMovieClip = {
        normal: GameUtil.createMovieClipByName('cat_normal'),
        loser: GameUtil.createMovieClipByName('cat_loser')
    }
    /**
     * 猫的状态
     */
    private status: CatStatus
    /**
     * 猫在数组中的下标
     */
    private index: Point
    /**
     * 猫所在的格子
     */
    private gridNode: GridNode
    /**
     * 猫的大小
     */
    private size: number
    /**
     * 格子的背景
     */
    private bg: egret.MovieClip
    /**
     * 点击事件监听
     */
    private playListener: PlayListener

    public constructor(playListener: PlayListener) {
        super()
        this.playListener = playListener
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this)
    }

    private onAddToStage(event:egret.Event){
        this.init()
    }

    private init() {
        this.bg = new egret.MovieClip()
        this.addChild(this.bg)
        this.setStatus(CatStatus.AVAILABLE)
    }

    public setStatus(status: CatStatus) {
        if (this.status === status) {
            return
        }
        this.status = status
        this.changeBg()
    }

    public getStatus(): CatStatus {
        return this.status
    }

    public getIndex(): Point {
        return this.index
    }

    private changeBg() {
        switch(this.status) {
            case CatStatus.AVAILABLE:
                this.bg.movieClipData = this.catMovieClip.normal.movieClipData
                this.bg.play(-1)
                break
            case CatStatus.UNAVAILABLE:
                this.bg.movieClipData = this.catMovieClip.loser.movieClipData
                this.bg.play(-1)
                break
        }
    }

    public move(nextStep: Point = this.index) {
        if (!nextStep.equal(this.index)) {
            if (this.gridNode) {
                this.gridNode.setStatus(GridNodeStatus.AVAILABLE)
            }
            this.gridNode = GameData.gridNodeList[nextStep.x][nextStep.y]
            this.gridNode.setStatus(GridNodeStatus.CAT)
            this.index = nextStep
            this.x = this.gridNode.x + (this.gridNode.width - this.bg.width) / 2
            this.y = this.gridNode.y - this.bg.height + this.gridNode.height / 2
        }
    }

    public run() {
        this.playListener && this.playListener.catRun(this.search())
    }
    
    private search(): SearchResult {
        // 记录每个格子走到的最小步数
        let temp: Array<Array<number>> = new Array(GameData.row)
        for(let i = 0;i < GameData.row;++i) {
            temp[i] = new Array<number>(GameData.col)
            for(let j = 0;j < GameData.col;++j) {
                temp[i][j] = Number.MAX_VALUE
            }
        }
        let firstStepList = this.getFirstStep()
        let list: Array<RunPath> = new Array<RunPath>()
        firstStepList.forEach(item=> {
            temp[item.x][item.y] = 1
            list.push(item.copy())
        })
        let minStep = Number.MAX_VALUE
        let result: Point[] = new Array<Point>()
        while(list.length) {
            let current: RunPath = list.shift()
            // 猫到达边界
            if (current.x === 0 || current.y === 0 || current.x === GameData.row - 1 || current.y === GameData.col - 1) {
                if (current.step < minStep) {
                    result = new Array<Point>()
                    result.push(current.firstStep.copy())
                    minStep = current.step
                } else if (current.step === minStep) {
                    result.push(current.firstStep.copy())
                }
                continue
            }
            let dir = this.getDir(current.x)
            for(let i = 0;i < dir.length;++i) {
                let t: RunPath = new RunPath(current.x, current.y)
                t.x += dir[i][0]
                t.y += dir[i][1]
                t.step = current.step + 1
                // 越界
                if (t.x < 0 || t.y < 0 || t.x === GameData.row || t.y === GameData.col) {
                    continue
                }
                // 有猫或有障碍物
                if (GameData.gridNodeList[t.x][t.y].getStatus() !== GridNodeStatus.AVAILABLE) {
                    continue
                }
                if (temp[t.x][t.y] > t.step) {
                    temp[t.x][t.y] = t.step
                    t.firstStep = current.firstStep.copy()
                    list.push(t)
                }
            }
        }
        let nextResult: SearchResult = new SearchResult()
        if (minStep === Number.MAX_VALUE) {
            // 无路可走，切换状态
            this.setStatus(CatStatus.UNAVAILABLE)
            nextResult.hasPath = false
        }
        if (result.length === 0) {
            // 没有路可以走出去，那就向四周随机走一格
            firstStepList.forEach(item=> {
                result.push(item.firstStep)
            })
        }
        if (result.length > 0) {
            let list = this.sortList(result)
            // 从所有结果中随机选一格，避免出现走固定路线
            let index = Math.floor(Math.random() * list.length)
            nextResult.nextStep = list[index]
        } else {
            nextResult.nextStep = this.index
        }
        return nextResult
    }

    // 排序找出可走路径最多的格子
    private sortList(list: Array<Point>): Array<Point> {
        let sort: Array<any> = new Array<any>()
        list.forEach(item=> {
            // key就是下一步要走的坐标
            let key = item.x + '-' + item.y
            let index = -1
            for (let i = 0;i < sort.length;++i) {
                if (sort[i].key === key) {
                    index = i
                    break
                }
            }
            if (index > -1) {
                sort[index].count++
            } else {
                sort.push({
                    key: key,
                    value: item,
                    count: 1
                })
            }
        })
        // 从多到少排序
        sort.sort((a, b)=> {
            return b.count - a.count
        })
        let result: Array<Point> = new Array<Point>()

        sort.forEach(item=> {
            if (item.count === sort[0].count) {
                result.push(new Point(item.value.x, item.value.y))
            }
        })

        return result
    }

    private getFirstStep(): Array<RunPath> {
        let firstStepList = new Array<RunPath>()

        let dir = this.getDir(this.index.x)
        for(let i = 0;i < dir.length;++i) {
            let x = this.index.x + dir[i][0]
            let y = this.index.y + dir[i][1]
            // 越界
            if (x < 0 || y < 0 || x >= GameData.row || y >= GameData.col) {
                continue
            }
            // 不可走
            if (GameData.gridNodeList[x][y].getStatus() !== GridNodeStatus.AVAILABLE) {
                continue
            }
            let runPath: RunPath = new RunPath(x, y)
            runPath.step = 1
            runPath.firstStep = new Point(x, y)
            firstStepList.push(runPath)
        }
        return firstStepList
    }

    private getDir(col) {
        let t = col % 2
        let dir: number[][] = [
                [0, -1], // left
                [0, 1], // right
                [-1, t - 1], // top-left
                [-1, t * 1], // top-right
                [1, t - 1], // bottom-left
                [1, t * 1], // bottom-right
            ]
        return dir
    }
}