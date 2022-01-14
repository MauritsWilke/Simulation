import Base from "./base.js";
import { random } from "../Math/utils.js"
import { Genomes, Genome } from "./genome.js";

class Plant extends Base {
	constructor(options) {
		super(options);
		this.spawnRadius = options?.['spawnRadius'] ?? 60;
		this.pos = options?.['pos'] ? [options.pos[0] + random(-this.spawnRadius, this.spawnRadius), options.pos[1] + random(-this.spawnRadius, this.spawnRadius)] : [random(0, canvas.width), random(0, canvas.height)];
		this.colour = "#007806";

		this.genomes = new Genomes();
		this.genomes.add(new Genome("energy", 200, 1))
	}

	update(ctx, simulation) {
		// if (Math.random() < 0.0003) simulation.spawn("plant", this);
		super.update(ctx)
	}
}

export default Plant;