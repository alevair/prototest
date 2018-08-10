'use strict';

function Rubbish(parameters) {

    var self = this;
    this.params = parameters;
    this.id = -1;
    this.liveTime = 0;
    this.velocity = 0;
    this.friction = 0.01;
    this.direction = null;

    this.build = function(fdone) {
        
        self.definition = app.engine.getDebrisDefinition(self.params.name);
        app.engine.getTexture(self.definition.texture, 
            function(texture) {
                self.texture = texture;
                var spriteMaterial = new THREE.SpriteMaterial( { map: self.texture, color: self.definition.color } );
                self.sprite = new THREE.Sprite( spriteMaterial );
                self.sprite.position.x = self.params.position.x;
                self.sprite.position.y = self.params.position.y;
                self.liveTime = self.params.liveTime;
                self.velocity = self.params.velocity;
                self.direction = self.params.direction;

                self.sprite.scale.x = self.definition.scale.x;
                self.sprite.scale.y = self.definition.scale.y;
                fdone(self);
            }, function(err) {
                console.log("error at Rubbish.Build: " + self.params.name + ", err: " + err);
                fdone(self);
            });
    }

    this.update = function(elapsed) {
        self.liveTime -= elapsed;

        var vel = new Victor(self.direction.x * self.velocity * elapsed, self.direction.y * self.velocity * elapsed);
        self.velocity = self.velocity - (self.friction * elapsed);

        var increment = new Victor(vel.x * elapsed, vel.y * elapsed);

        self.sprite.position.x += increment.x * elapsed;            
        self.sprite.position.y += increment.y * elapsed;
        self.sprite.material.rotation += 0.1;

        self.sprite.material.color = new THREE.Color( self.liveTime / self.params.liveTime, 0, 0 );
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

    this.getId = function() {
        return self.id;
    }

    this.setId = function(id) {
        self.id = id;
    }

    this.getLiveTime = function() {
        return self.liveTime;
    }
}