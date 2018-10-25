class SceneController {
    private _stage: egret.DisplayObjectContainer // 场景容器

    private startScene: StartScene // 开始场景
    private playScene: PlayScene // 游戏场景
    private endScene: EndScene // 结束场景

    public static sceneController: SceneController

    public static get instance() {
        if (!this.sceneController) {
            this.sceneController = new SceneController()
        }
        return this.sceneController
    }

    public constructor() {
        this.startScene = new StartScene()
        this.playScene = new PlayScene()
        this.endScene = new EndScene()
    }

    public setStage(stage: egret.DisplayObjectContainer) {
        this._stage = stage
    }

    /**
     * 初始化游戏，显示开始游戏场景
     */
    public static initGame() {
        let stage: egret.DisplayObjectContainer = this.instance._stage
        if (this.instance.playScene.parent) {
            stage.removeChild(this.instance.playScene)
            this.instance.playScene = new PlayScene()
        }
        if (this.instance.endScene.parent) {
            stage.removeChild(this.instance.endScene)
            this.instance.endScene = new EndScene()
        }
        stage.addChild(this.instance.startScene)
    }

    /**
     * 显示游戏场景
     */
    public static showPlayScene() {
        let stage: egret.DisplayObjectContainer = this.instance._stage
        if (this.instance.startScene.parent) {
            stage.removeChild(this.instance.startScene)
            this.instance.startScene = new StartScene()
        }
        if (this.instance.endScene.parent) {
            stage.removeChild(this.instance.endScene)
            this.instance.endScene = new EndScene()
        }
        if (this.instance.playScene.parent) {
            stage.removeChild(this.instance.playScene)
            this.instance.playScene = new PlayScene()
        }
        let level = GameData.level
        if (level >= GameData.levelData.length) {
            level = GameData.levelData.length - 1
        }
        GameData.barrierNumber = GameData.levelData[level].barrierNumber
        GameData.row = GameData.levelData[level].row
        GameData.col = GameData.levelData[level].col
        GameData.step = 0
        GameData.overType = OverType.NULL
        stage.addChild(this.instance.playScene)
    }

    /**
     * 开始游戏时显示关卡
     */
    public static showLevelTip() {
        let level: number = GameData.level + 1
        let stage: egret.DisplayObjectContainer = this.instance._stage
        // 背景容器
        let bg: egret.DisplayObjectContainer = new egret.DisplayObjectContainer()
        bg.width = GameUtil.getStageWidth()
        bg.height = GameUtil.getStageHeight()
        bg.x = 0
        bg.y = 0
        stage.addChild(bg)

        // 背景蒙层
        let shp: egret.Shape = new egret.Shape()
        shp.graphics.beginFill(0x000000, 0.8)
        shp.graphics.drawRect(0, 0, GameUtil.getStageWidth(), GameUtil.getStageHeight())
        shp.graphics.endFill()
        shp.touchEnabled = true
        bg.addChild(shp)

        let info: egret.TextField = new egret.TextField()
        info.bold = true
        info.textColor = 0xffffff
        info.strokeColor = 0x000000
        info.stroke = 2
        info.size = 60
        info.text = `第${level}关`
        info.x = (GameUtil.getStageWidth() - info.width) / 2
        info.y = (GameUtil.getStageHeight() - info.height) / 2
        bg.addChild(info)

        egret.Tween
            .get(info)
            .wait(500)
            .to({
                y: 10,
                alpha: 0
            }, 1000, egret.Ease.backInOut)
            .call(()=> {
                stage.removeChild(bg)
            })

        egret.Tween
            .get(shp)
            .wait(500)
            .to({
                alpha: 0
            }, 1000, egret.Ease.sineIn)
    }

    /**
     * 显示游戏结束场景
     */
    public static showEndScene() {
        let stage: egret.DisplayObjectContainer = this.instance._stage
        stage.addChild(this.instance.endScene)
    }
}