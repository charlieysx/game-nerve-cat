namespace n {
export class GameData {
    /**
     * 游戏关卡
     */
    public static level: number = 0
    /**
     * 每个关卡对应的初始化数据
     */
    public static levelData: Array<any> = [
        {
            barrierNumber: 10,
            row: 7,
            col: 7
        },
        {
            barrierNumber: 22,
            row: 8,
            col: 8
        },
        {
            barrierNumber: 24,
            row: 9,
            col: 9
        },
        {
            barrierNumber: 26,
            row: 10,
            col: 10
        },
        {
            barrierNumber: 24,
            row: 10,
            col: 10
        },
        {
            barrierNumber: 22,
            row: 10,
            col: 10
        },
        {
            barrierNumber: 20,
            row: 10,
            col: 10
        },
        {
            barrierNumber: 18,
            row: 10,
            col: 10
        },
        {
            barrierNumber: 16,
            row: 10,
            col: 10
        },
        {
            barrierNumber: 14,
            row: 10,
            col: 10
        }
    ]
    /**
     * 结束类型（玩家赢或猫赢）
     */
    public static overType: OverType = OverType.NULL
    /**
     * 玩家走的步数
     */
    public static step: number = 0
    /**
     * 存放格子数据
     */
    public static gridNodeList: Array<Array<GridNode>>
    /**
     * 初始化的障碍物个数
     */
    public static barrierNumber: number = 15
    // 多少行多少列
    public static row: number = 6
    public static col: number = 6
    // 格子的边距
    public static gridMargin: number = 10
}
    
}