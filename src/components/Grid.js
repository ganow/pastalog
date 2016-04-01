import React, { PropTypes } from 'react';
import Series from './Series';
import Gridlines from './Gridlines';
import { mapEnabledSeries } from './../state/helpers.js';
import { getUUID } from 'lib';

class Grid extends React.Component {

  constructor(props) {
    super(props);
    this.onMouseEnter = this.onMouseEnter.bind(this);
    this.onMouseLeave = this.onMouseLeave.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
  }

  onMouseEnter() {
    this.props.store.dispatch({
      type: 'TOGGLE_HOVER',
      value: true,
    });
  }

  onMouseLeave() {
    this.props.store.dispatch({
      type: 'TOGGLE_HOVER',
      value: false,
    });
  }

  onMouseMove(e) {
    const obj = e.target.getBoundingClientRect();
    this.props.store.dispatch({
      type: 'MOVE_HOVER',
      coords: {
        hoverX: e.clientX - obj.left,
        hoverY: e.clientY - obj.top,
      },
    });
  }

  render() {
    const state = this.props.state;
    const logs = state.get('logs');
    const disabled = state.get('disabled');
    const width = state.getIn(['size', 'width']);
    const height = state.getIn(['size', 'height']);
    const scale = state.get('scale');

    return (
      <div className="Grid relative clearfix border m3"
        style={{ width, height }}
        onMouseEnter={this.onMouseEnter}
        onMouseLeave={this.onMouseLeave}
        onMouseMove={this.onMouseMove}
      >
        <Gridlines {...this.props} />
        {logs ? (
          mapEnabledSeries(logs, disabled, (modelName, seriesName, lists) => (
            <div key={modelName} className="absolute top-0 left-0 max z2">
              <Series key={getUUID(modelName, seriesName)}
                seriesName={seriesName} modelName={modelName}
                indices={lists.get('indices')}
                values={lists.get('values')}
                scale={scale} width={width} height={height}
              />
            </div>)
          )
        ) : (<div className="no-series col col-4 border mt-3 mx-auto">No logs Yet</div>)}
      </div>
    );
  }
}

Grid.propTypes = {
  state: PropTypes.object,
  store: PropTypes.object,
};

export default Grid;
