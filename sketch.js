var streams = [];
var fadeInterval = 1.6;
var symbolSize = 40;

function setup() {
  createCanvas(
    window.innerWidth,
    window.innerHeight
  );
  background(0);
  frameRate(15);

  var x = 0;
  for (var i = 0; i <= width / symbolSize; i++) {
    var stream = new Stream();
    stream.generateSymbols(x, window.innerHeight);
    streams.push(stream);
    x += symbolSize
  }

  textFont('Consolas');
  textSize(symbolSize);
}

function draw() {
  background(0, 150);
  streams.forEach(function(stream) {
    stream.render();
  });
}

function Symbol(x, y, speed, first, opacity) {
  this.x = x;
  this.y = y;

  this.speed = speed;
  this.first = first;
  this.opacity = opacity;
  this.switchInterval = round(random(2, 25));
  this.setToRandomSymbol(0,0,0,' ');
}

Symbol.prototype = {
  setToRandomSymbol: function(highlightIndex, currentIndex, tail, currentValue) {
    var charType = round(random(2000));
    var throwInBlankInTail = random(100) > 99;
  
      
    if (currentIndex <= highlightIndex + tail && currentIndex >= highlightIndex && !throwInBlankInTail){
      //show something

      if (charType > 4 && currentValue != ' '){
        //stay the same
        this.value = currentValue;

      } else if (charType > 3) {
        // set it to Katakana
        this.value = String.fromCharCode(
          0x30A0 + round(random(0, 96))
        );

      } else if (charType > 2){
        //ruuuusski
        this.value = String.fromCharCode(
          0x0400 + round(random(0, 96))
        );

      }else{
        // set it to numeric
        this.value = round(random(0, 9));
      }

    } else if ( currentIndex < highlightIndex || currentIndex > highlightIndex + tail || throwInBlankInTail){
      this.value = ' ';
    }
  }

};

function Stream() {
  this.symbols = [];
  this.totalSymbols = window.innerHeight/symbolSize;
  this.speed = random(5, 22);

  this.hasBegun = false;
  this.highlightedIndex = random(this.totalSymbols);
  this.setDisplayTail();
}

Stream.prototype = {

  setDisplayTail: function() { 
    this.displayTail = random(this.totalSymbols * 0.7,this.totalSymbols * 0.9); 
  },

  generateSymbols: function(x, y) {
    var opacity = 255;
    for (var i =0; i <= this.totalSymbols; i++) {
      var symbol = new Symbol(
        x,
        y,
        this.speed,
        opacity
      );
      symbol.setToRandomSymbol();
      this.symbols.push(symbol);
      opacity -= (255 / this.totalSymbols) / fadeInterval;
      y -= symbolSize;
    }
  },

  render: function() {
    // stagger start
    if (!this.hasBegun){
      if (Math.floor(random(80)) == 0){
        this.hasBegun = true;
        this.highlightedIndex = this.symbols.length;
      }else{
        this.symbols.forEach(s => {
          s.value = ' ';
        });
        return;
      }
    }

    // this subtraction value controls the speed of the decending lighter symbols
    this.highlightedIndex = this.highlightedIndex -.9;
    // this multiplier controls the delay before returning the highlighted back to the top
    if (this.highlightedIndex < -(this.displayTail * 1.1)) { 
      //reset back to top
      this.setDisplayTail();
      this.highlightedIndex = this.symbols.length
    };  
    
    for (var i = 0; i < this.symbols.length; i++) {
      var symbol = this.symbols[i];
      var intHightlightIndex = Math.floor(this.highlightedIndex);
      var isHightlighted = i == intHightlightIndex;

      var maxBrightness = 255;

      if (i < intHightlightIndex + (this.displayTail*0.75)) {
        
        symbol.opacity = maxBrightness;
      }else{

        var distanceFromHighlight = i - intHightlightIndex;
        var inverseDistancePercent = 1 - (distanceFromHighlight/10); 
        symbol.opacity = 180;//(maxBrightness * inverseDistancePercent) * 2;
      }

      if (isHightlighted) {
        fill(200, 255, 190);
      } else {
        fill(0, 255, 70, symbol.opacity);
      }
      text(symbol.value, symbol.x, symbol.y);
        
      symbol.setToRandomSymbol(intHightlightIndex, i, this.displayTail, symbol.value);

    };

  }
};