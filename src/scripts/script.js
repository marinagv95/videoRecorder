var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var _this = this;
var startSharing = document.getElementById("startSharing");
var videoScreen = document.getElementById("screenVideoShare");
var mediaRecorder;
var recordedChunks = [];
if (startSharing && videoScreen) {
    startSharing.addEventListener("click", function () { return __awaiter(_this, void 0, void 0, function () {
        var screenStream, audioStream, combinedStreams, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, navigator.mediaDevices.getDisplayMedia({
                            video: {
                                cursor: "always",
                            },
                            audio: false,
                        })];
                case 1:
                    screenStream = _a.sent();
                    return [4 /*yield*/, navigator.mediaDevices.getUserMedia({
                            audio: true,
                        })];
                case 2:
                    audioStream = _a.sent();
                    combinedStreams = new MediaStream(__spreadArray(__spreadArray([], screenStream.getVideoTracks(), true), audioStream.getAudioTracks(), true));
                    videoScreen.srcObject = combinedStreams;
                    videoScreen.onloadedmetadata = function () {
                        videoScreen.play();
                    };
                    combinedStreams.getVideoTracks()[0].onended = function () {
                        stopSharing_1();
                    };
                    startRecording_1(combinedStreams);
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _a.sent();
                    console.log(error_1);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); });
    var startRecording_1 = function (mediaStream) {
        // Limpar os chunks gravados da gravação anterior
        recordedChunks = [];
        mediaRecorder = new MediaRecorder(mediaStream, { mimeType: "video/webm" });
        mediaRecorder.ondataavailable = function (event) {
            if (event.data.size > 0) {
                recordedChunks.push(event.data);
            }
        };
        mediaRecorder.start();
        mediaRecorder.onstop = function () {
            downloadVideo_1();
        };
    };
    var stopSharing_1 = function () {
        if (videoScreen.srcObject) {
            videoScreen.srcObject
                .getTracks()
                .forEach(function (track) { return track.stop(); });
            videoScreen.srcObject = null;
        }
        if (mediaRecorder) {
            mediaRecorder.stop();
        }
    };
    var downloadVideo_1 = function () {
        var blob = new Blob(recordedChunks, { type: "video/webm" });
        var url = URL.createObjectURL(blob);
        var a = document.createElement("a");
        document.body.appendChild(a);
        a.style.display = "none";
        a.href = url;
        a.download = "recorded-navigator.mp4";
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
    };
}
