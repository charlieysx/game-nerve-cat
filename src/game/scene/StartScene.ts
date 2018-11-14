class StartScene extends BaseScene {

    protected initView() {
        let cat: egret.Bitmap = GameUtil.createBitmapByName('cat_start_bg')
        this.addChild(cat)
        cat.x = (GameUtil.getStageWidth() - cat.width) / 2
        cat.y = (GameUtil.getStageHeight() - cat.height) / 2 + 100

        let startBtn: egret.Bitmap = GameUtil.createBitmapByName('btn_start')
        this.addChild(startBtn)
        startBtn.x = (GameUtil.getStageWidth() - startBtn.width) / 2
        startBtn.y = cat.y + cat.height
        GameUtil.bitmapToBtn(startBtn, ()=> {
            console.log('开始游戏')
            n.GameData.level = 0
            SceneController.showPlayScene()
        })
    }
}