const toRadians = pos => pos / 180 * Math.PI;

const mod = (v, n) => ((v % n) + n) % n;

const modCoords = (pos, canvas) => [mod(pos[0], canvas.width), mod(pos[1], canvas.height)];

const random = (min, max) => Math.random() * (max - min) + min;

const circleCollision = (blob1, blob2) => (((blob1?.genomes?.getValue("size") ?? blob2.size) + (blob2?.genomes?.getValue("size") ?? blob1.size)) ** 2 > (blob1.pos[0] - blob2.pos[0]) ** 2 + (blob1.pos[1] - blob2.pos[1]) ** 2)

export {
	toRadians,
	mod,
	modCoords,
	random,
	circleCollision
}