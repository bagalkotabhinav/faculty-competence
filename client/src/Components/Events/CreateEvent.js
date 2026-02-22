import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Context from '../../Context';

const CreateEvent = () => {
  const context = useContext(Context.Context);
  const [eventTitle, setEventTitle] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [eventType, setEventType] = useState('Conference'); // Default value
  const [customEventType, setCustomEventType] = useState(''); // For "Other" option
  const [participationType, setParticipationType] = useState('Attended'); // Default value
  const [eventDate, setEventDate] = useState('');
  const [location, setLocation] = useState('');
  const [errors, setErrors] = useState([]);
  const authUser = context.authenticatedUser;

  let navigate = useNavigate();

  const onChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;

    switch (name) {
      case 'eventTitle':
        setEventTitle(value);
        break;
      case 'eventDescription':
        setEventDescription(value);
        break;
      case 'eventType':
        setEventType(value);
        setCustomEventType(''); // Reset custom field if eventType changes
        break;
      case 'customEventType':
        setCustomEventType(value);
        break;
      case 'participationType':
        setParticipationType(value);
        break;
      case 'eventDate':
        setEventDate(value);
        break;
      case 'location':
        setLocation(value);
        break;
      default:
        break;
    }
  };

  const submit = (event) => {
    event.preventDefault();
  
    const eventData = {
      title: eventTitle,
      description: eventDescription,
      eventType: eventType === 'Other' ? customEventType : eventType,
      participationType,
      eventDate,
      location,
      userid: authUser.id,
    };
  
    context.data.createEvent(eventData, authUser.token)
      .then(errors => {
        if (errors.length) {
          setErrors(errors);
        } else {
          navigate('/events');
        }
      })
      .catch((error) => {
        console.error(error);
        navigate('/error');
      });
  };
  

  const cancel = (event) => {
    event.preventDefault();
    navigate('/events');
  };

  return (
    <div className="wrap">
      <h2>Create Event</h2>
      {errors.length ?
        <div className="validation--errors">
          <h3>Validation Errors</h3>
          <ul>
            {errors.map((error, i) => <li key={i}>{error}</li>)}
          </ul>
        </div>
        : null
      }
      <form>
        <div className="main--flex">
          <div>
            <label htmlFor="eventTitle">Event Title</label>
            <input id="eventTitle" name="eventTitle" type="text" value={eventTitle} onChange={onChange} />


            <label htmlFor="eventDescription">Event Description</label>
            <textarea id="eventDescription" name="eventDescription" value={eventDescription} onChange={onChange}></textarea>

            <label htmlFor="eventType">Event Type</label>
            <select id="eventType" name="eventType" value={eventType} onChange={onChange}>
              <option value="Conference">Conference</option>
              <option value="Seminar">Seminar</option>
              <option value="Workshop">Workshop</option>
              <option value="Other">Other</option>
            </select>

            {eventType === 'Other' && (
              <div>
                <label htmlFor="customEventType">Specify Event Type</label>
                <input id="customEventType" name="customEventType" type="text" value={customEventType} onChange={onChange} />
              </div>
            )}

            <label htmlFor="participationType">Participation Type</label>
            <select id="participationType" name="participationType" value={participationType} onChange={onChange}>
              <option value="Attended">Attended</option>
              <option value="Delivered">Delivered</option>
              <option value="Organized">Organized</option>
            </select>

            <label htmlFor="eventDate">Event Date</label>
            <input id="eventDate" name="eventDate" type="date" value={eventDate} onChange={onChange} />

            <label htmlFor="location">Location</label>
            <input id="location" name="location" type="text" value={location} onChange={onChange} />
          </div>
        </div>
        <button className="button" type="submit" onClick={submit}>Create Event</button>
        <button className="button button-secondary" onClick={cancel}>Cancel</button>
      </form>
    </div>
  );
};

export default CreateEvent;
