import React from 'react';
import ReactDOM from 'react-dom';
import { List } from 'immutable';

const LOADED_STATES = List( [
  'complete',
  'loaded',
  'interactive',
] );

/**
 * Check whether the component can be rendered now or we need to “schedule” to render it as early as possible.
 *
 * @param {(React.Component|React.PureComponent)} Component - The component to render.
 */

export default function renderOnReady( Component ) {
  if ( ! Component ) {
    return;
  }

  if ( LOADED_STATES.includes( document.readyState ) && document.body ) {
    render( Component );
  }
  else {
    window.addEventListener( 'DOMContentLoaded', () => render( Component ) );
  }
}

/**
 * Render the specified component.
 *
 * @param {(React.Component|React.PureComponent)} Component - The component to render.
 */

function render( Component ) {
  if ( ! Component ) {
    return;
  }

  ReactDOM.render(
    <Component />,
    document.getElementById( 'root' ),
  );
}
