import React from 'react';
import ReactDOM from 'react-dom';
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles'

import config from './config'

import { Provider } from 'react-redux'
import configureStore from './store/configureStore'
// import { ConnectedRouter } from 'react-router-redux'

import {
  BrowserRouter
} from "react-router-dom";

import './styles/index.css';
import MasterComponent from './components/master/MasterComponent';

import * as serviceWorker from './serviceWorker';

const theme = createMuiTheme({
  palette: {
	  primary: { main: config.theme.primaryColor },
	  secondary: { main: config.theme.secondaryColor }
  }
})

ReactDOM.render(
		<Provider store={configureStore.store}>
			<BrowserRouter store={configureStore.store} history={configureStore.history}>
				<MuiThemeProvider theme={theme}>
					<MasterComponent />
				</MuiThemeProvider>
			</BrowserRouter>
		</Provider>,
	document.getElementById('root')
)

serviceWorker.register();
