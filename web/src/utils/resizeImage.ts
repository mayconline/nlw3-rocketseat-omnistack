export const resizeImage = async (file: File) => {
  let reader = new FileReader();

  return new Promise((resolve, reject) => {
    reader.readAsDataURL(file);
    reader.onload = () => {
      let img: any = new Image();
      img.src = reader.result;

      img.onload = function () {
        let resizedDataUrl = transformImageBase64(img);
        resolve(transformImageBlob(resizedDataUrl));
      };
    };
    reader.onerror = error => {
      reject(error);
    };
  });
};

const transformImageBase64 = (img: HTMLImageElement) => {
  const canvas = document.createElement('canvas');

  let width = img.width;
  let height = img.height;
  const maxHeight = 400;
  const maxWidth = 400;

  if (width > height) {
    if (width > maxWidth) {
      height = Math.round((height *= maxWidth / width));
      width = maxWidth;
    }
  } else {
    if (height > maxHeight) {
      width = Math.round((width *= maxHeight / height));
      height = maxHeight;
    }
  }

  canvas.width = width;
  canvas.height = height;

  const ctx: CanvasRenderingContext2D | null = canvas.getContext('2d');
  ctx?.drawImage(img, 0, 0, width, height);

  return canvas.toDataURL('image/jpeg', 0.8);
};

const transformImageBlob = (base64: string) => {
  let contentType = 'image/jpeg';
  let sliceSize = 512;

  const byteCharacters = atob(
    base64.toString().replace(/^data:image\/(png|jpeg|jpg);base64,/, ''),
  );
  let byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    const slice = byteCharacters.slice(offset, offset + sliceSize);

    let byteNumbers = new Array(slice.length);
    for (var i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    let byteArray = new Uint8Array(byteNumbers);

    byteArrays.push(byteArray);
  }

  const blob = new Blob(byteArrays, { type: contentType });
  return blob;
};
