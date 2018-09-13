var socket;
var _y_offset = 10;

function setup() {
  createCanvas(displayWidth, displayHeight);
  background(0);
  fullscreen(true);

  socket = io.connect('http://localhost:3000');

  // anonymous callback for socket event 'mouse'
  socket.on('mouse', (data) => {
    fill(0,0,255);
    noStroke();
    ellipse(data.x, data.y, 20, 20);
  });

  socket.on('join', (data) => {
    fill(255);
    textSize(10);
    text(data, 10, _y_offset);
    _y_offset += 10;
  })

}

function draw() {
  // Nothing
}

function mouseDragged() {
  // Draw some white circles
  fill(255);
  noStroke();
  ellipse(mouseX, mouseY, 20, 20);
  // Send the mouse coordinates
  socket.emit('mouse', {x: mouseX, y: mouseY});
}
