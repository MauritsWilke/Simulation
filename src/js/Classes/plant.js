import Base from "./base.js";
import { random } from "../Math/utils.js"
import { Genomes, Genome } from "./genome.js";

class Plant extends Base {
	constructor(options) {
		super(options);
		this.spawnRadius = options?.['spawnRadius'] ?? 60;
		this.pos = options?.['pos'] ? [options.pos[0] + random(-this.spawnRadius, this.spawnRadius) + this.size, options.pos[1] + random(-this.spawnRadius, this.spawnRadius) + this.size] : [random(0, canvas.width), random(0, canvas.height)];
		this.colour = this.randomGreen();

		this.genomes = new Genomes();
		this.genomes.add(new Genome("energy", 200, 1));
		this.genomes.add(new Genome("maxAge", random(1600, 2400), 1));
	}

	update(ctx, simulation) {
		if (this.pos[0] > canvas.width || this.pos[1] > canvas.height || this.pos[0] < 0 || this.pos[1] < 0) return simulation.kill('plant', this);
		if (this.steps > this.genomes.getValue("maxAge")) return simulation.kill('plant', this);
		if (Math.random() < (0.0008 * simulation.preys.size / 1.7) && this.checkOtherPlants(simulation) < 10) simulation.spawn("plant", this);
		super.update(ctx)
	}

	randomGreen = () => `#${Math.round(random(16, 100)).toString(16)}${Math.round(random(160, 255)).toString(16)}${Math.round(random(16, 100)).toString(16)}`;

	checkOtherPlants(simulation) {
		let nearby = 0;
		simulation.plants.forEach(plant => {
			const dy = plant.pos[1] - this.pos[1];
			const dx = plant.pos[0] - this.pos[0];
			const distance = Math.hypot(dx, dy);
			if (distance < this.spawnRadius + 30) nearby++;
		})
		return nearby;
	}
}


export default Plant;