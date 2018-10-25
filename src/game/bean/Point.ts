class Point {
    public x: number = 0
    public y: number = 0

    public constructor(x: number, y: number) {
        this.x = x
        this.y = y
    }

    /**
     * 判断两个点是否相等
     */
    public equal(point: Point): boolean {
        return point && point.x === this.x && point.y === this.y
    }

    public copy(): Point {
        return new Point(this.x, this.y)
    }
}