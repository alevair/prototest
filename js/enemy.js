'use strict';

function Enemy(parameters) {
    var self = this;
    this.params = parameters;
    self.id = -1;
    self.position = null;
    self.direction = new Victor(0, 1);
    self.impulse = 20;
    self.tforce = 1;
    self.friction = 0.1;
    self.velocity = new Victor(0, 0);
    self.target = null;
    self.formation = {
        x: 0,
        y: 0
    };
    self.movement = EnemyMovementEnum.Building;

    this.getId = function() {
        return self.id;
    }

    this.setId = function(id) {
        self.id = id;
    }

    this.getFormation = function(x, y) {
        return self.formation;
    }    

    this.setFormation = function(x, y) {
        self.formation.x = x;
        self.formation.y = y;
    }

    this.getTarget = function() {
        return self.target;
    }

    this.setTarget = function(x, y) {
        self.target.x = x;
        self.target.y = y;
    }

    this.getMovement = function() {
        return self.movement;
    }

    this.setMovement = function(movement) {
        self.movement = movement;
    }    

    // Build the geometry, init vars with defaults
    this.build = function(fdone) {
        
        self.definition = app.engine.getEnemyDefinition(self.params.name);
        app.engine.getTexture(self.definition.texture, 
            function(texture) {
                self.texture = texture;
                var spriteMaterial = new THREE.SpriteMaterial( { map: self.texture, color: self.definition.color } );
                self.sprite = new THREE.Sprite( spriteMaterial );
                self.position = self.params.position;
                self.impulse = self.params.impulse;
                self.tforce = self.params.tforce;
                self.sprite.position.x = self.position.x;
                self.sprite.position.y = self.position.y;
                self.target = self.params.target;
                fdone(self);
            }, function(err) {
                console.log("error at Enemy.Build: " + self.params.name + ", err: " + err);
                fdone(self);
            });

    }

    this.update = function(elapsed) {

        switch(self.movement) {
            case EnemyMovementEnum.Building:
                self.setMovement(EnemyMovementEnum.Start);
                break;
    
            case EnemyMovementEnum.Start:
                self.updateStart(elapsed);
                break;
            
            case EnemyMovementEnum.Formation:
                self.updateFormation(elapsed);
                break;

            case EnemyMovementEnum.Attack:
                self.updateAttack(elapsed);
                break;

            case EnemyMovementEnum.Dead:
                self.updateDead(elapsed);
                break;
        }
    }

    this.updateStart = function(elapsed) {
        var dif = self.target.clone().subtract(self.getPosition());
        var dir = dif.clone().normalize();

        var tdista = self.target.distance(self.getPosition());

        self.direction = self.direction.clone().add(new Victor(dir.x * elapsed * self.tforce, dir.y * elapsed * self.tforce));
        self.direction = self.direction.normalize();

        self.velocity = new Victor(self.velocity.x + (self.direction.x * self.impulse * elapsed), self.velocity.y + (self.direction.y * self.impulse * elapsed));
        self.velocity = new Victor(self.velocity.x - (self.velocity.x * self.friction * elapsed),self.velocity.y - (self.velocity.y * self.friction * elapsed));

        var increment = new Victor(self.velocity.x * elapsed, self.velocity.y * elapsed);

        if(tdista > 0.1 && tdista < 5) {
            var attract = new Victor(dir.x * 20 * elapsed, dir.y * 20 * elapsed);
            self.sprite.position.x += attract.x * elapsed;     
            self.sprite.position.y += attract.y * elapsed;       
        }

        if(tdista > 0.1) {
            self.sprite.position.x += increment.x * elapsed;            
            self.sprite.position.y += increment.y * elapsed;
            self.sprite.material.rotation = self.direction.x * 0.1;
        } else {
            self.sprite.material.rotation = 0;
            self.sprite.position.x = self.target.x;
            self.sprite.position.y = self.target.y;
            self.setMovement(EnemyMovementEnum.Formation);
        }
    }

    this.updateFormation = function(elapsed) {
        self.sprite.position.x = self.target.x;
        self.sprite.position.y = self.target.y;
    }

    this.updateAttack = function(elapsed) {

    }

    this.updateDead = function(elapsed) {

    }


   this.getPosition = function() {
        return new Victor(self.sprite.position.x, self.sprite.position.y);
   }

   this.setPosition = function(x,y) {
        self.sprite.position.x = x;
        self.sprite.position.y = y;
   }

   this.getSprite = function() {
       return self.sprite;
   }
}

