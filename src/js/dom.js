
function createSimulation(simulation) {
	const simulationDiv = document.createElement('div');
	simulationDiv.className = "simulation";
	simulationDiv.id = simulation.simulationID;

	const canvas = document.createElement('canvas');
	canvas.id = "canvas";
	canvas.style = `border: ${simulation.canvas.border}; display: block; background: ${simulation.canvas.colour}`;
	canvas.height = simulation.canvas.height;
	canvas.width = simulation.canvas.width;

	simulation.ctx = canvas.getContext('2d');

	canvas.addEventListener('dblclick', async (e) => {
		let canvasCopy = new Image();
		await new Promise(r => canvasCopy.onload = r, canvasCopy.src = canvas.toDataURL())

		simulation.ctx.fillStyle = simulation.canvas.colour;
		simulation.ctx.fillRect(0, 0, canvas.width, canvas.height);
		simulation.ctx.drawImage(canvasCopy, 0, 0)

		window.open(canvas.toDataURL('image/png'), "_blank").focus()
	})

	if (simulation.canvas.resize) {
		window.addEventListener('resize', () => {
			canvas.width = innerWidth;
			canvas.height = innerHeight;
		});
	}

	simulationDiv.appendChild(canvas)
	document.body.appendChild(simulationDiv)
}

function statsCard(blob) {

}

export {
	createSimulation
}