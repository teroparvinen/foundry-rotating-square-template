Hooks.on('init', () => {
    CONFIG.MeasuredTemplate.objectClass.prototype._getRectShape = function(direction, distance) {
        let r = Ray.fromAngle(0, 0, direction, distance),
            dx = r.dx,
            dy = r.dy;

        const points = [
            dx, dy,
            dy, -dx,
            -dx, -dy,
            -dy, dx,
            dx, dy
        ];

        return new PIXI.Polygon(points);
    }
});
