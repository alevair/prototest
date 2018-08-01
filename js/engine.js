'use strict';

function GameEngine(parameters) {

    var self = this;
    this.parameters = parameters;
    this.elements = [];

    // Elapsed time betwheen frames
    this.elapsed = 0;
    this.prevtime = 0;

    this.init = function() {

        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera( 45, window.innerWidth/window.innerHeight, 1, 500 );

        this.camera.position.set(0, 0, 50);
        this.camera.lookAt(new THREE.Vector3(0, 0, 0));

        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize( window.innerWidth, window.innerHeight );
        document.body.appendChild( this.renderer.domElement );
    }

    this.animate = function() {
        var current_time = new Date();
        self.elapsed = 1 / (current_time - self.prevtime);

        requestAnimationFrame(self.animate );
    
        // Animate the game elements
        for(var l1=0; l1<self.elements.length; l1++) {
            var elem = self.elements[l1];
            elem.update(self.elapsed);
        }

        self.renderer.render( self.scene, self.camera );
        self.prevtime = current_time;
    }

    this.add = function(gameElement) {
        self.scene.add(gameElement.geom);
        self.elements.push(gameElement);
    }
}