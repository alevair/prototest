'use strict';

function GameEngine(parameters) {

    var self = this;
    this.params = parameters;
    this.textures = [];
    this.entities = [];

    // Elapsed time betwheen frames
    this.elapsed = 0;
    this.prevtime = 0;

    this.init = function(fdone) {

        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera( 45, window.innerWidth/window.innerHeight, 1, 500 );

        this.camera.position.set(0, 0, 20);
        this.camera.lookAt(new THREE.Vector3(0, 0, 0));

        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize( window.innerWidth, window.innerHeight );
        document.body.appendChild( this.renderer.domElement );

        this.loadEntities(function() {
            fdone();
        });
    }

    this.update = function() {
        var current_time = new Date();
        self.elapsed = 1 / (current_time - self.prevtime);

        requestAnimationFrame(self.update);

        app.scene.update(self.elapsed);
        self.renderer.render( self.scene, self.camera );

        self.prevtime = current_time;
    }

    this.addSprite = function(sprite) {
        self.scene.add(sprite);
    }

    this.removeSprite = function(sprite) {
        self.scene.remove(sprite);
    }

    this.loadEntities = function(fdone) {
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState == 4) {
                if(xmlhttp.status == 200) {
                    self.entities = JSON.parse(xmlhttp.responseText);

                    console.log(self.entities);

                    fdone();
                } else {
                    console.log(xmlhttp.statusText);
                }
            }
        };
        var url = "dat/entities.json";
        xmlhttp.open("GET", url, true);
        xmlhttp.send();
    }

    this.getEntity = function(name) {
        for(var l1=0; l1<self.entities.length; l1++) {
            var ent = self.entities[l1];
            if(ent.name == name) {
                return ent;
            }
        }
        console.log("Entity not found: " + name);
        return null;
    }

    this.getEnemyDefinition = function(name) {
        for(var l1=0; l1<self.entities.enemies.length; l1++) {
            var def = self.entities.enemies[l1];

            if(def.name == name) {
                return def;
            }
        }
        console.log("Enemy definition not found: " + name);
        return null;        
    }

    this.getMainshipDefinition = function(name) {
        for(var l1=0; l1<self.entities.mainships.length; l1++) {
            var def = self.entities.mainships[l1];

            if(def.name == name) {
                return def;
            }
        }
        console.log("Mainship definition not found: " + name);
        return null;        
    }

    this.getLaserDefinition = function(name) {
        for(var l1=0; l1<self.entities.lasers.length; l1++) {
            var def = self.entities.lasers[l1];

            if(def.name == name) {
                return def;
            }
        }
        console.log("Laser definition not found: " + name);
        return null;        
    }

    this.getDebrisDefinition = function(name) {
        for(var l1=0; l1<self.entities.debris.length; l1++) {
            var def = self.entities.debris[l1];

            if(def.name == name) {
                return def;
            }
        }
        console.log("Debris definition not found: " + name);
        return null;        
    }

    // Returns the texture
    // If the texture is loaded, returns a reference
    // if not, load it an returns a reference
    this.getTexture = function(url, fdone, ferr) {

        for(var l1=0; l1<this.textures.length; l1++) {
            var texentry = this.textures[l1];

            if(texentry.name == url) {
                fdone(texentry.texture);
                return;
            }
        }
        var loader = new THREE.TextureLoader();

        loader.load(url, 
            function(texture) {
                var tentry = {
                    name: url,
                    texture: texture
                }
                self.textures.push(tentry);
                fdone(texture);
            },
            undefined,
            function(err) {
                ferr(err);
            });

    }
}