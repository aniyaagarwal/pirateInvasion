class Cannon {
    constructor(x, y, w, h, angle) {
        this.x = x;
        this.y = y;
        this.width = w;
        this.height = h;
        this.angle = angle;
        this.cannon_image = loadImage("assets/canon.png");
        this.cannon_base = loadImage("assets/cannonBase.png");
    }

    display() {
        if(keyIsDown(RIGHT_ARROW) && this.angle<50){
            this.angle += 1;
        }
        if(keyIsDown(LEFT_ARROW) && this.angle>-50){
            this.angle -= 1;
        }

        push();
        translate(this.x, this.y);
        rotate(this.angle);
        imageMode(CENTER);
        image(this.cannon_image, 0, 0, this.width, this.height);
        pop();
        image(this.cannon_base, 70, 20, 200, 200);
        noFill();
    }

    
}