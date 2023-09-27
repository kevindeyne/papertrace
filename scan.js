const scanner = new jscanify();
const canvas = document.getElementById("canvas");
const canvasCtx = canvas.getContext("2d");

navigator.mediaDevices.getUserMedia({
  audio: false,
  video: {
    facingMode: { exact: "environment" } //possibly switch between camera modes
  }
}).then((stream) => {

    const video = document.createElement('video');
    video.srcObject = stream;
    video.onloadedmetadata = () => {

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        video.play();

        setInterval(() => {
            // Draw the video frame on the canvas
            canvasCtx.drawImage(video, 0, 0);

            // Highlight the paper and draw it on the same canvas
            const resultCanvas = scanner.highlightPaper(canvas);
            canvasCtx.clearRect(0, 0, canvas.width, canvas.height);  // Clear the canvas
            canvasCtx.drawImage(resultCanvas, 0, 0);  // Draw the highlighted paper
        }, 10);
    };
});
