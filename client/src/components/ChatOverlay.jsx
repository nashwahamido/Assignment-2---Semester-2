import React, { useState } from 'react';
import ChatBox from './ChatBox';
import '../styles/chat-overlay.css';

var ChatOverlay = function(props) {
  var openState = useState(false);
  var isOpen = openState[0];
  var setIsOpen = openState[1];

  return React.createElement('div', { className: 'co' },
    isOpen && React.createElement('div', { className: 'co__panel' },
      React.createElement('div', { className: 'co__panel-header' },
        React.createElement('div', { className: 'co__panel-title' },
          React.createElement('span', null, props.groupName || 'Chat'),
          React.createElement('span', { className: 'co__panel-status' },
            React.createElement('span', { className: 'co__status-dot' }),
            ' Online'
          )
        ),
        React.createElement('button', {
          className: 'co__close',
          onClick: function() { setIsOpen(false); }
        }, '\u2715')
      ),
      React.createElement(ChatBox, {
        groupId: props.groupId,
        userId: props.userId,
        userName: props.userName,
        groupName: props.groupName,
        groupColor: props.groupColor,
        compact: true
      })
    ),
    React.createElement('button', {
      className: 'co__toggle' + (isOpen ? ' co__toggle--open' : ''),
      onClick: function() { setIsOpen(!isOpen); }
    }, 'Chat')
  );
};

export default ChatOverlay;
