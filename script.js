const uploadBox = document.getElementById('uploadBox');
const fileInput = document.getElementById('fileInput');
const uploadedImage = document.getElementById('uploadedImage');
const capContainer = document.getElementById('capContainer');
const cap = document.getElementById('cap');
const downloadBtn = document.getElementById('downloadBtn');
const flipBtn = document.getElementById('flipBtn');

// Upload image
uploadBox.addEventListener('click', () => fileInput.click());

fileInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (event) {
      uploadedImage.src = event.target.result;
      uploadedImage.style.display = 'block';
      uploadBox.style.display = 'none';
    };
    reader.readAsDataURL(file);
  }
});

// Drag
let isDragging = false, dragOffsetX = 0, dragOffsetY = 0;

capContainer.addEventListener('mousedown', (e) => {
  if (!e.target.classList.contains('resize-handle')) {
    isDragging = true;
    dragOffsetX = e.clientX - capContainer.offsetLeft;
    dragOffsetY = e.clientY - capContainer.offsetTop;
    e.preventDefault();
  }
});

document.addEventListener('mousemove', (e) => {
  if (isDragging) {
    capContainer.style.left = `${e.clientX - dragOffsetX}px`;
    capContainer.style.top = `${e.clientY - dragOffsetY}px`;
  }
});

document.addEventListener('mouseup', () => isDragging = false);

// Resize
const handles = document.querySelectorAll('.resize-handle');
let isResizing = false;
let currentHandle = null;
let startX, startY, startWidth, startHeight, startLeft, startTop;

handles.forEach(handle => {
  handle.addEventListener('mousedown', (e) => {
    isResizing = true;
    currentHandle = e.target;
    const rect = capContainer.getBoundingClientRect();
    const parentRect = capContainer.parentElement.getBoundingClientRect();

    startX = e.clientX;
    startY = e.clientY;
    startWidth = rect.width;
    startHeight = rect.height;
    startLeft = rect.left - parentRect.left;
    startTop = rect.top - parentRect.top;
    e.preventDefault();
  });
});

document.addEventListener('mousemove', (e) => {
  if (!isResizing || !currentHandle) return;

  let dx = e.clientX - startX;
  let dy = e.clientY - startY;

  let newWidth = startWidth;
  let newHeight = startHeight;
  let newLeft = startLeft;
  let newTop = startTop;

  if (currentHandle.classList.contains('right')) newWidth += dx;
  if (currentHandle.classList.contains('bottom')) newHeight += dy;
  if (currentHandle.classList.contains('left')) {
    newWidth -= dx;
    newLeft += dx;
  }
  if (currentHandle.classList.contains('top')) {
    newHeight -= dy;
    newTop += dy;
  }
  if (currentHandle.classList.contains('top-left')) {
    newWidth -= dx;
    newLeft += dx;
    newHeight -= dy;
    newTop += dy;
  }
  if (currentHandle.classList.contains('top-right')) {
    newWidth += dx;
    newHeight -= dy;
    newTop += dy;
  }
  if (currentHandle.classList.contains('bottom-left')) {
    newWidth -= dx;
    newLeft += dx;
    newHeight += dy;
  }
  if (currentHandle.classList.contains('bottom-right')) {
    newWidth += dx;
    newHeight += dy;
  }

  capContainer.style.width = `${newWidth}px`;
  capContainer.style.height = `${newHeight}px`;
  capContainer.style.left = `${newLeft}px`;
  capContainer.style.top = `${newTop}px`;
});

document.addEventListener('mouseup', () => {
  isResizing = false;
  currentHandle = null;
});

// Download image
downloadBtn.addEventListener('click', () => {
  html2canvas(document.getElementById('imageContainer')).then(canvas => {
    const link = document.createElement('a');
    link.download = 'plasma_cap_image.png';
    link.href = canvas.toDataURL();
    link.click();
  });
});

// Flip image
let flipped = false;
flipBtn.addEventListener('click', () => {
  flipped = !flipped;
  cap.style.transform = flipped ? 'scaleX(-1)' : 'scaleX(1)';
});
