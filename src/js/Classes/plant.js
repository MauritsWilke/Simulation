import Base from "./base.js";
import { random } from "../Math/utils.js"
import { Genomes, Genome } from "./genome.js";

class Plant extends Base {
	constructor(options) {
		super(options);
		this.pos = [random(0, canvas.width), random(0, canvas.height)];
		this.colour = "#007806";

		this.genomes = new Genomes();
		this.genomes.add(new Genome("energy", 200, 1))
	}

	update(ctx, simulation) {
		if (Math.random() < 0.001) {
			simulation.spawn("plant", this);
		}

		super.update(ctx)
	}
}

export default Plant;