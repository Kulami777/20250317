let tentacles = [];
let bubbles = [];
let numTentacles = 50; // 水草數量
let tentacleLength = 100; // 增加水草長度
let noiseOffset = 0.01; // 降低變化速率，讓水草擺動更平滑

function setup() {
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent('animation-canvas'); // 將畫布放入指定的 div
  generateTentacles(); // 在初始化時生成水草
}

function draw() {
  clear(); // 清除畫布，保持透明背景
  for (let tentacle of tentacles) {
    tentacle.update();
    tentacle.display();
  }
  generateBubbles(); // 生成泡泡
  for (let bubble of bubbles) {
    bubble.update();
    bubble.display();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight); // 調整畫布大小
  generateTentacles(); // 當視窗改變時重新生成水草
}

function generateTentacles() {
  tentacles = []; // 清空舊的水草
  numTentacles = int(map(windowWidth, 0, 1920, 30, 70)); // 根據寬度調整水草數量
  tentacleLength = int(map(windowHeight, 0, 1080, 20, 30)); // 將水草長度範圍增加
  for (let i = 0; i < numTentacles; i++) {
    tentacles.push(new Tentacle(random(width), height, tentacleLength));
  }
}

function generateBubbles() {
  if (frameCount % 10 === 0) { // 每隔一段時間生成一個泡泡
    bubbles.push(new Bubble(random(width), height));
  }
  // 移除超出畫布的泡泡
  bubbles = bubbles.filter(bubble => bubble.y > -bubble.size);
}

class Tentacle {
  constructor(x, y, length) {
    this.x = x;
    this.y = y;
    this.length = length;

    // 隨機生成更豐富的綠色系顏色
    let r = random(50, 100); // 紅色通道較低，避免過於鮮豔
    let g = random(150, 255); // 綠色通道較高，強調綠色
    let b = random(50, 100); // 藍色通道較低，保持水草自然色調
    let a = random(150, 200); // 隨機透明度，讓水草層疊時更自然
    this.color = color(r, g, b, a);

    this.noiseOffset = random(1000);
    this.points = [];
    for (let i = 0; i < length; i++) {
      this.points.push(createVector(x, y - i * 10));
    }
  }

  update() {
    for (let i = 1; i < this.points.length; i++) {
      let point = this.points[i];
      let swayFactor = map(i, 1, this.points.length - 1, 0.1, 2); // 調整擺動幅度
      let angle = sin(frameCount * 0.002 + this.noiseOffset + i * 0.05) * swayFactor * 2; // 增加擺動幅度
      let twist = cos(frameCount * 0.0015 + this.noiseOffset + i * 0.03) * (swayFactor * 1); // 增加擺動幅度
      point.x = this.points[i - 1].x + angle + twist;
    }
  }

  display() {
    noFill();
    stroke(this.color);
    strokeWeight(random(10, 20)); // 水草的線條粗細隨機，讓它們更自然
    beginShape();
    for (let point of this.points) {
      curveVertex(point.x, point.y);
    }
    endShape();
  }
}

class Bubble {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = random(10, 30); // 泡泡大小隨機
    this.speed = random(1, 3); // 泡泡上升速度隨機
  }

  update() {
    this.y -= this.speed; // 泡泡上升
  }

  display() {
    noFill();
    stroke(255, 150); // 白色泡泡，帶有透明度
    strokeWeight(2);
    ellipse(this.x, this.y, this.size);
  }
}
