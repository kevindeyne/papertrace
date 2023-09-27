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
          document.getElementById("scannedPictureExtract").setAttribute("src", resultCanvas.toDataURL("image/jpeg", 1.0));

      }

  });
