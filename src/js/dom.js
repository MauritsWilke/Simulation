
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

	canvas.addEventListener('click', async (e) => {
		const [x, y] = [e.clientX, e.clientY];
		for (let blob of simulation.all()) {
			const dx = Math.abs(x - blob.pos[0]);
			const dy = Math.abs(y - blob.pos[1])
			const distance = Math.sqrt(dx * dx + dy * dy)
			if (distance < 50) return statsCard(blob);
		}
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
	const [x, y] = [blob.pos[0], blob.pos[1]];

	const infoCard = document.createElement('div');
	infoCard.style = `	position: absolute; 
						top: ${y}px; 
						left: ${x}px; 
						background-color: ${blob.colour};
						overflow-wrap: break-word;
						border-radius: 5px;
						margin: 5px;`;

	const title = document.createElement('h3');
	title.style = "text-align: center";
	title.innerText = blob.name ?? "Dennis";

	//#region Divider
	const divider = document.createElement('hr');
	divider.style = `	width: 80%;
						margin-left: 10%;
						border: 1px solid black;
						margin-top: 5px;`;
	//#endregion Divider
	//#region Stats
	const stats = document.createElement('ul');
	const content = [
		`🔷 Size: ${blob.size}`,
		`&nbsp;📍 Position: ${Math.round(blob.pos[0])} ,${Math.round(blob.pos[1])}`,
		`🦶 Steps: ${blob.steps}`,
		`🧬 Genomes:`,
	];
	for (const gen in blob.genomes.genomes) content.push(`&emsp;&ensp; • ${gen}: ${blob.genomes.getValue(gen).toFixed(2)}`)

	content.forEach(v => {
		const li = document.createElement('li');
		li.innerHTML = v;
		stats.appendChild(li);
	})

	stats.style = "margin: 10px; text-align: top; list-style-type: none;"
	//#endregion Stats
	//#region Bottom
	let s = 5;
	const bottom = document.createElement('p');
	bottom.innerText = `Auto closes in ${s--}`
	bottom.style = `text-align: center; margin-bottom: 5px; margin-top: 5px;`;
	//#endregion Bottom

	infoCard.appendChild(title);
	infoCard.appendChild(divider);
	infoCard.appendChild(stats);
	infoCard.appendChild(bottom);

	const sizes = getSize(infoCard);
	if (x + sizes.width > canvas.width - sizes.width) infoCard.style.left = `${x - sizes.width - 20}px`
	if (y + sizes.height > canvas.height - sizes.height) infoCard.style.top = `${y - sizes.height - 20}px`

	document.body.appendChild(infoCard);

	const delInterval = setInterval(() => {
		if (s === 0) clearInterval(delInterval);
		infoCard.children[3].innerText = infoCard.children[3].innerText.replace(/\d/g, s--)
	}, 1000);
	setTimeout(() => { infoCard.remove() }, 5000);
	infoCard.addEventListener('click', () => infoCard.remove());
	console.log(JSON.stringify(blob, 0, 2));
}

function getSize(el) {
	const vis = el.style.visibility || "visible";
	const pos = el.style.position || "static";
	const top = el.style.top || "0px";
	const left = el.style.left || "0px";

	el.style.visibility = 'hidden';
	el.style.position = 'absolute';
	el.style.top = "0px";
	el.style.left = "0px";

	document.body.appendChild(el);
	let result = {
		height: el.clientHeight,
		width: el.clientWidth,
	}
	el.parentNode.removeChild(el);

	el.style.visibility = vis;
	el.style.position = pos;
	el.style.top = top;
	el.style.left = left;
	return result;
}

export {
	createSimulation,
	statsCard
}