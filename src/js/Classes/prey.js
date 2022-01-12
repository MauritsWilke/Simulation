import Base from "./base.js";
import Vector from "../Math/vector.js";
import { modCoords, random, mod } from "../Math/utils.js";
import { Genomes, Genome } from "./genome.js";

class Prey extends Base {
	constructor(options) {
		super(options);
		this.pos = [random(0, canvas.width), random(0, canvas.height)];
		this.vel = new Vector(random(0, Math.PI * 2), 1.5);

		this.genomes = new Genomes();
		this.genomes.add(new Genome("size", 5, 0.5));
		this.genomes.add(new Genome("view", 120, 5));
		this.genomes.add(new Genome("maxSpeed", 1.5, 0.3));
		this.genomes.add(new Genome("maxRuntime", 100, 1));
		this.genomes.add(new Genome("maxAge", 2000, 1));
		this.genomes.add(new Genome("maxEnergy", 100, 1));

		this.runtime = 0;
		this.energy = this.genomes.getValue('maxEnergy');
	}

	wander() {
		this.energy -= 1;
		this.vel.angle += random(-0.035, 0.035);
		if (this.vel.magnitude > 1.5) this.vel.magnitude -= 0.05;
	}

	run() {
		this.energy -= 3;
		this.runtime--;
		this.vel.magnitude = this.genomes.getValue("maxSpeed");
	}

	update(ctx, simulation) {
		if (this.steps > this.genomes.getValue("maxAge") || this.energy <= 0) return simulation.kill("prey", this)
		if (this.energy > this.genomes.getValue("ma")) {

		}
		const nearest = this.getNearestPred(simulation);
		if (nearest) this.runtime = this.genomes.getValue("maxRuntime")
		if (nearest || this.runtime > 0) {
			this.vel.angle = this.aimAwayFromPos(nearest);
			this.run();
		} else this.wander();

		this.pos = modCoords(this.vel.apply(this.pos), canvas);
		super.update(ctx);
	}

	getNearestPred(simulation) {
		let nearest = [Infinity, {}];
		simulation.predators.forEach(pred => {
			const dy = mod(pred.pos[1] - this.pos[1] + canvas.height / 2, canvas.height) - canvas.height / 2;
			const dx = mod(pred.pos[0] - this.pos[0] + canvas.width / 2, canvas.width) - canvas.width / 2;
			const distance = Math.hypot(dx, dy);
			if (distance < nearest[0] && distance < this.genomes.getValue("view")) nearest = [distance, pred];
		})
		if (nearest[0] === Infinity) return;
		return nearest[1].pos;
	}

	aimAwayFromPos(pos) {
		if (!pos) return this.vel.angle;
		const dy = mod(pos[1] - this.pos[1] + canvas.height / 2, canvas.height) - canvas.height / 2;
		const dx = mod(pos[0] - this.pos[0] + canvas.width / 2, canvas.width) - canvas.width / 2;
		return Math.atan2(dy, dx) + Math.PI;
	}
}

export default Prey;