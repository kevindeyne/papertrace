const scanner = new jscanify();

document
  .getElementById("cameraFileInput")
  .addEventListener("change", function () {
    let imageSrc = window.URL.createObjectURL(this.files[0]);
    document
      .getElementById("pictureFromCamera")
      .setAttribute("src", imageSrc);

      const newImg = document.createElement("img")
      newImg.src = imageSrc

      newImg.onload = function(){
          const paperWidth = newImg.naturalWidth;
          const paperHeight = newImg.naturalHeight;

          const resultCanvas = scanner.extractPaper(newImg, paperWidth, paperHeight);
          const resultUrl = resultCanvas.toDataURL("image/jpeg", 1.0);
          document.getElementById("scannedPictureExtract").setAttribute("src", resultUrl);

          document.getElementById("ocr").innerText = "Processing";

          Tesseract.recognize(
            resultUrl,
            'eng'
          ).then(({ data: { text } }) => {
            console.log(text);
            document.getElementById("ocr").innerText = text;
          })
      }

  });
