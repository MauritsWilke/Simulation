import Base from "./base.js";
import Vector from "../Math/vector.js";
import { modCoords, random, mod, circleCollision } from "../Math/utils.js";
import { Genomes, Genome } from "./genome.js";

class Prey extends Base {
	constructor(options) {
		super(options);
		this.pos = [random(0, canvas.width), random(0, canvas.height)];
		this.vel = new Vector(random(0, Math.PI * 2), 1.5);

		this.genomes = new Genomes();
		this.genomes.add(new Genome("size", 5, 0.5));
		this.genomes.add(new Genome("view", 120, 5));
		this.genomes.add(new Genome("maxSpeed", 3, 0.3));
		this.genomes.add(new Genome("maxRuntime", 100, 1));
		this.genomes.add(new Genome("maxAge", Infinity, 1));

		this.runtime = 0;
		this.repChance = 0;
	}

	wander() {
		this.vel.angle += random(-0.035, 0.035);
		if (this.vel.magnitude > 1.5) this.vel.magnitude -= 0.05;
	}

	run() {
		this.runtime--;
		this.vel.magnitude = this.genomes.getValue("maxSpeed");
	}

	update(ctx, simulation) {
		if (this.steps > this.genomes.getValue("maxAge")) return simulation.kill("prey", this)

		this.repChance += 0.00005;
		if (Math.random() * 100 < this.repChance) {
			simulation.spawn('prey', this);
			this.repChance = 0;
		}

		const nearest = this.getNearestPred(simulation);
		if (nearest) this.runtime = this.genomes.getValue("maxRuntime")
		if (nearest || this.runtime > 0) {
			this.vel.angle = this.aimAtPos(nearest?.pos) + Math.PI;
			this.run();
		} else this.wander();

		if (!nearest && this.runtime === 0) {
			const nearestPlant = this.getNearestPlant(simulation);
			if (nearestPlant) {
				this.vel.angle = this.aimAtPos(nearestPlant.pos);
				if (circleCollision(this, nearestPlant)) simulation.kill("plant", nearestPlant);
			}
		}


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
		return nearest[1];
	}

	getNearestPlant(simulation) {
		let nearest = [Infinity, {}];
		simulation.plants.forEach(plant => {
			const dy = mod(plant.pos[1] - this.pos[1] + canvas.height / 2, canvas.height) - canvas.height / 2;
			const dx = mod(plant.pos[0] - this.pos[0] + canvas.width / 2, canvas.width) - canvas.width / 2;
			const distance = Math.hypot(dx, dy);
			if (distance < nearest[0] && distance < this.genomes.getValue("view")) nearest = [distance, plant];
		})
		if (nearest[0] === Infinity) return;
		return nearest[1];
	}

	aimAtPos(pos) {
		if (!pos) return this.vel.angle - Math.PI;
		const dy = mod(pos[1] - this.pos[1] + canvas.height / 2, canvas.height) - canvas.height / 2;
		const dx = mod(pos[0] - this.pos[0] + canvas.width / 2, canvas.width) - canvas.width / 2;
		return Math.atan2(dy, dx)
	}
}

export default Prey;