function getMousePos(canvas, e)  {
	let rect = canvas.getBoundingClientRect();
	return {
		x: e.clientX - rect.left,
		y: e.clientY - rect.top
	};
}


$(document).ready(function () {
    const WIDTH = 8, HEIGHT = 8;

    let canvas = document.getElementById('canvas');
    let ctx = canvas.getContext('2d');
    ctx.fillStyle = 'orange';

    let ws = null;
    try {
        let wsScheme = window.location.protocol == 'https:'? 'wss:': 'ws:';
        ws = new WebSocket(wsScheme + '//' + window.location.hostname + ':' + window.location.port);
    }
    catch (e) {
        alert('ERROR: ' + e.message);
    }
    let connected = false;

    if (ws) {
        ws.onopen = function (e) {
            connected = true;
        }
        ws.onmessage = function (e) {
            data = JSON.parse(e.data);
            ctx.fillRect(data.x, data.y, WIDTH, HEIGHT);
        }
        ws.onclose = function (e) {
            connected = false;
        }
    }

    $('#canvas').mousemove(function (e) {
        if (connected) {
            let pos = getMousePos(canvas, e);
            ctx.fillRect(pos.x, pos.y, WIDTH, HEIGHT);
            ws.send(JSON.stringify({
                x: pos.x,
                y: pos.y
            }));

        }
    });
});
