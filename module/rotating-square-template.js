Hooks.on('init', () => {
    CONFIG.MeasuredTemplate.objectClass.prototype._getRectShape = function(direction, distance) {
        let r = Ray.fromAngle(0, 0, direction, distance),
            dx = r.dx - r.dy,
            dy = r.dy + r.dx;

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

            const d = Math.round(2 * this.data.distance * 10) / 10;
            const text = `${d}${u}`;
      
            this.hud.ruler.text = text;
            this.hud.ruler.position.set(this.ray.dx + 10, this.ray.dy + 5);
        } else {
            return previous.apply(this);
        }
    };

    if (game.dnd5e) {
        const prevFromItem = game.dnd5e.canvas.AbilityTemplate.fromItem;
        game.dnd5e.canvas.AbilityTemplate.fromItem = function(item) {
            const object = prevFromItem.apply(this, [item]);
            if (object.data.t == "rect") {
                object.data.update({
                    direction: 0,
                    distance: object.data.distance / (2*Math.sqrt(2))
                });
            }
            return object;
        }
    }
});
