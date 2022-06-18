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
		"iIDB",
		"iVGA"
	],
	"Burk": [
		"bIDB",
		"bVGA"
	]
};

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
	let filename = "";
	let content = "";
	
	if (canvasElem.tagName == "CANVAS") {
		content = canvasElem.toDataURL('image/png');
		filename = "eyemodtool " + dateString + ".png";
	} else if (canvasElem.tagName == "IMG") {
		content = canvasElem.src;
		filename = "eyemodtool " + dateString + ".jpg";
	}

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

	if (canvasElem.tagName == "CANVAS") {
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
	}

	return pictureDiv;
}

function decodePalmImage(offset, imageWidth, imageHeight, imageFormat) {
	let tempCanvas = document.createElement('canvas');
	tempCanvas.width = imageWidth;
	tempCanvas.height = imageHeight;
	let tempCtx = tempCanvas.getContext('2d');
	let tempImage = tempCtx.createImageData(imageWidth, imageHeight);
	const p = tempImage.data;

	let scale = Math.ceil(640 / imageWidth);

	if (imageFormat == "palm") {
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
	} else if (imageFormat == "YUYV") {
		for (let ty = 0; ty < imageHeight; ty += 1) {
			// each image has 24 slices, this skips to next slice
			if (ty % 10 == 0) { offset += 4 }
			for (let tx = 0; tx < imageWidth; tx += 2) {
				let pixOffset = (tx + ty * (imageWidth)) * 4;
				let y1 = fr.result.charCodeAt(offset + 1) - 16;
				let y2 = fr.result.charCodeAt(offset + 3) - 16;
				let u = fr.result.charCodeAt(offset + 0) - 128;
				let v = fr.result.charCodeAt(offset + 2) - 128;
				offset += 4;
				let r1 = 1.164 * y1             + 1.596 * v;
				let g1 = 1.164 * y1 - 0.392 * u - 0.813 * v;
				let b1 = 1.164 * y1 + 2.017 * u;
				let r2 = 1.164 * y2             + 1.596 * v;
				let g2 = 1.164 * y2 - 0.392 * u - 0.813 * v;
				let b2 = 1.164 * y2 + 2.017 * u;
				p[pixOffset]     = r1;
				p[pixOffset + 1] = g1;
				p[pixOffset + 2] = b1;
				p[pixOffset + 3] = 255;
				p[pixOffset + 4] = r2;
				p[pixOffset + 5] = g2;
				p[pixOffset + 6] = b2;
				p[pixOffset + 7] = 255;
			}
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

function decodeJfifImage(startOffset, headerCur, headerCount) {
	// find entire jfif block
	let magicNumber = getU32LE(fr.result, startOffset + 10);
	if (magicNumber != 1246120262) return; // if it's dumb and it works it's not dumb

	// get all bits of data until we find one that ends in FF D9
	let endOffset = 0;
	let i = headerCur + 1;
	blockOffsets = [startOffset];
	for (i = headerCur + 1; i < headerCount; i++) {
		let endTOCoffset = 0x4e + i * 8;
		endOffset = getU32LE(fr.result, endTOCoffset);
		let checkEnd = getU16LE(fr.result, endOffset - 2);
		blockOffsets = blockOffsets.concat([endOffset]);
		if (checkEnd == 65497) break; // FF D9
	}
	if (i = headerCount) {
		endOffset = fr.result.length;
		blockOffsets = blockOffsets.concat([endOffset]);
	}

	// concatenate skipping data bit headers
	let JFIFbuffer = "";
	for (i = 0; i < blockOffsets.length-1; i++) {
		JFIFbuffer = JFIFbuffer + fr.result.substring(blockOffsets[i]+4, blockOffsets[i+1]);
	}
	
	// make img with blob src
	let JFIFb64 = "data:image/jpeg;base64," + btoa(JFIFbuffer);

	// put img in wrapper
	let newImg = document.createElement("img");
	newImg.src = JFIFb64;
	
	let pictureWrapper = wrapPicture(newImg);
	picturesElem.appendChild(pictureWrapper);
}

function getU16BE(buffer, offset) {
	return buffer.charCodeAt(offset + 1) * 256 + buffer.charCodeAt(offset);
}

function getU16LE(buffer, offset) {
	return buffer.charCodeAt(offset) * 256 + buffer.charCodeAt(offset + 1);
}

function getU32LE(buffer, offset) {
	return buffer.charCodeAt(offset) * 0x1000000 +
	       buffer.charCodeAt(offset + 1) * 0x10000 +
				 buffer.charCodeAt(offset + 2) * 0x100 +
				 buffer.charCodeAt(offset + 3);
}

function handleSaveFile() {
	// clear all pictures currently displayed
	while (picturesElem.firstChild) 
		picturesElem.removeChild(picturesElem.firstChild);

	let typeOffset = 0x3c;
	let type = fr.result.substring(typeOffset, typeOffset+4);
	let creator = fr.result.substring(typeOffset+4, typeOffset+8);

	if (knownCreators.indexOf(creator) < 0 || knownTypes[creator].indexOf(type) < 0) {
		console.log(creator + " " + type);
		alert("file is not a known valid format!");
		return;
	}

	let countOffset = 0x4c;
	let count = getU16LE(fr.result, countOffset);
	let iterCount = count;

	let i = 0;
	while (iterCount > 0) {
		// guessed from hex dump -- possibly skipping information, right now we're interested only in pictures
		let TOCoffset = 0x4e + i * 8;
		let offset = getU32LE(fr.result, TOCoffset);
		
		let imageWidth = 0;
		let imageHeight = 0;
		let imageOffset = 0;
		let imageFormat = "palm"
		if (type == "iIDB") {
			imageWidth = getU16LE(fr.result, offset + 54);
			imageHeight = getU16LE(fr.result, offset + 56);
			imageOffset = offset + 58;
		} else if (type == "bIDB") {
			imageWidth = 160;
			imageHeight = 120;
			imageOffset = offset + 70;
		} else if (type == "iVGA") {
			imageWidth = 320;
			imageHeight = 240;
			imageOffset = offset;
			imageFormat = "YUYV";
			i += 23; // header will have each picture in 24 "chunks"
			iterCount -= 23;
		} else if (type == "bVGA") {
			// strange case, there's just jpeg files in DB, so we gotta blob those
			imageOffset = offset;
		}

		if (type != "bVGA") {
			decodePalmImage(imageOffset, imageWidth, imageHeight, imageFormat);
		} else {
			decodeJfifImage(imageOffset, i, count);
		}
		i++;
		iterCount--;
	}
}

window.addEventListener('load', init);