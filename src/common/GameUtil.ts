/**
 * 工具类
 */
class GameUtil {
    /**
     * 获取舞台高度
     */
    public static getStageHeight(): number {
        return egret.MainContext.instance.stage.stageHeight
    }

    /*
     * 获取舞台宽度
     */
    public static getStageWidth(): number {
        return egret.MainContext.instance.stage.stageWidth
    }

    /**
     * 根据name关键字创建一个Bitmap对象。name属性请参考resources/resource.json配置文件的内容。
     */
    public static createBitmapByName(name: string, type: string = 'png') {
        let result = new egret.Bitmap()
        let texture: egret.Texture = RES.getRes(name + '_' + type)
        result.texture = texture
        return result
    }

    /**
     * 根据name关键字创建一个MovieClip对象。name属性请参考resources/resource.json配置文件的内容。
     */
    public static createMovieClipByName(name:string): egret.MovieClip {

        let data_stay: any = RES.getRes(name + "_json")
        console.log(data_stay)
        let texture_stay: egret.Texture = RES.getRes(name + "_png")
        let mcFactory_stay: egret.MovieClipDataFactory = new egret.MovieClipDataFactory(data_stay, texture_stay)
        return new egret.MovieClip(mcFactory_stay.generateMovieClipData(name))
    }

    public static bitmapToBtn(bitmap: egret.Bitmap, callback) {
        bitmap.touchEnabled = true
        // 记录当前位置
        const source: Point = new Point(bitmap.x, bitmap.y)
        // 监听触摸事件
        bitmap.addEventListener(egret.TouchEvent.TOUCH_BEGIN, ()=> {
            // 改变按钮的锚点
            bitmap.anchorOffsetX = bitmap.width / 2
            bitmap.anchorOffsetY = bitmap.height / 2
            // 改变按钮位置（因为锚点改变了）
            bitmap.x = source.x + bitmap.width / 2
            bitmap.y = source.y + bitmap.height / 2
            // 缩放
            bitmap.scaleX = 0.95
            bitmap.scaleY = 0.95
        }, this)
        bitmap.addEventListener(egret.TouchEvent.TOUCH_TAP, ()=> {
            reset()
            // 这个事件发生才算是点击按钮
            callback && callback()
        }, this)
        bitmap.addEventListener(egret.TouchEvent.TOUCH_CANCEL, reset, this)
        bitmap.addEventListener(egret.TouchEvent.TOUCH_END, reset, this)
        bitmap.addEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, reset, this)

        function reset() {
            bitmap.anchorOffsetX = 0
            bitmap.anchorOffsetY = 0
            bitmap.x = source.x
            bitmap.y = source.y
            bitmap.scaleX = 1
            bitmap.scaleY = 1
        }
    }
}