import React, { useState } from 'react';
import '../styles/sidebar.css';

var groups = [
  { id: 1, name: 'Prague', lastMsg: 'Haha oh man', emoji: '\u{1F525}', time: '12m', color: '#3B5F8A' },
  { id: 2, name: 'Rome', lastMsg: 'woohoooo', emoji: '', time: '24m', color: '#E8933A' },
  { id: 3, name: 'Dublin', lastMsg: "Haha that's terrifying", emoji: '\u{1F602}', time: '1h', color: '#3B5F8A' },
];

var Sidebar = function(props) {
  var activeGroup = props.activeGroup;
  var onSelect = props.onSelect;
  var searchState = useState('');
  var search = searchState[0];
  var setSearch = searchState[1];

  var filtered = groups.filter(function(g) {
    return g.name.toLowerCase().indexOf(search.toLowerCase()) !== -1;
  });

  return React.createElement('div', { className: 'sb' },
    React.createElement('div', { className: 'sb__header' },
      React.createElement('div', { className: 'sb__header-left' },
        React.createElement('span', { className: 'sb__title' }, 'Groups'),
        React.createElement('span', { className: 'sb__count' }, groups.length)
      ),
      React.createElement('a', { href: '/groups/create/country', className: 'sb__add' }, '+')
    ),
    React.createElement('div', { className: 'sb__search-wrap' },
      React.createElement('input', {
        className: 'sb__search',
        type: 'text',
        placeholder: 'search groups',
        value: search,
        onChange: function(e) { setSearch(e.target.value); }
      })
    ),
    React.createElement('div', { className: 'sb__list' },
      filtered.map(function(g) {
        var isActive = activeGroup && activeGroup.id === g.id;
        return React.createElement('a', {
          key: g.id,
          href: '/groups/' + g.id,
          className: 'sb__item' + (isActive ? ' sb__item--active' : ''),
          onClick: function(e) { e.preventDefault(); if (onSelect) onSelect(g); }
        },
          React.createElement('div', { className: 'sb__item-icon', style: { backgroundColor: g.color } }),
          React.createElement('div', { className: 'sb__item-info' },
            React.createElement('div', { className: 'sb__item-name' }, g.name),
            React.createElement('div', { className: 'sb__item-msg' }, g.lastMsg + ' ' + g.emoji)
          ),
          React.createElement('span', { className: 'sb__item-time' }, g.time)
        );
      })
    )
  );
};

export default Sidebar;
