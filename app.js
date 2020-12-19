/*
 * ------------------------------------------------------------
 * "THE BEERWARE LICENSE" (Revision 42):
 * maple "mavica" syrup <maple@maple.pet> wrote this code.
 * As long as you retain this notice, you can do whatever you
 * want with this stuff. If we meet someday, and you think this
 * stuff is worth it, you can buy me a beer in return.
 * ------------------------------------------------------------
 */

// 4-color GB palette must be dark to light
const palettes = [
  // AYY4 - https://lospec.com/palette-list/ayy4
  [
		"'AYY4' by Polyducks",
    [0, 48, 59],
    [255, 119, 119],
    [255, 206, 150],
    [241, 242, 218]
	],
	// SpaceHaze - https://lospec.com/palette-list/spacehaze
	[
		"'SpaceHaze' by WildLeoKnight",
		[11, 6, 48],
		[107, 31, 177],
		[204, 52, 149],
		[248, 227, 196]
	],
  // CRTGB - https://lospec.com/palette-list/crtgb
  [
		"'CRTGB' by Sam Keddy",
    [6, 6, 1],
    [11, 62, 8],
    [72, 154, 13],
    [218, 242, 34]
  ],
  // Amber CRTGB - https://lospec.com/palette-list/amber-crtgb
  [
		"'Amber CRTGB' by Sam Keddy",
    [13, 4, 5],
    [94, 18, 16],
    [211, 86, 0],
    [254, 208, 24]
  ],
  // Kirby (SGB) - https://lospec.com/palette-list/kirby-sgb
  [
		"Kirby's Dream Land (Super Game Boy)",
    [44, 44, 150],
    [119, 51, 231],
    [231, 134, 134],
    [247, 190, 247]
  ],
  // CherryMelon - https://lospec.com/palette-list/cherrymelon
  [
		"'CherryMelon' by WildLeoKnight",
    [1, 40, 36],
    [38, 89, 53],
    [255, 77, 109],
    [252, 222, 234]
  ],
  // Pumpkin GB - https://lospec.com/palette-list/pumpkin-gb
  [
		"'Pumpkin GB' by Isa",
    [20, 43, 35],
    [25, 105, 44],
    [244, 110, 22],
    [247, 219, 126]
  ],
  // Purpledawn - https://lospec.com/palette-list/purpledawn
  [
		"'Purpledawn' by WildLeoKnight",
    [0, 27, 46],
    [45, 117, 126],
    [154, 123, 188],
    [238, 253, 237]
  ],
  // Royal4 - https://lospec.com/palette-list/royal4
  [
		"'Royal4' by daniel",
    [82, 18, 150],
    [138, 31, 172],
    [212, 134, 74],
    [235, 219, 94]
  ],
  // Grand Dad 4 - https://lospec.com/palette-list/grand-dad-4
  [
		"'Grand Dad 4' by Starlane",
    [76, 28, 45],
    [210, 60, 78],
    [95, 177, 245],
    [234, 245, 250]
  ],
  // Mural GB - https://lospec.com/palette-list/mural-gb
  [
		"'Mural GB' by Michael Connor",
    [10, 22, 78],
    [162, 81, 48],
    [206, 173, 107],
    [250, 253, 255]
  ],
  // Ocean GB - https://lospec.com/palette-list/ocean-gb
  [
		"'Ocean GB' by Isa",
    [28, 21, 48],
    [42, 48, 139],
    [54, 125, 1216],
    [141, 226, 246]
	],
	// Alleyway - ISS
	[
		"'Alleyway' from Interstellar Selfie Station",
		[66, 66, 66],
		[123, 123, 206],
		[255, 107, 255],
		[255, 214, 0]
	],
	// Pocket - ISS
	[
		"'Pocket' from Interstellar Selfie Station",
		[108, 108, 78],
		[142, 139, 97],
		[195, 196, 165],
		[227, 230, 201]
	],
  // Kadabura4 - https://lospec.com/palette-list/kadabura4
  [
		"'Kadabura4' by PureAsbestos",
    [0, 0, 0],
    [87, 87, 87],
    [219, 0, 12],
    [255, 255, 255]
  ],
  // Virtual - ISS
  [
		"'Virtual' from International Selfie Station",
    [2, 0, 0],
    [65, 0, 0],
    [127, 0, 0],
    [255, 0, 0]
  ],
  // Love! Love! - ISS
  [
		"'Love! Love!' from Interstellar Selfie Station",
    [176, 16, 48],
    [255, 96, 176],
    [255, 184, 232],
    [255, 255, 255]
  ],
  // Metroid II (SGB) - https://lospec.com/palette-list/metroid-ii-sgb
  [
		"Metroid II: Return Of Samus (Super Game Boy)",
    [44, 23, 0],
    [4, 126, 96],
    [182, 37, 88],
    [174, 223, 30]
  ],
  // Micro 86 - https://lospec.com/palette-list/micro-86
  [
		"'Micro 86' by RingFire Miko",
    [38, 0, 14],
    [255, 0, 0],
    [255, 123, 48],
    [255, 217, 178]
  ],
  // Vivid 2Bit Scream - https://lospec.com/palette-list/vivid-2bit-scream
  [
		"'Vivid 2Bit Scream' by Polyducks",
    [86, 29, 23],
    [92, 79, 163],
    [116, 175, 52],
    [202, 245, 50]
	],
	// Pastel GBC/SGB - submitted by synth___ruiner
	[ 
		"'Pastel GBC' by synth___ruiner",
		[4,2,4],
		[156,146,244],
		[236,138,140],
		[252,250,172]
	],
	// trans flag - by mavica
	[
		"'trans flag' by mavica",
		[32, 32, 32],
		[91, 207, 250],
		[245, 171, 185],
		[255, 255, 255]
	],
	// grayscale - by mavica
	[
		"'grayscale' by mavica",
		[40, 40, 40],
		[104, 104, 104],
		[168, 168, 168],
		[252, 252, 252]
	],
	// Scold 2 bit - https://lospec.com/palette-list/scold-2-bit
	[
		"'Scold 2-bit' by Red Penguin",
		[16, 28, 86],
		[206, 0, 148],
		[15, 183, 0],
		[211,211,211]
	],
	// strawberry parfait - by mavica
	[
		"'strawberry parfait' by mavica",
		[31, 19, 0],
		[216, 32, 46],
		[247, 80, 215],
		[255, 231, 204]
	],
	// bric-a-brac - by mavica
	[
		"'bric-a-brac' by mavica",
		[12, 39, 56],
		[237, 79, 54],
		[248, 150, 23],
		[184, 211, 218]
	]
];

