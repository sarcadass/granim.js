'use strict'

module.exports = {
	basic: function(options) {
		var direction = options.direction || 'diagonal';
		var template = [
			"<code class='language-js'>var granimInstance = new Granim({"
			, "    element: '#canvas-basic',"
			, "    direction: '" + direction + "',"
			, "    isPausedWhenNotInView: true,"
			, "    states : {"
			, "        \"default-state\": {"
			, "            gradients: ["
			, "                ['#AA076B', '#61045F'],"
			, "                ['#02AAB0', '#00CDAC'],"
			, "                ['#DA22FF', '#9733EE']"
			, "            ]"
			, "        }"
			, "    }"
			, "});</code>"];
		var customDirectionTemplate = [
			"    customDirection: {"
			, "        x0: '40%',"
			, "        y0: '10px',"
			, "        x1: '60%',"
			, "        y1: '50%',"
			, "    },"
		].join('\n');
	
		if (direction === 'custom') {
			template.splice(3, 0, customDirectionTemplate)
		}
	
		return template.join('\n');
	},

	blendingMode: function(options) {
		return [
			"<code class='language-js'>var granimInstance = new Granim({"
			, "    element: '#canvas-image-blending',"
			, "    direction: 'top-bottom',"
			, "    isPausedWhenNotInView: true,"
			, "    image : {"
			, "        source: '../assets/img/bg-forest.jpg',"
			, "        blendingMode: '" + options.blendingMode + "',"
			, "    },"
			, "    states : {"
			, "        \"default-state\": {"
			, "            gradients: ["
			, "                ['#29323c', '#485563'],"
			, "                ['#FF6B6B', '#556270'],"
			, "                ['#80d3fe', '#7ea0c4'],"
			, "                ['#f0ab51', '#eceba3']"
			, "            ],"
			, "            transitionSpeed: 7000"
			, "        }"
			, "    }"
			, "});</code>"].join('\n');
	}
}
