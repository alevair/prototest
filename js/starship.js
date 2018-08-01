function Starship(parameters) {
    var self = this;
    this.parameters = parameters;

    // Build the geometry, init vars with defaults
    this.build = function() {
        self.geometry = new THREE.BoxGeometry( 1, 1, 1 );
        self.material = new THREE.MeshBasicMaterial( { color: 0xff0000 } );
        self.geom = new THREE.Mesh(self.geometry,self.material);

        self.velocity = self.parameters.velocity;
        self.direction = new Victor(0,1);
        self.tforce = self.parameters.tforce;
    }

    // Update the logic of the starship
    this.update = function(elapsed) {

        var target = self.parameters.target;

        var dif = target.subtract(self.get_position());
        var dir = dif.clone().normalize();

        self.direction = self.direction.clone().add(new Victor(dir.x * elapsed * self.tforce, dir.y * elapsed * self.tforce));
        self.direction.normalize();

        var increment = self.direction.multiply(new Victor(self.velocity * elapsed, self.velocity * elapsed));

        self.geom.position.x += increment.x * elapsed * 1.1;            
        self.geom.position.y += increment.y * elapsed * 1.1;

        self.geom.rotation.x += 1 * elapsed;
        self.geom.rotation.y += 1 * elapsed;
   }

   this.get_position = function() {
       return new Victor(self.geom.position.x, self.geom.position.y);
   }

   this.build();
}