const savefileElem = document.getElementById('save-file'),
			dropdownElem = document.getElementById('palettes'),
			saveloadElem = document.getElementById('save-load'),
			deletedElem = document.getElementById('show-deleted'),
			picturesElem = document.getElementById('pictures');

const scale = 5;

const fr = new FileReader();

function init() {
	// fill palette dropdown
	let index = 0;
	palettes.forEach(element => {
		let newOption = document.createElement('option');
		newOption.setAttribute('value', index);
		let label = document.createTextNode(element[0]);
		newOption.appendChild(label);
		dropdownElem.appendChild(newOption);
		index++;
	});

	// register file load triggers
	savefileElem.addEventListener('change', startSaveParse);
	deletedElem.addEventListener('change', startSaveParse);
	dropdownElem.addEventListener('change', startSaveParse);
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

function decodeImage(offset) {
	let currentPalette = palettes[dropdownElem.value];

	let tempCanvas = document.createElement('canvas');
	tempCanvas.width = 128;
	tempCanvas.height = 112;
	let tempCtx = tempCanvas.getContext('2d');
	let tempImage = tempCtx.createImageData(128, 112);
	const p = tempImage.data;

	for (let ty = 0; ty < 112; ty += 8) {
		for (let tx = 0; tx < 128; tx += 8) {
			for (let y = 0; y < 8; y++) {
				let b1 = fr.result.charCodeAt(offset++);
				let b2 = fr.result.charCodeAt(offset++);
				for (let x = 0; x < 8; x++) {
					let c = 4 - (((b1 >> (7-x)) & 1) | ((b2 >> (7-x)) & 1) << 1);
					let poffset = ((tx + x) + ((ty+y)*128)) * 4
					p[poffset] = currentPalette[c][0];
					p[poffset+1] = currentPalette[c][1];
					p[poffset+2] = currentPalette[c][2];
					p[poffset+3] = 255;
				}
			}
		}
	}

	tempCtx.putImageData(tempImage, 0, 0);
	let newCanvas = document.createElement('canvas');
	newCanvas.width = 128 * scale;
	newCanvas.height = 112 * scale;
	let ctx = newCanvas.getContext('2d');
	ctx.imageSmoothingEnabled = false;
	ctx.drawImage(tempCanvas, 0, 0, 128 * scale, 112 * scale);
	tempCanvas.remove();
	let pictureWrapper = wrapPicture(newCanvas);
	picturesElem.appendChild(pictureWrapper);
}

function handleSaveFile() {
	let showDeleted = deletedElem.checked;

	// clear all pictures currently displayed
	while (picturesElem.firstChild) 
		picturesElem.removeChild(picturesElem.firstChild);

	for (let i = 0; i < 30; i++) {
		let TOCoffset = 0x11b2 + i;
		let offset = 0x2000 + i * 0x1000;
		
		// find deleted spaces and skip them
		if (!showDeleted && fr.result.charCodeAt(TOCoffset) == 0xff) continue;

		// unused slots start with 0x00 in photo info block -- unlikely unless someone wiped their gbcamera
		if (fr.result.charCodeAt(offset + 0x0f00) == 0x00) continue;

		decodeImage(offset);
	}
}

window.addEventListener('load', init);