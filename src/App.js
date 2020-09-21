import React, {Component} from 'react';
import './App.css';
import Canvas from './Canvas/Canvas.js';
import DashBoard from './DashBoard/DashBoard.js';
import 'bootstrap/dist/css/bootstrap.min.css';

function makeArray(size) {
  const array = [];
  for(var i=0; i<size; i++) {
    const row = [];
    for(var j=0; j<size; j++) {
      row.push(false);
    }
    array.push(row);
  }
  return array;
}

function isSurvive(arr, x, y, size) {
  var counter = 0;
  const subArr = [
    (x-1 >= 0 && y-1 >= 0) ? arr[x-1][y-1] : false,
    (y-1 >= 0) ? arr[x][y-1] : false,
    (x+1 < size && y-1 >= 0) ? arr[x+1][y-1] : false,
    (x-1 >= 0) ? arr[x-1][y] : false,
    (x+1 < size) ? arr[x+1][y] : false,
    (x-1 >= 0 && y+1 < size) ? arr[x-1][y+1] : false,
    (y+1 < size) ? arr[x][y+1] : false,
    (x+1 < size && y+1 < size) ? arr[x+1][y+1] : false
  ];
  subArr.forEach(element => {
    if(element === true) {counter++;}
  });
  if(arr[x][y] === true) {
    return (counter === 3 || counter === 2);
  }else {
    return (counter === 3);
  }
}
  
class App extends Component {
    constructor(props) {
        super(props);
        this.size = 1000
        this.leap = 10;
        this.array = makeArray(this.size);
        this.state = {
            size: this.size,
            fields: makeArray(this.size),
            generation: 0,
            frameRate: 300,
            isOn: false
        }
        this.start = this.start.bind(this);
        this.stop = this.stop.bind(this);
        this.compute = this.compute.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.draw = this.draw.bind(this)
        this.setSpeed = this.setSpeed.bind(this)
    }

    tick() {
      if(this.state.isOn) {
        this.compute()
      }
    }

    handleClick(e) {
      const x = Math.floor(e.nativeEvent.offsetX/this.leap)
      const y = Math.floor(e.nativeEvent.offsetY/this.leap)
      const fields = this.state.fields.map(function(arr) {
        return arr.slice()
      })
      fields[x][y] = !fields[x][y]
      this.setState({fields: fields})
    }

    compute() {
      const newArr = this.state.fields.map(function(arr) {
        return arr.slice();
      });
      for(var i=0; i<this.state.size; i++) {
        for(var j=0; j<this.state.size; j++) {
          newArr[i][j] = isSurvive(this.state.fields, i, j, this.state.size);
        }
      }
      this.setState({
        fields: newArr,
        generation: this.state.generation+1
      })
    }

    start() {
      if(this.state.isOn === false) {
        this.interval = setInterval(() => this.tick(), this.state.frameRate)
        this.setState({isOn: true})
      }
    }

    stop() {
      this.setState({isOn: false})
      clearInterval(this.interval)
    }

    setSpeed(e) {
      this.setState({
        frameRate: e.target.value
      })
    }

    draw(ctx) {
      const n = this.leap;
      const size = this.state.size;
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
      ctx.beginPath()
      ctx.lineWidth = .2;
      ctx.fillStyle = "#999"
      for(var i=0; i<size; i+=n) {
        for(var j=0; j<size; j+=n) {
          var x = i/n;
          var y = j/n;
          if(this.state.fields[x][y] === true) {
            ctx.fillRect(i, j, n, n)
          }else {
            ctx.rect(i, j, n, n)
          }
        }
      }
      ctx.stroke()
    }

    render() {
      return (
        <div>
          <h4 className="">Game of Life</h4>
          <DashBoard 
            start = {this.start}
            stop = {this.stop}
            frameRate = {this.state.frameRate}
            setSpeed = {this.setSpeed}
            isOn = {this.state.isOn}
          />
          <small >Speed: {Math.round((1000/this.state.frameRate) *100) / 100} frame/sec</small>
          <small >Gen: {this.state.generation}</small>
          <br/>
          <Canvas 
            draw={this.draw}
            framerate={this.state.frameRate}
            width={this.state.size}
            height={this.state.size}
            onClick={this.handleClick}
          />
        </div>
      );
    }
}

export default App;