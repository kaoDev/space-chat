import * as React from 'react';
import { connect, Dispatch } from 'react-redux';
import { bindActionCreators } from 'redux';
import { space, init, inputChanged } from './redux/actions';
import { List } from 'react-virtualized';
import './App.css';

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
interface OwnState {
  rowCount: number;
  scrollToIndex?: number;
  showScrollingPlaceholder: boolean;
  useDynamicRowHeight: boolean;
}

const mapStateToProps = (state: AppState, {}: OwnProps) => state;
const mapDispatchToProps = (dispatch: Dispatch<any>) => ({
  space: bindActionCreators(space, dispatch),
  init: bindActionCreators(init, dispatch),
  inputChanged: bindActionCreators(inputChanged, dispatch)
});

const whiteSpaceRegex = /\s/g;

class AppComponent extends React.Component<AppState & DispatchProps & OwnProps, OwnState> {
  state = {
    rowCount: 0,
    scrollToIndex: 0,
    showScrollingPlaceholder: false,
    useDynamicRowHeight: false
  }

  componentDidMount() {
    this.props.init();
  }

  onInputChange = (input: string) => {
    if (whiteSpaceRegex.test(input)) {
      this.props.space(input.replace(whiteSpaceRegex, ''));
    }
    else {
      this.props.inputChanged(input);
    }
  }

  renderWord = ({index}: { index: number, isScrolling: boolean }) => {
    const {wordsList} = this.props;
    return <div key={index} >{wordsList[index]}</div>
  }

  _getDatum = (index: number) => {
    const { wordsList } = this.props

    return wordsList[index % wordsList.length];
  }

  _getRowHeight = ({ index }: { index: number }) => {
    return 30
  }

  _noRowsRenderer = () => {
    return (
      <div className={'noRows'}>
        No chat log
      </div>
    )
  }

  _onRowCountChange = (event: any) => {
    const rowCount = parseInt(event.target.value, 10) || 0

    this.setState({ rowCount })
  }

  _onScrollToRowChange = (event: any) => {
    const { rowCount } = this.state
    let scrollToIndex: number | undefined = Math.min(rowCount - 1, parseInt(event.target.value, 10))

    if (isNaN(scrollToIndex)) {
      scrollToIndex = undefined
    }

    this.setState({ scrollToIndex })
  }
  _rowRenderer = ({ index, isScrolling, key, style }: { index: number, isScrolling: boolean, key: string, style: React.CSSProperties }) => {
    const {
      showScrollingPlaceholder
    } = this.state

    if (
      showScrollingPlaceholder &&
      isScrolling
    ) {
      return (
        <div
          className={['row', 'isScrollingPlaceholder'].join(' ')}
          key={key}
          style={style}
        >
          Scrolling...
        </div>
      )
    }

    const word = this._getDatum(index)

    return (
      <div
        className={'row'}
        key={key}
        style={style}
      >
        {word}
      </div>
    )
  }

  render() {

    const {wordsList, input} = this.props;
    const listHeight = 300;
    const overscanRowCount = 10;
    return (
      <div className="App">
        <h1>This is an anonymous chat, triggerd by spaces</h1>
        <List
          className={'List'}
          height={listHeight}
          overscanRowCount={overscanRowCount}
          noRowsRenderer={this._noRowsRenderer}
          rowCount={wordsList.length}
          rowHeight={this._getRowHeight}
          rowRenderer={this._rowRenderer}
          scrollToIndex={wordsList.length - 1}
          width={400}
        />
        <input className={'input'} type='text' value={input} onChange={(e) => this.onInputChange(e.target.value)} />
      </div>
    );
  }
}

export const App = connect<AppState, DispatchProps, OwnProps>(mapStateToProps, mapDispatchToProps)(AppComponent);
