'use strict';

function Scene(parameters) {

    var self = this;
    this.params = parameters;
    this.nextElementId = 1;
    this.enemies = [];
    this.mainships = [];
    this.lasers = [];
    this.debris = [];
    this.position = new Victor(-7,0);

    this.movementVertical = 0.0;
    this.movementHorizontal = 16;

    this.addMainship = function(mainship) {
        self.mainships.push(mainship);
        app.engine.addSprite(mainship.getSprite());        
    }

    this.addEnemy = function(enemy) {
        enemy.setId(self.nextElementId++);

        var x = Math.trunc(self.enemies.length / 8);
        var y = self.enemies.length - (x * 8);
        enemy.setFormation(y, x);
        self.enemies.push(enemy);

        app.engine.addSprite(enemy.getSprite());
    }

    this.removeEnemy = function(enemy) {
        for(var l1=0; l1<self.enemies.length; l1++) {
            if(self.enemies[l1].id == enemy.id) {
                self.enemies.splice(l1,1);
                break;
            }
        }
        
        app.engine.removeSprite(enemy.getSprite());
    }

    this.addLaser = function(laser) {
        laser.setId(self.nextElementId++);
        self.lasers.push(laser);
        app.engine.addSprite(laser.getSprite());        
    }

    this.removeLaser = function(laser) {
        for(var l1=0; l1<self.lasers.length; l1++) {
            if(self.lasers[l1].id == laser.id) {
                self.lasers.splice(l1,1);
                break;
            }
        }
        
        app.engine.removeSprite(laser.getSprite());
    }

    this.addRubbish = function(rubbish) {
        rubbish.setId(self.nextElementId++);
        self.debris.push(rubbish);
        app.engine.addSprite(rubbish.getSprite());        
    }

    this.removeRubbish = function(rubbish) {
        for(var l1=0; l1<self.debris.length; l1++) {
            if(self.debris[l1].id == rubbish.id) {
                self.debris.splice(l1,1);
                break;
            }
        }
        
        app.engine.removeSprite(rubbish.getSprite());
    }

    this.update = function(elapsed) {
    
        var distance = elapsed * 0.5;

        if(self.movementVertical > 0) {
            self.movementVertical -= elapsed;
            if(self.movementVertical < 0) {
                self.movementVertical = 0;
            }
            self.position.y -= elapsed;
        }

        if(self.movementHorizontal > 0) {
            self.movementHorizontal -= distance;
            if(self.movementHorizontal < 0) {
                self.movementVertical = 0.6;
                self.movementHorizontal = -16;
            }
            self.position.x += distance;
        } else {
            self.movementHorizontal += distance;
            if(self.movementHorizontal >= 0) {
                self.movementVertical = 0.6;
                self.movementHorizontal = 16;
            }
            self.position.x -= distance;
        }

        for(var l1=0; l1<self.enemies.length; l1++) {
            var enemy = self.enemies[l1];
            var pos = enemy.getPosition();

            enemy.setTarget(enemy.formation.x * 2 - 8 + self.position.x, enemy.formation.y * 1.4 + 2 + self.position.y);
            enemy.update(elapsed);
        }

        for(var l1=0; l1<self.mainships.length; l1++) {
            var mainship = self.mainships[l1];
            mainship.update(elapsed);        
        }

        for(var l1=0; l1<self.lasers.length; l1++) {
            var laser = self.lasers[l1];
            laser.update(elapsed);        
        }

        for(var l1=0; l1<self.debris.length; l1++) {
            var rubbish = self.debris[l1];
            rubbish.update(elapsed);

            if(rubbish.getLiveTime() < 0) {
                app.scene.removeRubbish(rubbish);
                l1--;
            }
        }        

        self.collisionsLaserEnemy();
    }

    this.collisionsLaserEnemy = function() {
        for(var l1=0; l1<self.lasers.length; l1++) {
            var laser = self.lasers[l1];

            var enemyCollide = null;
            for(var l2=0; l2<self.enemies.length; l2++) {
                var enemy = self.enemies[l2];
                if(enemy.getMovement() != EnemyMovementEnum.Dead) {
                    var dis = laser.getPosition().distance(enemy.getPosition());

                    if(dis < 0.5) {
                        enemyCollide = enemy;
                        break;
                    }    
                }
            }       
            if(enemyCollide != null) {
                self.removeEnemy(enemyCollide);
                self.removeLaser(laser);
                l1--;

                for(var l3=0; l3<15; l3++) {
                    var rubbish = new Rubbish({ 
                        name: "enemy",
                        direction: randomVictorDirection(),
                        velocity: randomNumber(100, 1000),
                        friction: 0.01,
                        liveTime: 3,
                        position: { 
                            x: enemyCollide.getPosition().x,
                            y: enemyCollide.getPosition().y,
                        }
                    });
                    rubbish.build(function(source) {
                        app.scene.addRubbish(source);
                    });                        
                }
            }            
        }
    }
}