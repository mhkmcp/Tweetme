import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

import { TweetsComponent } from './tweets/components'

const appEl = document.getElementById('root')
if (appEl) {
  ReactDOM.render(<App />, appEl);
}

const e = React.createElement
const tweetEl = document.getElementById('tweetme')

if (tweetEl) {
  console.log(tweetEl.dataset)
  ReactDOM.render(e(TweetsComponent, tweetEl.dataset), tweetEl)
}


serviceWorker.unregister();
