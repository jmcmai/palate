import React, { useState } from "react";
import Template from "../components/Template";

import { useMutation, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";

import "./Events.css";

const Events: React.FC = () => {
  const [eventName, setEventName] = useState<string>("");
  const [eventDate, setEventDate] = useState<string>("");
  const [invitees, setInvitees] = useState<string[]>([]);
  const [inviteeEmail, setInviteeEmail] = useState<string>("");

  const addEventMutation = useMutation(api.events.addEvent);
  const addInvitee = useMutation(api.events.addParticipant);
  const userFromEmail = useQuery(api.users.getUserIdFromEmail, { email: inviteeEmail });

  // const removeParticipantMutation = useMutation(api.events.removeParticipant);

  const makeNewEvent = async () => {
    try {
      // Ensure all required fields are filled
      if (!eventName || !eventDate || invitees.length === 0) {
        alert("Please fill in all required fields.");
        return;
      }

      // Make the API call to add the event
      const result = await addEventMutation({
        name: eventName,
        date: eventDate,
        invitees: [],
      });

      // Reset the form fields after successfully adding the event
      setEventName("");
      setEventDate("");
      setInvitees([]);
    } catch (error) {
      console.error("Error adding event:", error);
      alert("An error occurred while adding the event. Please try again later.");
    }
  };

  const handleAddInvitee = async (e: React.FormEvent) => {
    e.preventDefault();
    if (inviteeEmail.trim() !== "") {
      setInvitees([...invitees, inviteeEmail]);
      setInviteeEmail("");
    }
  };

  return (
    <Template>
      <div className="content-body">
        <form className="event-form">
          <h2>Create New Event</h2>
          <div>
            <label htmlFor="eventName">Event Name:</label>
            <input
              type="text"
              id="eventName"
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="eventDate">Event Date:</label>
            <input
              type="text"
              id="eventDate"
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="inviteeEmail">Invitee Email:</label>
            <input
              type="email"
              id="inviteeEmail"
              value={inviteeEmail}
              onChange={(e) => setInviteeEmail(e.target.value)}
            />
            <button onClick={handleAddInvitee}>Add Invitee</button>
          </div>
          <div>
            <h3>Invitees:</h3>
            <ul>
              {invitees.map((email, index) => (
                // <div key={index} style={{ display: "flex", alignItems: "center" }}>
                //   <li>{email}</li>
                //   <button onClick={() => handleRemoveInvitee(email)}>Remove</button>
                // </div>
                <li key={index}>{email}</li>
              ))}
            </ul>
          </div>
          <button onClick={makeNewEvent}>Create Event</button>
        </form>
      </div>
    </Template>
  );
};

export default Events;
