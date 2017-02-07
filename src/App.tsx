import * as React from 'react';
import { connect, Dispatch } from 'react-redux';
import { bindActionCreators } from 'redux';
import { space, init, inputChanged } from './redux/actions';
import './App.css';

const logo = require('./logo.svg');

interface OwnProps {

}
interface AppState {
  wordsList: string[];
  input: string;
}
interface DispatchProps {
  space: typeof space;
  init: typeof init;
  inputChanged: typeof inputChanged;
}

const mapStateToProps = (state: AppState, {}: OwnProps) => state;
const mapDispatchToProps = (dispatch: Dispatch<any>) => ({
  space: bindActionCreators(space, dispatch),
  init: bindActionCreators(init, dispatch),
  inputChanged: bindActionCreators(inputChanged, dispatch)
});

const whiteSpaceRegex = /\s/g;

class AppComponent extends React.Component<AppState & DispatchProps & OwnProps, void> {
  componentDidMount() {
    this.props.init();
  }

  onInputChange(input: string) {
    if (whiteSpaceRegex.test(input)) {
      this.props.space(input.replace(whiteSpaceRegex, ''));
    }
    else {
      this.props.inputChanged(input);
    }
  }

  render() {

    const {wordsList, input} = this.props;

    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React</h2>
        </div>
        <p className="App-intro">
          To get started, edit <code>src/App.tsx</code> and save to reload.
        </p>
        <input type='text' value={input} onChange={(e) => this.onInputChange(e.target.value)} />
        {wordsList.map((word, index) => <div key={index} >{word}</div>)}
      </div>
    );
  }
}

export const App = connect<AppState, DispatchProps, OwnProps>(mapStateToProps, mapDispatchToProps)(AppComponent);
