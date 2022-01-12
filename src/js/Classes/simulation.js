import Prey from "./prey.js"
import Predator from "./predator.js"
import { createSimulation } from "../dom.js"

let simCount = 0;
class Simulation {
	simulationID = `Sim#${simCount++}`;
	ctx; /* Provided by the createSimulation */

	preys = new Set();
	predators = new Set();
	targetted = new Set();

	constructor(options = {}) {
		this.initPrey = options['initPrey'] || 100;
		this.initPred = options['initPred'] || 10;
		this.mutationRate = options['mutationRate'] || 0.04;
		this.preyOptions = options['preyOptions'] || {};
		this.predatorOptions = options['predatorOptions'] || {};

		this.canvas = {
			width: options?.['canvas']?.width || document.documentElement.clientWidth,
			height: options?.['canvas']?.height || document.documentElement.clientHeight,
			border: options?.['canvas']?.border || "none",
			colour: options?.['canvas']?.colour || "#2c2f33",
			resize: options?.['canvas']?.resize || true
		}

		this.init();
	}

	init() {
		createSimulation(this);
		for (let i = 0; i < this.initPrey; i++) this.preys.add(new Prey(this.preyOptions));
		for (let i = 0; i < this.initPred; i++) this.predators.add(new Predator(this.predatorOptions));
		this.animate();
	}

	animate() {
		requestAnimationFrame(() => this.animate());
		this.ctx.clearRect(0, 0, document.documentElement.clientWidth, document.documentElement.clientHeight);
		this.update();
	}

	update() {
		this.targetted = new Set();
		this.preys.forEach(prey => prey.update(this.ctx, this));
		this.predators.forEach(pred => pred.update(this.ctx, this));
	}

	kill(type, blob) {
		switch (type) {
			case "prey":
				this.preys.delete(blob);
				break;
			case "predator":
				this.predators.delete(blob);
				break;
		}
	}

	spawn(type, blob) {
		switch (type) {
			case "prey":
				this.preys.add(blob);
				break;
			case "predator":
				this.predators.add(blob);
				break;
		}
	}
}

export default Simulation