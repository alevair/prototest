'use strict';

function Laser(parameters) {

    var self = this;
    this.params = parameters;
    this.id = -1;

    this.build = function(fdone) {
        
        self.definition = app.engine.getLaserDefinition(self.params.name);
        app.engine.getTexture(self.definition.texture, 
            function(texture) {
                self.texture = texture;
                var spriteMaterial = new THREE.SpriteMaterial( { map: self.texture, color: self.definition.color } );
                self.sprite = new THREE.Sprite( spriteMaterial );
                self.position = self.params.position;
                self.sprite.position.x = self.position.x;
                self.sprite.position.y = self.position.y;
                fdone(self);
            }, function(err) {
                console.log("error at Laser.Build: " + self.params.name + ", err: " + err);
                fdone(self);
            });
    }

    this.update = function(elapsed) {
        self.sprite.position.y += 4 * elapsed;

        if(self.sprite.position.y > 7) {
            app.scene.removeLaser(self);
        }
    }

    this.getId = function() {
        return self.id;
    }

    this.setId = function(id) {
        self.id = id;
    }

    this.getSprite = function() {
        return self.sprite;
    }
 
    this.getPosition = function() {
        return new Victor(self.sprite.position.x, self.sprite.position.y);
    }
 
    this.setPosition = function(x,y) {
        self.sprite.position.x = x;
        self.sprite.position.y = y;
    }
}