class Vector {
	constructor(θ, magnitude) {
		[this.angle, this.magnitude] = [θ, magnitude];
	}
	apply = pos => [pos[0] + Math.cos(this.angle) * this.magnitude, pos[1] + Math.sin(this.angle) * this.magnitude];
}

export default Vector;