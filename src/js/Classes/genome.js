import { random } from "../Math/utils.js"

class Genomes {
	constructor(genomes = {}) {
		this.genomes = genomes
	}
	get = (genome) => this.genomes[genome];
	getValue = (genome) => this.genomes?.[genome]?.value;
	add = (genome) => this.genomes[genome.name] = { value: genome.value, mod: genome.modifier };
	remove = (name) => delete this.genomes[name];
}

class Genome {
	constructor(name, value, modifier) {
		this.name = name;
		this.value = value;
		this.modifier = modifier;
	}
	mutate = (mutRate) => this.value = Math.random() * 100 < mutRate ? this.value += random(-1, 1) * this.modifier : this.value;
}

export {
	Genomes,
	Genome
}