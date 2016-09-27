function setCanvas(canvasId) {
	var canvas;
	if (canvasId && document.querySelector(canvasId)) {
		return;

	} else if (document.querySelector('#granim-canvas')) {
		return;
	}

	canvas = document.createElement('canvas');
	canvas.setAttribute('id', canvasId || 'granim-canvas');
	canvas.setAttribute('style', 'position:absolute; width: 100%; height: 150px; left: 0; right: 0;');
	document.body.appendChild(canvas);
}

function unsetCanvas(canvasId) {
	var canvas = document.querySelector('#' + (canvasId || 'granim-canvas'));
	if (canvas) canvas.remove();
}
