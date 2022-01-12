class Base {
	constructor(options) {
		this.steps = 0;
		this.pos = [0, 0];

		this.size = 5;
		this.colour = "#4287f5";
	}

	draw(ctx) {
		ctx.beginPath();
		ctx.arc(this.pos[0], this.pos[1], this?.genomes?.getValue("size") ?? this.size, 0, Math.PI * 2);
		ctx.fillStyle = this?.genomes?.colour ?? this.colour;
		ctx.fill();
	}

	update(ctx) {
		this.steps++;
		this.draw(ctx);
	}
}

export default Base;