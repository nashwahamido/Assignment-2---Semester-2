import React, { useEffect, useMemo, useState } from "react";
import "../styles/voting-system.css";

var MAX_VISIBILITY = 2;

var icons = {
  send: "/icons/Send Icon Bold.svg",
  yes: "/icons/Thumbs Up Icon.svg",
  no: "/icons/Thumbs Down Icon.svg",
  left: "/icons/Left Arrow Icon Bold.svg",
  right: "/icons/Right Arrow Icon Bold.svg",
  maybe: "/icons/maybe-icon.svg",
};

function ActivityCard({ activity, vote, onVote }) {
  return (
    <div className="vote-card">
      <img src={activity.image} alt={activity.name} className="vote-card-image" />
      <div className="vote-card-overlay" />

      <button type="button" className="share-btn" aria-label={"Share " + activity.name}>
        <img src={icons.send} alt="" className="share-icon" />
      </button>

      <div className="vote-card-content">
        <div className="tag-list">
          {(activity.tags || []).map(function (tag) {
            return (
              <span key={tag} className="activity-tag">
                {tag}
              </span>
            );
          })}
        </div>

        <div className="activity-copy">
          <h2>{activity.name}</h2>
          <p>{activity.description}</p>
        </div>

        <div className="vote-buttons">
          <button
            type="button"
            className={"vote-button" + (vote === "yes" ? " selected" : "")}
            onClick={function () {
              onVote("yes");
            }}
            aria-label={"Vote yes for " + activity.name}
          >
            <img src={icons.yes} alt="" className="vote-icon" />
          </button>

          <button
            type="button"
            className={"vote-button maybe-button" + (vote === "maybe" ? " selected" : "")}
            onClick={function () {
              onVote("maybe");
            }}
            aria-label={"Vote maybe for " + activity.name}
          >
            <img src={icons.maybe} alt="" className="vote-icon maybe-icon" />
          </button>

          <button
            type="button"
            className={"vote-button" + (vote === "no" ? " selected" : "")}
            onClick={function () {
              onVote("no");
            }}
            aria-label={"Vote no for " + activity.name}
          >
            <img src={icons.no} alt="" className="vote-icon" />
          </button>
        </div>
      </div>
    </div>
  );
}

function Carousel({ children, active, setActive }) {
  var count = React.Children.count(children);

  if (count === 0) {
    return null;
  }

  return (
    <div className="carousel-3d">
      <button
        type="button"
        className="nav-btn left"
        onClick={function () {
          setActive(function (i) {
            return (i - 1 + count) % count;
          });
        }}
        aria-label="Previous"
      >
        <img src={icons.left} alt="" className="nav-icon nav-icon-white" />
      </button>

    {React.Children.map(children, function (child, i) {
      var count = React.Children.count(children);
      var rawOffset = active - i;

      // Lets carousel loop
      if (rawOffset > count / 2) rawOffset -= count;
      if (rawOffset < -count / 2) rawOffset += count;

      return (
        <div
          className="card-container"
          style={{
            "--active": i === active ? 1 : 0,
            "--offset": rawOffset / 3,
            "--direction": Math.sign(rawOffset),
            "--abs-offset": Math.abs(rawOffset) / 3,
            pointerEvents: i === active ? "auto" : "none",
            opacity: Math.abs(rawOffset) > MAX_VISIBILITY ? "0" : "1",
            display: Math.abs(rawOffset) > MAX_VISIBILITY ? "none" : "block",
          }}
          key={i}
        >
            {child}
          </div>
        );
      })}

      <button
        type="button"
        className="nav-btn right"
        onClick={function () {
          setActive(function (i) {
            return (i + 1) % count;
          });
        }}
        aria-label="Next"
      >
        <img src={icons.right} alt="" className="nav-icon nav-icon-white" />
      </button>
    </div>
  );
}

export default function VotingSystem(props) {
  var destination = props.destination || "Rome";
  console.log("VotingSystem destination:", destination);
  var groupId = props.groupId || "";
  var activeState = useState(0);
  var active = activeState[0];
  var setActive = activeState[1];

  var votesState = useState({});
  var votes = votesState[0];
  var setVotes = votesState[1];

  var activitiesState = useState([]);
  var activities = activitiesState[0];
  var setActivities = activitiesState[1];

  var loadingState = useState(true);
  var loading = loadingState[0];
  var setLoading = loadingState[1];

  var errorState = useState("");
  var error = errorState[0];
  var setError = errorState[1];

  var preferences = useMemo(function () {
    try {
      return JSON.parse(localStorage.getItem("activityPreferences")) || [];
    } catch (e) {
      return [];
    }
  }, []);

 useEffect(function () {
  fetch(
  "/api/recommendations?city=" +
    encodeURIComponent(destination) +
    "&activities=" +
    encodeURIComponent(preferences.join(","))
)
      .then(function (res) {
        if (!res.ok) {
          throw new Error("Failed to load recommendations");
        }
        return res.json();
      })
      .then(function (data) {
        setActivities(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(function (err) {
        console.error(err);
        setError("Could not load recommendations right now.");
        setLoading(false);
      });
  }, [preferences, destination]);

  var handleVote = function (activityId, choice) {
    setVotes(function (prev) {
      var next = {};
      for (var k in prev) next[k] = prev[k];
      next[activityId] = choice;
      return next;
    });
  };

  if (loading) {
    return (
      <main className="voting-page">
        <section className="voting-section">
          <header className="voting-header">
            <h1>Recommended</h1>
            <p>Loading things to do for your trip...</p>
          </header>
        </section>
      </main>
    );
  }

  if (error) {
    return (
      <main className="voting-page">
        <section className="voting-section">
          <header className="voting-header">
            <h1>Recommended</h1>
            <p>{error}</p>
          </header>
        </section>
      </main>
    );
  }

  if (activities.length === 0) {
    return (
      <main className="voting-page">
        <section className="voting-section">
          <header className="voting-header">
            <h1>Recommended</h1>
            <p>No recommendations found for this destination yet.</p>
          </header>
        </section>
      </main>
    );
  }

  return (
    <main className="voting-page">
      <section className="voting-section">
        <header className="voting-header">
          <h1>Recommended</h1>
          <p>Vote for things to do based on your group’s interests.</p>
        </header>

        <Carousel active={active} setActive={setActive}>
          {activities.map(function (activity) {
            return (
              <ActivityCard
                key={activity.id}
                activity={activity}
                vote={votes[activity.id]}
                onVote={function (choice) {
                  handleVote(activity.id, choice);
                }}
              />
            );
          })}
        </Carousel>
      </section>
    </main>
  );
}