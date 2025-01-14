$(document).ready(function () {
    let btnRegistra = $("#btnRegistra");
    let tracciaAudio = $("#tracciaAudio").hide();
    let btnScaricaRegistrazione = $("#btnScaricaRegistrazione").hide();
    let audioChunks = []; // Memorizza i chunk audio registrati
    let audioURL;
    let recognition;
    $("#stopButton").prop("disabled", true);
    $("#btnRegistra").on("click", function () {
        if ($("#btnRegistra").text() === "Registra") {
            $("#btnRegistra").text("Ferma registrazione");
            startRecording();
            $("#outputTrascritto").val(" ");
            $("#inputTrascrivere").val(" ");
            tracciaAudio.hide();
            btnScaricaRegistrazione.hide();
        }
        else {
            $("#btnRegistra").text("Registra");
            stopRecording();

        }
    });

    function startRecording() {
        navigator.mediaDevices.getUserMedia({ audio: true })
            .then(stream => {
                mediaRecorder = new MediaRecorder(stream);

                // Aggiungiamo un evento quando il chunk audio è disponibile
                mediaRecorder.ondataavailable = function (event) {
                    audioChunks.push(event.data);
                };

                mediaRecorder.start();
                $("#btnRegistra").text("Ferma Registrazione");
            })
            .catch(error => {
                console.error("Errore nell'accesso al microfono:", error);
            });
    }

    function stopRecording() {
        if (mediaRecorder && mediaRecorder.state !== 'inactive') {
            mediaRecorder.stop();
            $("#btnRegistra").text("Registra");

            // Quando la registrazione è terminata, creiamo un blob audio
            mediaRecorder.onstop = function () {
                const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
                audioURL = URL.createObjectURL(audioBlob);
                tracciaAudio.prop("src", audioURL);
                tracciaAudio.show();
                btnScaricaRegistrazione.show();
                console.log("Blob audio:", audioBlob);
                console.log("URL audio:", audioURL);
                audioChunks = [];
                sendAudioToTranscriptionAPI(audioBlob);
            };
        }
    }

    $("#btnScaricaRegistrazione").on("click", function () {
        if (audioURL) {
            const downloadLink = document.createElement("a");
            downloadLink.href = audioURL;
            downloadLink.download = "registrazione.wav"; 
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
        } else {
            alert("Nessuna registrazione disponibile per il download!");
        }
    });

    async function sendAudioToTranscriptionAPI(audioBlob) {
        let key;
        fetch('config.json')
            .then(response => response.json())
            .then(async (config) => {
                key = config.apiKey;
                const url = 'https://api.openai.com/v1/audio/transcriptions';

                const formData = new FormData();
                formData.append('file', audioBlob, 'audio.wav');
                formData.append('model', 'whisper-1');
                formData.append('language', 'it');
                formData.append('options', JSON.stringify({ no_corrections: true }));

                try {
                    console.log('TRASCRIZIONE DISATTIVATA');
                    // const response = await fetch(url, {
                    //     method: 'POST',
                    //     headers: {
                    //         'Authorization': `Bearer ${key}`
                    //     },
                    //     body: formData
                    // });

                    // if (!response.ok) {
                    //     throw new Error(`Errore di rete: ${response.status}`);
                    // }

                    // const data = await response.json();
                    // console.log('Trascrizione:', data);
                    // if(!data.text.includes("Amara.org") && !data.text.includes("a cura di QTSS")){
                    //     $("#inputTrascrivere").val(data.text);
                    // }else{
                    //     console.log(data.text);
                    //     $("#inputTrascrivere").val("Non è possibile trascrivere questo audio");
                    // }
                } catch (error) {
                    console.error('Errore durante la trascrizione:', error);
                }
            })
            .catch(error => {
                console.error('Errore nel caricare la configurazione:', error);
            });

    }


});
