<div class="w-full">
  <main class="min-h-screen flex flex-col items-center justify-center px-4">
    <canvas id="halftoneCanvas" class="max-w-full h-auto"></canvas>
    {#key index}
	    <h1 class="text-[var(--color-blue)] mondwest text-center -mt-8" transition:slide>{greetings[index]}</h1>
    {/key}
  </main>
</div>

<script>
  import { onMount, onDestroy } from 'svelte';
	import { slide } from 'svelte/transition';
	
	let greetings = ['Loading...', 'Please Wait...'];
	let index = 0;
	let roller;
	
	onMount(() => {
		roller = setInterval(() => {
			if (index === greetings.length - 1) index = 0;
			else index++;
		}, 1250);
	});
	
	onDestroy(() => {
		clearInterval(roller);
	});
  const defaults = {
    gridSize: 3,
    brightness: 20,
    contrast: 0,
    gamma: 1.0,
    smoothing: 0,
    ditherType: "None",
    dotColor: '#1900FF',
    backgroundColor: '#FFFFFF',   

    multicolor: false,
  };

  let halftoneCanvas;
  let videoElement = null;
  let isVideo = false;
  let animationFrameId;
  let cellValues;

  function setupCanvasDimensions(width, height) {
    const minHeight = 100;
    let newWidth = width;
    let newHeight = height;

    if (height < minHeight) {
      const scaleFactor = minHeight / height;
      newHeight = minHeight;
      newWidth = Math.round(width * scaleFactor);
    }

    if (!halftoneCanvas) return;
    halftoneCanvas.width = newWidth;
    halftoneCanvas.height = newHeight;
  }

  function processFrame() {
    if (!halftoneCanvas || !videoElement || videoElement.readyState < 2) return;
    generateHalftone(halftoneCanvas, 1);
  }

  function processVideoFrame() {
    if (!isVideo) return;

    processFrame();
    animationFrameId = requestAnimationFrame(processVideoFrame);
  }

  function generateHalftone(targetCanvas, scaleFactor, isExport = false) {
    if (!halftoneCanvas) return;

    const previewWidth = halftoneCanvas.width;
    const previewHeight = halftoneCanvas.height;
    const targetWidth = isExport ? Math.max(previewWidth * scaleFactor, 1920) : previewWidth * scaleFactor;
    const targetHeight = isExport ? Math.max(previewHeight * scaleFactor, 1080) : previewHeight * scaleFactor;

    targetCanvas.width = targetWidth;
    targetCanvas.height = targetHeight;

    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = targetWidth;
    tempCanvas.height = targetHeight;
    const tempCtx = tempCanvas.getContext('2d');

    if (isVideo && videoElement) {
      tempCtx.drawImage(videoElement, 0, 0, targetWidth, targetHeight);
    }

    const imgData = tempCtx.getImageData(0, 0, targetWidth, targetHeight);
    const data = imgData.data;

    const brightnessAdj = defaults.brightness;
    const contrastAdj = defaults.contrast;
    const gammaValNum = defaults.gamma;
    const contrastFactor = (259 * (contrastAdj + 255)) / (255 * (259 - contrastAdj));

    const grayData = new Float32Array(targetWidth * targetHeight);
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i], g = data[i+1], b = data[i+2];
      let gray = 0.299 * r + 0.587 * g + 0.114 * b;
      gray = contrastFactor * (gray - 128) + 128 + brightnessAdj;
      gray = Math.max(0, Math.min(255, gray));
      gray = 255 * Math.pow(gray / 255, 1 / gammaValNum);
      grayData[i / 4] = gray;
    }

    const grid = defaults.gridSize * scaleFactor;
    const numCols = Math.ceil(targetWidth / grid);
    const numRows = Math.ceil(targetHeight / grid);
    cellValues = new Float32Array(numRows * numCols);

    for (let row = 0; row < numRows; row++) {
      for (let col = 0; col < numCols; col++) {
        let sum = 0, count = 0;
        const startY = row * grid;
        const startX = col * grid;
        const endY = Math.min(startY + grid, targetHeight);
        const endX = Math.min(startX + grid, targetWidth);
        for (let y = startY; y < endY; y++) {
          for (let x = startX; x < endX; x++) {
            sum += grayData[y * targetWidth + x];
            count++;
          }
        }
        cellValues[row * numCols + col] = sum / count;
      }
    }

    const ctx = targetCanvas.getContext('2d');
    ctx.fillStyle = defaults.backgroundColor;
    ctx.fillRect(0, 0, targetWidth, targetHeight);

    for (let row = 0; row < numRows; row++) {
      for (let col = 0; col < numCols; col++) {
        const brightnessValue = cellValues[row * numCols + col];
        const norm = brightnessValue / 255;
        const maxRadius = grid / 2;
        const radius = maxRadius * (1 - norm);
        if (radius > 0.5) {
          ctx.beginPath();
          const centerX = col * grid + grid / 2;
          const centerY = row * grid + grid / 2;
          ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
          ctx.fillStyle = defaults.dotColor;
          ctx.fill();
        }
      }
    }
  }

  onMount(() => {
    halftoneCanvas = document.getElementById('halftoneCanvas');

    const videoURL = "https://i.imgur.com/5PrJCc2.mp4";
    isVideo = true;
    videoElement = document.createElement('video');
    videoElement.crossOrigin = "anonymous";
    videoElement.playsInline = true;
    videoElement.setAttribute("webkit-playsinline", "true");
    videoElement.src = videoURL;
    videoElement.autoplay = true;
    videoElement.loop = true;
    videoElement.muted = true;

    function startAnimationIfReady() {
      if (!videoElement || videoElement.readyState < 2) return;
      setupCanvasDimensions(videoElement.videoWidth, videoElement.videoHeight);
      videoElement.play();
      requestAnimationFrame(processVideoFrame);

      videoElement.removeEventListener('loadeddata', startAnimationIfReady);
      videoElement.removeEventListener('canplay', startAnimationIfReady);
      videoElement.removeEventListener('canplaythrough', startAnimationIfReady);
      videoElement.removeEventListener('timeupdate', startAnimationIfReady);
    }

    videoElement.addEventListener('loadeddata', startAnimationIfReady);
    videoElement.addEventListener('canplay', startAnimationIfReady);
    videoElement.addEventListener('canplaythrough', startAnimationIfReady);
    videoElement.addEventListener('timeupdate', startAnimationIfReady);
    videoElement.addEventListener('error', (e) => {
      console.error("Error loading default video:", e);
    });

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      if (videoElement) {
        videoElement.pause();
      }
    };
  });
</script>



