import Prey from "./prey.js";
import Predator from "./predator.js";
import Plant from "./plant.js";
import { createSimulation } from "../dom.js"

let simCount = 0;
class Simulation {
	simulationID = `Sim#${simCount++}`;
	ctx; /* Provided by the createSimulation */

	preys = new Set();
	predators = new Set();
	plants = new Set();
	targetted = new Set();

	constructor(options = {}) {
		this.initPrey = options['initPrey'] || 10;
		this.initPred = options['initPred'] || 1;
		this.initPlants = options['initPlants'] || 20;
		this.mutationRate = options['mutationRate'] || 4;
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

	all = () => new Set([...this.preys, ...this.predators, ...this.plants]);

	init() {
		createSimulation(this);
		for (let i = 0; i < this.initPlants; i++) this.plants.add(new Plant({}));
		for (let i = 0; i < this.initPrey; i++) this.preys.add(new Prey(this.preyOptions));
		for (let i = 0; i < this.initPred; i++) this.predators.add(new Predator(this.predatorOptions));
		this.animate();
	}

	animate() {
		if (this.preys.size === 0 || this.predators.size === 0) return this.finish();
		requestAnimationFrame(() => this.animate());
		this.ctx.clearRect(0, 0, document.documentElement.clientWidth, document.documentElement.clientHeight);
		this.update();
	}

	update() {
		this.targetted = new Set();
		this.all().forEach(v => v.update(this.ctx, this));
	}

	kill(type, blob) {
		switch (type) {
			case "prey":
				this.preys.delete(blob);
				break;
			case "predator":
				this.predators.delete(blob);
				break;
			case "plant":
				this.plants.delete(blob);
				break;
		}
	}

	spawn(type, blob) {
		const copy = JSON.parse(JSON.stringify(blob))
		switch (type) {
			case "prey":
				this.preys.add(new Prey(copy));
				break;
			case "predator":
				this.predators.add(new Predator(copy));
				break;
			case "plant":
				this.plants.add(new Plant(copy));
				break;
		}
	}

	finish() {
		this.ctx.font = `${canvas.width / 11}px Arial`;
		this.ctx.fillStyle = this.preys.size === 0 ? "RED" : "GREEN"; // "WHITE"
		this.ctx.textAlign = "center";
		this.ctx.fillText(`Predators: ${this.predators.size}\nPreys: ${this.preys.size}`, canvas.width / 2, canvas.height / 2);
	}
}

export default Simulation