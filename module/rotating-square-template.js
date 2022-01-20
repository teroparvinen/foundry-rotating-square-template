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
    };

    const previous = CONFIG.MeasuredTemplate.objectClass.prototype._refreshRulerText;
    CONFIG.MeasuredTemplate.objectClass.prototype._refreshRulerText = function() {
        if ( this.data.t === "rect" ) {
            const u = canvas.scene.data.gridUnits;

            const d = Math.round(2 * this.data.distance * 10 / Math.sqrt(2)) / 10;
            const text = `${d}${u}`;
      
            this.hud.ruler.text = text;
            this.hud.ruler.position.set(this.ray.dx + 10, this.ray.dy + 5);
        } else {
            return previous.apply(this);
        }
    };
});
