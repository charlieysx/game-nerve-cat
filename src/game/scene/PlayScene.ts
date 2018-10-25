declare interface PlayListener {
    /**
     * 返回能否走
     */
    canRun(): boolean
    /**
     * 玩家走完
     */
    playerRun(nextStep: Point): void
    /**
     * 猫走完
     */
    catRun(searchResult: SearchResult): void
    /**
     * 哪个赢，
     * 0：玩家
     * 1：猫
     */
    gameOver(type: number): void
}

enum OverType {
    NULL = -1, // 无
    PLAYER = 0, // 玩家赢
    CAT = 1 // 猫赢
}

class PlayScene extends BaseScene implements PlayListener {
    // 猫
    private cat: Cat
    private catRunning: boolean
    private sound: egret.Sound

    protected initView() {
        this.sound = RES.getRes('go_mp3')
        this.catRunning = false
        this.createGridNode()
        this.createBarrier(GameData.barrierNumber)
        this.createCat()
        this.x = (GameUtil.getStageWidth() - this.width) / 2
        this.y = GameUtil.getStageHeight() / 2.5

        SceneController.showLevelTip()
    }

    private createGridNode() {
        GameData.gridNodeList = new Array<Array<any>>(GameData.row)
        let gridNodeSize = GameUtil.getStageWidth() / (GameData.row + 1) - GameData.gridMargin
        for(let i = 0;i < GameData.row;++i) {
            GameData.gridNodeList[i] = new Array<GridNode>(GameData.col)
            let indent = (i % 2) * (gridNodeSize / 2) // 偶数行缩进
            for(let j = 0;j < GameData.col;++j) {
                let x = indent + j * (gridNodeSize + GameData.gridMargin)
                let y = i * gridNodeSize
                GameData.gridNodeList[i][j] = new GridNode(new Point(i, j), new Point(x, y), gridNodeSize, this)
                GameData.gridNodeList[i][j].setStatus(GridNodeStatus.AVAILABLE)
                this.addChild(GameData.gridNodeList[i][j])
            }
        }
    }

    private createBarrier(num: number) {
        while(num) {
            let i = Math.floor(Math.random() * 100 % GameData.row)
            let j = Math.floor(Math.random() * 100 % GameData.col)
            let gridNode = GameData.gridNodeList[i][j]
            if (i !== Math.floor(GameData.row / 2) && j !== Math.floor(GameData.col / 2) && gridNode.getStatus() === GridNodeStatus.AVAILABLE) {
                gridNode.setStatus(GridNodeStatus.UNAVAILABLE)
                num--
            }
        }
    }

    private createCat() {
        let i = Math.floor(GameData.row / 2)
        let j = Math.floor(GameData.col / 2)
        this.cat = new Cat(this)
        this.addChild(this.cat)
        this.cat.move(new Point(i, j))
    }

    public playerRun(index: Point) {
        this.sound.play(0, 1)
        GameData.step++
        this.catRunning = true
        this.cat.run()
    }

    public catRun(searchResult: SearchResult) {
        if (!searchResult.hasPath) {
            // 被包围了，切换状态
            this.cat.setStatus(CatStatus.UNAVAILABLE)
        }
        let nextStep = searchResult.nextStep
        // 下一步和当前所在位置一样，说明无路可走，玩家赢
        if (nextStep.equal(this.cat.getIndex())) {
             this.gameOver(OverType.PLAYER)
             return
        }
        this.cat.move(nextStep)
        // 猫到达边界，猫赢
        if (nextStep.x * nextStep.y === 0 || nextStep.x === GameData.row - 1 || nextStep.y === GameData.col - 1) {
            this.gameOver(OverType.CAT)
            return
        }
        this.catRunning = false
    }

    public canRun() {
        return !this.catRunning
    }

    public gameOver(type: OverType) {
        GameData.overType = type
        SceneController.showEndScene()
    }
}