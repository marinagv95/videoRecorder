const startSharing = document.getElementById(
  "startSharing"
) as HTMLButtonElement | null;
const videoScreen = document.getElementById(
  "screenVideoShare"
) as HTMLVideoElement | null;

let mediaRecorder: MediaRecorder | null;
let recordedChunks: Blob[] = [];

if (startSharing && videoScreen) {
  startSharing.addEventListener("click", async () => {
    try {
      const screenStream = await (
        navigator.mediaDevices as any
      ).getDisplayMedia({
        video: {
          cursor: "always",
        },
        audio: false,
      });

      const audioStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });

      const combinedStreams = new MediaStream([
        ...screenStream.getVideoTracks(),
        ...audioStream.getAudioTracks(),
      ]);

      videoScreen.srcObject = combinedStreams;

      videoScreen.onloadedmetadata = () => {
        videoScreen.play();
      };

      combinedStreams.getVideoTracks()[0].onended = () => {
        stopSharing();
      };

      startRecording(combinedStreams);
    } catch (error) {
      console.log(error);
    }
  });

  const startRecording = (mediaStream: MediaStream) => {
    recordedChunks = [];

    mediaRecorder = new MediaRecorder(mediaStream, { mimeType: "video/webm" });

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        recordedChunks.push(event.data);
      }
    };

    mediaRecorder.start();

    mediaRecorder.onstop = () => {
      downloadVideo();
    };
  };

  const stopSharing = () => {
    if (videoScreen.srcObject) {
      (videoScreen.srcObject as MediaStream)
        .getTracks()
        .forEach((track) => track.stop());
      videoScreen.srcObject = null;
    }
    if (mediaRecorder) {
      mediaRecorder.stop();
    }
  };

  const downloadVideo = () => {
    const blob = new Blob(recordedChunks, { type: "video/webm" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    document.body.appendChild(a);
    a.style.display = "none";
    a.href = url;
    a.download = "recorded-navigator.mp4";
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };
}
