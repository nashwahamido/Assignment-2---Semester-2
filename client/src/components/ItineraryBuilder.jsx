/**
 * ItineraryBuilder.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * WHERE THIS LIVES ON THE PAGE
 *
 * The EJS page (groupPage.ejs) renders this structure:
 *
 *   <%- include('partials/navbar',  { user }) %>
 *   <%- include('partials/header',  { title, subtitle }) %>
 *   <%- include('partials/sidebar', { activeMenu }) %>
 *
 *     <!-- MOUNT POINT — React fills this div -->
 *     <div id="group-tabs-root"
 *          data-group-id="<%= group.id %>"
 *          data-user-id="<%= user.id %>"
 *          data-group-name="<%= group.name %>">
 *     </div>
 *
 *   <%- include('partials/footer') %>
 *   <script type="module" src="/js/groupTabs.js"></script>
 
 * Props:
 *   tripId           {string|number} — group/trip id from data-group-id
 *   initialItinerary {Array}         — pre-loaded activities (Week 2)
 *   onSave           {function}      — callback({ tripId, startDate, endDate, activities })
 */

import React, { useState } from 'react';
import '../styles/itinerary-builder.css';

const ItineraryBuilder = ({ tripId = null, initialItinerary = [], onSave = null }) => {
  const [startDate, setStartDate]           = useState('');
  const [endDate, setEndDate]               = useState('');
  const [activities, setActivities]         = useState(initialItinerary || []);
  const [draggedActivity, setDraggedActivity] = useState(null);
  const [editingActivity, setEditingActivity] = useState(null);
  const [showAddForm, setShowAddForm]       = useState(false);
  const [newActivity, setNewActivity]       = useState({
    title: '', description: '', time: '09:00', category: 'sightseeing', date: '',
  });

  // ── Helpers ──────────────────────────────────────────────────────────────

  const getDateRange = () => {
    if (!startDate || !endDate) return [];
    const dates = [];
    const current = new Date(startDate);
    const end = new Date(endDate);
    while (current <= end) {
      dates.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    return dates;
  };

  const handleDateChange = (e, type) => {
    const date = e.target.value;
    if (type === 'start') {
      setStartDate(date);
      if (endDate && new Date(date) > new Date(endDate)) setEndDate('');
    } else {
      setEndDate(date);
    }
  };

  const resetForm = () => {
    setNewActivity({ title: '', description: '', time: '09:00', category: 'sightseeing', date: '' });
    setShowAddForm(false);
  };

  const handleAddActivity = (e) => {
    e.preventDefault();
    if (!newActivity.title || !newActivity.date) { alert('Please fill in title and date'); return; }
    setActivities([...activities, { id: Date.now(), ...newActivity, tripId }]);
    resetForm();
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    setActivities(activities.map((a) => a.id === editingActivity.id ? { ...a, ...newActivity } : a));
    setEditingActivity(null);
    resetForm();
  };

  const handleDragStart  = (e, activity) => { setDraggedActivity(activity); e.dataTransfer.effectAllowed = 'move'; };
  const handleDragOver   = (e) => { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; };
  const handleDropOnDate = (e, date) => {
    e.preventDefault();
    if (!draggedActivity) return;
    setActivities(activities.map((a) =>
      a.id === draggedActivity.id ? { ...a, date: date.toISOString().split('T')[0] } : a
    ));
    setDraggedActivity(null);
  };

  const handleDeleteActivity = (id) => setActivities(activities.filter((a) => a.id !== id));
  const handleEditActivity   = (activity) => { setEditingActivity(activity); setNewActivity(activity); setShowAddForm(true); };
  const getActivitiesForDate = (date) => activities.filter((a) => a.date === date.toISOString().split('T')[0]);
  const formatDate           = (date) => date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  const handleSaveItinerary  = () => { if (onSave) onSave({ tripId, startDate, endDate, activities }); };

  const dateRange = getDateRange();

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="itinerary-builder">

      {/* Header */}
      <div className="itinerary-header">
        <h2>Trip Itinerary</h2>
        <p>Plan your activities day by day</p>
      </div>

      {/* ── Date Range Selector ─────────────────────────────────────────── */}
      <div className="date-range-selector">
        <div className="date-input-group">
          <label htmlFor="start-date">Start Date:</label>
          <input id="start-date" type="date" value={startDate}
            onChange={(e) => handleDateChange(e, 'start')} className="date-input" />
        </div>
        <div className="date-input-group">
          <label htmlFor="end-date">End Date:</label>
          <input id="end-date" type="date" value={endDate} min={startDate}
            onChange={(e) => handleDateChange(e, 'end')} className="date-input" />
        </div>
      </div>

      {/* ── Add / Edit Activity Form ────────────────────────────────────── */}
      {showAddForm && (
        <div className="add-activity-form">
          <h3>{editingActivity ? 'Edit Activity' : 'Add Activity'}</h3>
          <form onSubmit={editingActivity ? handleSaveEdit : handleAddActivity}>

            <div className="form-group">
              <label htmlFor="activity-title">Activity Title *</label>
              <input id="activity-title" type="text" placeholder="e.g., Visit Eiffel Tower"
                value={newActivity.title} required
                onChange={(e) => setNewActivity({ ...newActivity, title: e.target.value })} />
            </div>

            <div className="form-group">
              <label htmlFor="activity-date">Date *</label>
              <input id="activity-date" type="date" min={startDate} max={endDate} required
                value={newActivity.date}
                onChange={(e) => setNewActivity({ ...newActivity, date: e.target.value })} />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="activity-time">Time</label>
                <input id="activity-time" type="time" value={newActivity.time}
                  onChange={(e) => setNewActivity({ ...newActivity, time: e.target.value })} />
              </div>
              <div className="form-group">
                <label htmlFor="activity-category">Category</label>
                <select id="activity-category" value={newActivity.category}
                  onChange={(e) => setNewActivity({ ...newActivity, category: e.target.value })}>
                  <option value="sightseeing">Sightseeing</option>
                  <option value="dining">Dining</option>
                  <option value="shopping">Shopping</option>
                  <option value="entertainment">Entertainment</option>
                  <option value="accommodation">Accommodation</option>
                  <option value="transportation">Transportation</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="activity-description">Description</label>
              <textarea id="activity-description" rows="3"
                placeholder="Add notes about this activity..."
                value={newActivity.description}
                onChange={(e) => setNewActivity({ ...newActivity, description: e.target.value })} />
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn-primary">
                {editingActivity ? 'Update Activity' : 'Add Activity'}
              </button>
              <button type="button" className="btn btn-secondary"
                onClick={() => { setEditingActivity(null); resetForm(); }}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ── Add Activity Button ─────────────────────────────────────────── */}
      {!showAddForm && (
        <button className="btn btn-primary btn-add-activity" onClick={() => setShowAddForm(true)}>
          + Add Activity
        </button>
      )}

      {/* ── Calendar / Timeline View ────────────────────────────────────── */}
      {dateRange.length > 0 ? (
        <div className="itinerary-calendar">
          {dateRange.map((date) => {
            const dateStr      = date.toISOString().split('T')[0];
            const dayActivities = getActivitiesForDate(date);
            return (
              <div key={dateStr} className="itinerary-day"
                onDragOver={handleDragOver} onDrop={(e) => handleDropOnDate(e, date)}>

                <div className="day-header">
                  <h3>{formatDate(date)}</h3>
                  <span className="activity-count">
                    {dayActivities.length} {dayActivities.length === 1 ? 'activity' : 'activities'}
                  </span>
                </div>

                <div className="activities-list">
                  {dayActivities.length > 0 ? (
                    [...dayActivities]
                      .sort((a, b) => a.time.localeCompare(b.time))
                      .map((activity) => (
                        <div key={activity.id}
                          className={`activity-card category-${activity.category}`}
                          draggable onDragStart={(e) => handleDragStart(e, activity)}>
                          <div className="activity-time">{activity.time}</div>
                          <div className="activity-details">
                            <h4>{activity.title}</h4>
                            {activity.description && (
                              <p className="activity-description">{activity.description}</p>
                            )}
                            <span className="activity-category">{activity.category}</span>
                          </div>
                          <div className="activity-actions">
                            <button className="btn-icon btn-edit" title="Edit"
                              onClick={() => handleEditActivity(activity)}>✏️</button>
                            <button className="btn-icon btn-delete" title="Delete"
                              onClick={() => handleDeleteActivity(activity.id)}>🗑️</button>
                          </div>
                        </div>
                      ))
                  ) : (
                    <p className="empty-day">No activities planned for this day</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="empty-state">
          <p>Select start and end dates to begin planning your itinerary</p>
        </div>
      )}

      {/* ── Save Button ─────────────────────────────────────────────────── */}
      {activities.length > 0 && (
        <div className="itinerary-actions">
          <button className="btn btn-primary btn-lg" onClick={handleSaveItinerary}>
            Save Itinerary
          </button>
        </div>
      )}

    </div>
  );
};

export default ItineraryBuilder;
