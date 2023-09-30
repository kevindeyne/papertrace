const scanner = new jscanify();

const loader = document.getElementById("loader");



document
  .getElementById("cameraFileInput")
  .addEventListener("change", function () {
	initProgress = 0;
	updateProgressBar("Processing image - Loading image");
    let imageSrc = window.URL.createObjectURL(this.files[0]);
    const fileName = this.files[0].name;

    const newImg = document.createElement("img")
    newImg.src = imageSrc

    newImg.onload = function(){
      const resultCanvas = scanner.extractPaper(newImg, newImg.naturalWidth, newImg.naturalHeight);
      const resultUrl = resultCanvas.toDataURL("image/png", 1.0);
	  
	  updateProgressBar("Processing image - applying OCR");
      Tesseract.recognize(
        resultUrl,
        'eng'
      ).then(({ data: { text } }) => {
		updateProgressBar("Processing image - adding to IndexedDB");
        addDocumentToDB(fileName, resultUrl, text);
        hideLoader();
      });
    }
    });

function addDocumentToDB(fileName, imgUrl, text) {
  const added = db.add(docs_table_name, {
	"name": fileName,
	"img": imgUrl,
	"ocr": text,
	"added": new Date()
  });
  console.log(added);
  load_all();
}