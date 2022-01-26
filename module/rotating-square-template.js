const moduleId = 'rotating-square-template';

Hooks.on('init', () => {
    const getRectShape = function(direction, distance) {
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

    const refreshRulerText = function(prev) {
        if ( this.data.t === "rect" ) {
            // Silence libWrapper warnings
            prev.apply(this);

            const u = canvas.scene.data.gridUnits;

            const d = Math.round(2 * this.data.distance * 10) / 10;
            const text = `${d}${u}`;
      
            this.hud.ruler.text = text;
            this.hud.ruler.position.set(this.ray.dx + 10, this.ray.dy + 5);
        } else {
            return prev.apply(this);
        }
    };

    if (typeof libWrapper === 'function') {
        libWrapper.register(moduleId, 'MeasuredTemplate.prototype._getRectShape', function(wrapped, ...args) {
            wrapped.apply(this, args);
            return getRectShape.apply(this, args);            
        });
        libWrapper.register(moduleId, 'MeasuredTemplate.prototype._refreshRulerText', function(wrapped, ...args) {
            return refreshRulerText.apply(this, [wrapped, ...args]);
        });
    } else {
        CONFIG.MeasuredTemplate.objectClass.prototype._getRectShape = getRectShape;

        const previousRulerText = CONFIG.MeasuredTemplate.objectClass.prototype._refreshRulerText;
        CONFIG.MeasuredTemplate.objectClass.prototype._refreshRulerText = function(...args) {
            return refreshRulerText.apply(this, [previousRulerText, ...args]);
        };
    }

    if (game.dnd5e) {
        const fromItem = function(prev, item) {
            const object = prev.apply(this, [item]);
            if (object.data.t == "rect") {
                object.data.update({
                    direction: 0,
                    distance: object.data.distance / (2*Math.sqrt(2))
                });
            }
            return object;
        }

        if (typeof libWrapper === 'function') {
            libWrapper.register(moduleId, 'game.dnd5e.canvas.AbilityTemplate.fromItem', function(wrapped, ...args) {
                return fromItem.apply(this, [wrapped, ...args]);
            });
        } else {
            const prevFromItem = game.dnd5e.canvas.AbilityTemplate.fromItem;
            game.dnd5e.canvas.AbilityTemplate.fromItem = function(...args) {
                return fromItem.apply(this, [prevFromItem, ...args]);
            }
        }
    }
});
