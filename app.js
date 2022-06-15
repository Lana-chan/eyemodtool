/*
 * ------------------------------------------------------------
 * "THE BEERWARE LICENSE" (Revision 42):
 * maple "mavica" syrup <maple@maple.pet> wrote this code.
 * As long as you retain this notice, you can do whatever you
 * want with this stuff. If we meet someday, and you think this
 * stuff is worth it, you can buy me a beer in return.
 * ------------------------------------------------------------
 */

const savefileElem = document.getElementById('save-file'),
			saveloadElem = document.getElementById('save-load'),
			picturesElem = document.getElementById('pictures');


// known valid types
const knownCreators = [
	"Imod",
	"Burk"
];

const knownTypes = {
	"Imod": [
		"iIDB"
	],
	"Burk": [
		"bIDB"
	]
};

const scale = 5;

const fr = new FileReader();

function init() {
	// register file load triggers
	savefileElem.addEventListener('change', startSaveParse);
	saveloadElem.addEventListener('click', startSaveParse);
}

function startSaveParse() {
	if (savefileElem.value == null || savefileElem.value == "") return;
	
	fr.onload = handleSaveFile;
	fr.readAsBinaryString(savefileElem.files[0]);
}

function download(canvasElem) {
	let now = new Date();
	let dateString = now.getDate() + "-" + (now.getMonth()+1) + "-"+ now.getFullYear() + " " + now.getHours() + " " + now.getMinutes() + " " + now.getSeconds();
	let filename = "gbcamtool " + dateString + ".png";

	let content = canvasElem.toDataURL('image/png');

	var element = document.createElement('a');
	element.setAttribute('href', content);
	element.setAttribute('download', filename);

	element.style.display = 'none';
	document.body.appendChild(element);

	element.click();

	document.body.removeChild(element);
}

function rotateCanvas(oldCanvas, direction) {
	let newCanvas = document.createElement('canvas');
	newCanvas.width = oldCanvas.height;
	newCanvas.height = oldCanvas.width;
	let tempCtx = newCanvas.getContext('2d');

	tempCtx.save()
	tempCtx.translate(newCanvas.width/2, newCanvas.height/2);
	tempCtx.rotate(1.5708 * direction);
	tempCtx.drawImage(oldCanvas, -oldCanvas.width/2, -oldCanvas.height/2);
	tempCtx.restore();

	oldCanvas.width = newCanvas.width;
	oldCanvas.height = newCanvas.height;
	let ctx = oldCanvas.getContext('2d');
	ctx.drawImage(newCanvas, 0, 0);
	newCanvas.remove();
}

function wrapPicture(canvasElem) {
	let pictureDiv = document.createElement('div');
	pictureDiv.setAttribute('class', 'single-picture');
	pictureDiv.appendChild(canvasElem);

	let saveButtonElem = document.createElement('button');
	saveButtonElem.innerHTML = "save!";
	saveButtonElem.addEventListener('click', () => {
		download(canvasElem);
	});
	pictureDiv.appendChild(saveButtonElem);

	let rotateLeftElem = document.createElement('button');
	let rotateRightElem = document.createElement('button');

	rotateLeftElem.innerHTML = "⟲";
	rotateLeftElem.addEventListener('click', () => {
		rotateCanvas(canvasElem, -1);
	});
	pictureDiv.appendChild(rotateLeftElem);

	rotateRightElem.innerHTML = "⟳";
	rotateRightElem.addEventListener('click', () => {
		rotateCanvas(canvasElem, 1);
	});
	pictureDiv.appendChild(rotateRightElem);

	return pictureDiv;
}

function decodePalmImage(offset, imageWidth, imageHeight) {
	console.log(imageWidth);
	console.log(imageHeight);
	let tempCanvas = document.createElement('canvas');
	tempCanvas.width = imageWidth;
	tempCanvas.height = imageHeight;
	let tempCtx = tempCanvas.getContext('2d');
	let tempImage = tempCtx.createImageData(imageWidth, imageHeight);
	const p = tempImage.data;

	for (let ty = 0; ty < imageHeight; ty += 1) {
		for (let tx = 0; tx < imageWidth; tx += 2) {
			let pixOffset = (tx + ty * (imageWidth)) * 4;
			let char = fr.result.charCodeAt(offset++);
			let c1 = char >> 4 & 0b00001111;
			let c2 = char & 0b00001111;
			p[pixOffset]     = 255 - c1 * 16;
			p[pixOffset + 1] = 255 - c1 * 16;
			p[pixOffset + 2] = 255 - c1 * 16;
			p[pixOffset + 3] = 255;
			p[pixOffset + 4] = 255 - c2 * 16;
			p[pixOffset + 5] = 255 - c2 * 16;
			p[pixOffset + 6] = 255 - c2 * 16;
			p[pixOffset + 7] = 255;
		}
	}

	tempCtx.putImageData(tempImage, 0, 0);
	let newCanvas = document.createElement('canvas');
	newCanvas.width = imageWidth * scale;
	newCanvas.height = imageHeight * scale;
	let ctx = newCanvas.getContext('2d');
	ctx.imageSmoothingEnabled = false;
	ctx.drawImage(tempCanvas, 0, 0, imageWidth * scale, imageHeight * scale);
	tempCanvas.remove();
	let pictureWrapper = wrapPicture(newCanvas);
	picturesElem.appendChild(pictureWrapper);
}

function getU16LE(buffer, offset) {
	return buffer.charCodeAt(offset) * 256 + buffer.charCodeAt(offset + 1);
}

function handleSaveFile() {
	// clear all pictures currently displayed
	while (picturesElem.firstChild) 
		picturesElem.removeChild(picturesElem.firstChild);

	let typeOffset = 0x3c;
	let type = fr.result.substring(typeOffset, typeOffset+4);
	let creator = fr.result.substring(typeOffset+4, typeOffset+8);
	console.log(type + " " + creator);

	if (knownCreators.indexOf(creator) < 0 || knownTypes[creator].indexOf(type) < 0) {
		alert("file is not a known valid format!");
		return;
	}

	// count seems strange
	// eyemodule 1 adds second "half" of 320x240 pictures to header, pointing to middle of image buffer
	// not sure if the header notices if those are extra data or not
	// for now we'll decrease count if we find an image that's 320x240
	let countOffset = 0x4c;
	let count = getU16LE(fr.result, countOffset);

	let i = 0;
	while (count > 0) {
		// guessed from hex dump -- possibly skipping information, right now we're interested only in pictures
		let TOCoffset = 0x50 + i * 8;
		let offset = getU16LE(fr.result, TOCoffset);
		console.log(offset);
		
		let imageWidth = 0;
		let imageHeight = 0;
		let imageOffset = 0;
		if (type == "iIDB") {
			imageWidth = getU16LE(fr.result, offset + 54);
			imageHeight = getU16LE(fr.result, offset + 56);
			imageOffset = offset + 58;
			// workaround for header count mentioned above
			if (imageWidth == 320 && imageHeight == 240) { count -= 1; }
			if (imageWidth <= 0 || imageHeight <= 0) { alert("error decoding image header"); }
		} else if (type == "bIDB") {
			imageWidth = 160;
			imageHeight = 120;
			imageOffset = offset + 70;
		} else {
			console.log("dumb dingus");
		}

		// offset starts with picture title and then 4bpp bitmap
		decodePalmImage(imageOffset, imageWidth, imageHeight); // Palm Size = 160 x 120 4bpp
		i++;
		count--;
	}
}

window.addEventListener('load', init);