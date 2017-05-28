import { MuseClient, EEGReading } from './../lib/muse';

(window as any).connect = async () => {
    let canvases = Array.from(document.querySelectorAll('canvas'));
    let canvasCtx = canvases.map(canvas => canvas.getContext('2d'));

    function plot(reading: EEGReading) {
        const canvas = canvases[reading.electrode];
        const context = canvasCtx[reading.electrode];
        if (!context) {
            return;
        }
        const width = canvas.width / 12.0;
        const height = canvas.height / 2.0;
        context.fillStyle = 'green';
        context.clearRect(0, 0, canvas.width, canvas.height);

        for (let i = 0; i < reading.samples.length; i++) {
            const sample = reading.samples[i] / 15.;
            if (sample > 0) {
                context.fillRect(i * 25, height - sample, width, sample);
            } else {
                context.fillRect(i * 25, height, width, -sample);
            }
        }
    }

    let client = new MuseClient();
    try {
        await client.connect();
        console.log('Connected!');
        await client.start();
        client.eegReadings.subscribe(reading => {
            plot(reading);
        });
    } catch (err) {
        console.error('Connection failed', err);
    }
};
