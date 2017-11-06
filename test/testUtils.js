function setCanvas(canvasId) {
	var canvas;
	if (canvasId && document.querySelector(canvasId)) {
		return;

	} else if (document.querySelector('#granim-canvas')) {
		return;
	}

	canvas = document.createElement('canvas');
	canvas.setAttribute('id', canvasId || 'granim-canvas');
	canvas.setAttribute('style', 'position:absolute; width: 100%; height: 300px; left: 0; right: 0;');
	document.body.appendChild(canvas);
	return canvas;
}

function unsetCanvas(canvasId) {
	var canvas = document.querySelector('#' + (canvasId || 'granim-canvas'));
	if (canvas) canvas.remove();
}

function compareImages(img1,img2){
	if(img1.data.length != img2.data.length)
		return false;
	for(var i = 0; i < img1.data.length; ++i){
		if(img1.data[i] != img2.data[i])
			return false;
	}
	return true;
}
