import React, { Component } from 'react';
import './app.css';
import ReactImage from './react.png';
import Speech from 'speak-tts';
import Sentiment from 'sentiment';
import happyAudio from '../../public/happy.aac';
import sadAudio from '../../public/sad.aac';

export default class App extends Component {
  state = { poem: null, apiResponseUrl: null, sentimentResultScore: null };

  // componentWillMount() {
  //   fetch('/api/getPoem')
  //     .then(res => res.json())
  //     .then(responseObj => {
  //       console.log(this.state);
  //       this.setState({...responseObj}, () => console.log(this.state));
  //       // OLD tts ------
  //       // const speech = new Speech(); // will throw an exception if not browser supported
  //       // if(speech.hasBrowserSupport()) { // returns a boolean
  //       //   console.log("speech synthesis supported");
  //       //   speech.init().then((data) => {
  //       //     // The "data" object contains the list of available voices and the voice synthesis params
  //       //     console.log("Speech is ready, voices are available", data);
  //       //     speech.setVoice('Alex');
  //       //     setTimeout(() => {
  //       //       // speech.speak({
  //       //       //   text: responseObj.poem,
  //       //       // }).then(() => {
  //       //       //   console.log("Success !")
  //       //       // }).catch(e => {
  //       //       //   console.error("An error occurred :", e)
  //       //       // })
  //       //       let sentiment = new Sentiment();
  //       //       let result = sentiment.analyze(responseObj.poem);
  //       //       console.dir(result);
  //       //     }, 0);
  //       //   }).catch(e => {
  //       //     console.error("An error occured while initializing : ", e)
  //       //   });
  //       // }
  //       // END OLD tts ------
  //     });
  // }

  enterButtonClicked = () => {
    console.log('clicked');
    fetch('/api/getPoem')
      .then(res => res.json())
      .then(responseObj => {
        let sentiment = new Sentiment();
        let sentimentResult = sentiment.analyze(responseObj.poem);
        let activeAudioElement = null;
        let activeTargetVolume = null;
        const happyAudioPlayerElement = document.getElementById('happyAudioPlayer');
        const sadAudioPlayerElement = document.getElementById('sadAudioPlayer');
        // initialize volume to 0
        happyAudioPlayerElement.volume = 0;
        sadAudioPlayerElement.volume = 0;

        if (sentimentResult.score >= 0) {
          activeAudioElement = happyAudioPlayerElement;
          activeTargetVolume = 0.2;
        } else {
          activeAudioElement = sadAudioPlayerElement;
          activeTargetVolume = 0.2;
        }

        const transitionLengthMilSec = 2500;
        const intervalMilSec = 100;
        const incrementPercentAmount = activeTargetVolume/(transitionLengthMilSec/intervalMilSec);
        console.log(activeAudioElement.volume);

        const increaseVol = () => {
          if (activeAudioElement.volume < activeTargetVolume) {
            activeAudioElement.volume += incrementPercentAmount;
            console.log(activeAudioElement.volume);
          } else {
            volumeFadeIn.clearInterval();
          }
        };

        const volumeFadeIn = setInterval(increaseVol(), intervalMilSec);

        this.setState({...responseObj, sentimentResultScore: sentimentResult.score}, () => console.log(this.state));
      });
  };

  render() {
    const { poem, apiResponseUrl  } = this.state;
    var isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);

    if(!isChrome) {
      document.getElementsByClassName('infinityChrome')[0].style.display = "none";
      document.getElementsByClassName('infinity')[0].style.display = "block";
    }
    return (
      <div>
        {/*<div className="infinityChrome">*/}
        {/*  <div></div>*/}
        {/*  <div></div>*/}
        {/*  <div></div>*/}
        {/*</div>*/}
        <svg xmlns="http://www.w3.org/2000/svg" version="1.1" style={{display : 'none'}}>
          <defs>
            <filter id="goo">
              <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
              <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7" result="goo" />
              <feBlend in="SourceGraphic" in2="goo" />
            </filter>
          </defs>
        </svg>
        <button id="enterButton" onClick={() => this.enterButtonClicked()} />
        <input autoFocus/>
        <audio id="poemAudioPlayer">
          <source src={apiResponseUrl} type="audio/ogg" />
          Your browser does not support the audio element.
        </audio>
        <audio id="happyAudioPlayer">
          <source src={happyAudio} type="audio/aac" />
          Your browser does not support the audio element.
        </audio>
        <audio id="sadAudioPlayer">
          <source src={sadAudio} type="audio/aac" />
          Your browser does not support the audio element.
        </audio>
        {poem ? <p>{poem}</p> : null}
      </div>
    );
  }
}
