import React from 'react';
import JSMpeg from "@cycjimmy/jsmpeg-player";

export default class Stream extends React.Component {
  constructor(props) {
    super(props);    
    const mediaSource = new MediaSource();
    mediaSource.addEventListener('sourceopen', () => this.handleSourceOpen, false);
  }

  componentDidMount() {
    let canvas = document.getElementById("videocanvas");
    //these settings make the canvas scale when resized
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    let url = "ws://192.168.1.195:6789"
    new JSMpeg.Player(url, { canvas: canvas });
  }
 
  handleSourceOpen = event => {
    console.log('MediaSource opened');
    this.sourceBuffer = this.mediaSource.addSourceBuffer('video/webm; codecs="vp8"');
    console.log('Source buffer: ', this.sourceBuffer);
  }
  
  render() {
    return (
      <canvas id="videocanvas" ></canvas>
    );
  }
}