import React, { Component } from 'react';
import Particles from 'react-particles-js';
import Clarifai from 'clarifai';
import './App.css';
import  Navigation from './components/Navigation/Navigation';
import  SignIn from './components/SignIn/SignIn';
import  Register from './components/Register/Register';
import  Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import FaceRecognation from './components/FaceRecognation/FaceRecognation';

const app = new Clarifai.App({apiKey: '4b998fafd61d41c58a4ba234f1096a32'});
const particulesOptions = {
  particles : {
    number : {
      value : 180,
      density : {
        enable : true,
        value_area : 800
      }
    },
    shape: {
      type:  'star',
    }
  }
}
class App extends Component {
  constructor() {
    super();
    this.state = {
      input: '',
      imageUrl: '',
      box: {},
      route: 'SignIn',
      isSignedIn: false
    }
  }

  componentDidMount(){
    fetch('http://localhost:300')
    .then(response =>  response.json())
    .then(console.log)
  }

  calculateFaceLocation = (data) => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputimage')
    const width =  Number(image.width);
    const height = Number(image.height);
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width -  (clarifaiFace.right_col*width),
      bottomRow: height - (clarifaiFace.bottom_row*height)
    }
  }

  displayFaceBox = (box) => {
    this.setState({box: box})
  }
  onInputChange = (event)=> {
    this.setState({input: event.target.value});
  }

  onButtonSubmit = () => {
    this.setState({imageUrl: this.state.input});
    app.models.predict(
      Clarifai.FACE_DETECT_MODEL,
      this.state.input)
      .then(response => this.displayFaceBox(this.calculateFaceLocation(response)))
      .catch(err => console.log(err));
  }

  onRouteChange = (route) => {
    if(route === 'signout'){
      this.setState({isSignIn: false})
    }
    else if (route === 'home'){
      this.setState({isSignIn: true})
    }
    this.setState({route: route});
  }


  render() {
    const {isSignIn, imageUrl, route,  box} = this.state;
    return (
      <div className="App">
       <Particles className = 'particles'
          params={particulesOptions}
          />
        <Navigation isSignIn = {isSignIn} onRouteChange={this.onRouteChange}/>
        { route === 'home'
          ? <div>
              <Logo />
              <Rank />
              <ImageLinkForm
              onInputChange={this.onInputChange}
              onButtonSubmit={this.onButtonSubmit}/>
              <FaceRecognation box={box} imageUrl={imageUrl}/>
            </div>
            : (
              this.state.route === 'SignIn'
              ? <SignIn onRouteChange={this.onRouteChange}/>
              : <Register onRouteChange={this.onRouteChange}/>
             )
        }
      </div>
    );
  }
}

export default App;
