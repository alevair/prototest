'use strict';

function Mainship(parameters) {

    var self = this;
    this.params = parameters;
    this.waitLaser = 1;

    this.build = function(fdone) {
        
        self.definition = app.engine.getMainshipDefinition(self.params.name);
        app.engine.getTexture(self.definition.texture, 
            function(texture) {
                self.texture = texture;
                var spriteMaterial = new THREE.SpriteMaterial( { map: self.texture, color: self.definition.color } );
                self.sprite = new THREE.Sprite( spriteMaterial );
                self.sprite.position.x = self.params.position.x;
                self.sprite.position.y = self.params.position.y;
                self.sprite.scale.x = self.definition.scale.x;
                self.sprite.scale.y = self.definition.scale.y;                
                fdone(self);
            }, function(err) {
                console.log("error at Mainship.Build: " + self.params.name + ", err: " + err);
                fdone(self);
            });
    }

    this.update = function(elapsed) {

        self.waitLaser -= elapsed;

        if (Key.isDown(Key.LEFT)) {
            var pos = self.getPosition();
            self.setPosition(pos.x - 0.3, pos.y);            
        }
        if (Key.isDown(Key.RIGHT)) {
            var pos = self.getPosition();
            self.setPosition(pos.x + 0.3, pos.y);                        
        }
        if (Key.isDown(Key.SPACE)) {
            self.shootLaser();
        }
    }

    this.shootLaser = function() {
        if(self.waitLaser <= 0) {
            self.waitLaser = 1;

            var laser = new Laser({ 
                name: "laser",
                position: new Victor(self.getPosition().x, -7)
            });
            laser.build(function(source) {
                app.scene.addLaser(source);
        });        
        }
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