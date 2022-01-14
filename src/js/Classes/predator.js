import Base from "./base.js";
import Vector from "../Math/vector.js";
import { modCoords, random, mod, circleCollision } from "../Math/utils.js";
import { Genomes, Genome } from "./genome.js";


class Predator extends Base {
	constructor(options = {}) {
		super(options);
		this.pos = [random(0, canvas.width), random(0, canvas.height)];
		this.vel = new Vector(Math.PI / 2, 2);

		this.colour = "#eb4034";
		this.genomes = new Genomes();
		this.genomes.add(new Genome("size", 5, 0.5));
		this.genomes.add(new Genome("view", 240, 5));
		this.genomes.add(new Genome("maxSpeed", 1.5, 0.3));
		this.genomes.add(new Genome("maxAge", 200, 1));
		this.genomes.add(new Genome("maxAge", 5000, 1));
		this.genomes.add(new Genome("maxNotEaten", 700, 1));

		this.notEaten = 0;
	}

	wander() {
		this.vel.angle += random(-0.035, 0.035);
	}

	update(ctx, simulation) {
		if (this.steps > this.genomes.getValue("maxAge") && this.notEaten > this.genomes.getValue("maxNotEaten")) return simulation.kill("predator", this)
		this.notEaten++;

		const nearest = this.getNearestPrey(simulation);
		if (nearest.pos) {
			if (circleCollision(this, nearest)) {
				this.notEaten = 0;
				simulation.kill("prey", nearest)
			} this.vel.angle = this.aimAtPos(nearest.pos);
		} else this.wander();

		this.pos = modCoords(this.vel.apply(this.pos), canvas);
		super.update(ctx)
	}

	getNearestPrey(simulation) {
		let nearest = [Infinity, {}];
		simulation.preys.forEach(prey => {
			const dy = mod(prey.pos[1] - this.pos[1] + canvas.height / 2, canvas.height) - canvas.height / 2;
			const dx = mod(prey.pos[0] - this.pos[0] + canvas.width / 2, canvas.width) - canvas.width / 2
			const distance = Math.hypot(dx, dy);
			if (distance < nearest[0] && distance < this.genomes.getValue("view") && !simulation.targetted.has(prey)) nearest = [distance, prey];
		})
		if (nearest[0] !== Infinity) simulation.targetted.add(nearest[1]);
		return nearest[1];
	}

	aimAtPos(pos) {
		const dy = mod(pos[1] - this.pos[1] + canvas.height / 2, canvas.height) - canvas.height / 2;
		const dx = mod(pos[0] - this.pos[0] + canvas.width / 2, canvas.width) - canvas.width / 2;
		return Math.atan2(dy, dx)
	}
}

export default Predator;