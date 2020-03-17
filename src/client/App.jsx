import React, { Component } from 'react';
import './app.css';
import ReactImage from './react.png';
import Speech from 'speak-tts';

export default class App extends Component {
  state = { poem: null };

  componentDidMount() {
    fetch('/api/getPoem')
      .then(res => res.json())
      .then(responseObj => {
        this.setState(responseObj);
        const speech = new Speech(); // will throw an exception if not browser supported
        if(speech.hasBrowserSupport()) { // returns a boolean
          console.log("speech synthesis supported");
          speech.init().then((data) => {
            // The "data" object contains the list of available voices and the voice synthesis params
            console.log("Speech is ready, voices are available", data);
            speech.setVoice('Alex');
            setTimeout(() => {
              // speech.speak({
              //   text: responseObj.poem,
              // }).then(() => {
              //   console.log("Success !")
              // }).catch(e => {
              //   console.error("An error occurred :", e)
              // })
            }, 0);
          }).catch(e => {
            console.error("An error occured while initializing : ", e)
          });
        }
      });
  }

  render() {
    const { poem } = this.state;
    var isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);

    if(!isChrome) {
      document.getElementsByClassName('infinityChrome')[0].style.display = "none";
      document.getElementsByClassName('infinity')[0].style.display = "block";
    }
    return (
      <div>
        <div className="infinityChrome">
          <div></div>
          <div></div>
          <div></div>
        </div>
        <svg xmlns="http://www.w3.org/2000/svg" version="1.1" style={{display : 'none'}}>
          <defs>
            <filter id="goo">
              <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
              <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7" result="goo" />
              <feBlend in="SourceGraphic" in2="goo" />
            </filter>
          </defs>
        </svg>
        <input autoFocus/>
        {poem ? <p>{poem}</p> : null}
      </div>
    );
  }
}
