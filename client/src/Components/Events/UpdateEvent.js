import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Context from '../../Context';
import Loading from '../Loading';

const UpdateEvent = () => {
  const context = useContext(Context.Context);
  const [isLoading, setIsLoading] = useState(true);
  const [title, setEventTitle] = useState('');
  const [eventType, setEventType] = useState('');
  const [customEventType, setCustomEventType] = useState('');
  const [participationType, setParticipationType] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [location, setLocation] = useState('');
  const [description, setEventDescription] = useState('');
  const [errors, setErrors] = useState([]);
  const authUser = context.authenticatedUser;

  const { id } = useParams();
  let navigate = useNavigate();

  useEffect(() => {
    const controller = new AbortController();
    context.data.getEvent(id,authUser.token)
      .then((response) => {
        if (response.error === "Sorry, we couldn't find the event you were looking for.") {
          navigate('/notfound');
        } else {
          // If the currently authenticated user is the same as the Event author
          // Allow the user to update the Event
          if (authUser.id === response.userid) {
            setEventTitle(response.title);
            setEventType(response.eventType);
            setCustomEventType(response.eventType === 'Other' ? response.customEventType : '');
            setParticipationType(response.participationType);
            setEventDate(response.eventDate);
            setLocation(response.location);
            setEventDescription(response.description);
          } else {
            navigate('/forbidden');
          }
        }
      })
      .catch(error => {
        console.error('Error fetching and parsing data', error);
        navigate('/error');
      })
      .finally(() => {
        setIsLoading(false);
      });
    // Clean up to prevent memory leak
    return () => controller?.abort();
  }, [authUser.id, id, navigate, context.data]);

  const onChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;

    if (name === 'title') {
      setEventTitle(value);
    }

    if (name === 'eventType') {
      setEventType(value);
      // Clear custom event type if not 'Other'
      if (value !== 'Other') {
        setCustomEventType('');
      }
    }

    if (name === 'customEventType') {
      setCustomEventType(value);
    }

    if (name === 'participationType') {
      setParticipationType(value);
    }

    if (name === 'eventDate') {
      setEventDate(value);
    }

    if (name === 'location') {
      setLocation(value);
    }

    if (name === 'description') {
      setEventDescription(value);
    }
  }

  const submit = (event) => {
    event.preventDefault();
    // Event object to update the event
    const updatedEvent = {
      title,
      eventType: eventType === 'Other' ? customEventType : eventType,
      participationType,
      eventDate,
      location,
      description,
      userid: authUser.id,
    };

    context.data.updateEvent(id, updatedEvent, authUser.token)
      .then((response) => {
        if (response.length) {
          setErrors(response);
        } else {
          navigate('/events');
        }
      })
      .catch((error) => {
        console.error(error);
        navigate('/error');
      });
  }

  const cancel = (event) => {
    event.preventDefault();
    navigate('/events');
  }

  return (
    isLoading ?
      <Loading />
      : <div className="wrap">
        <h2>Update Event</h2>
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
              <label htmlFor="title">Event Title</label>
              <input id="title" name="title" type="text" value={title} onChange={onChange} />

              <label htmlFor="description">Event Description</label>
              <textarea id="description" name="description" value={description} onChange={onChange}></textarea>

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
          <button className="button" type="submit" onClick={submit}>Update Event</button>
          <button className="button button-secondary" onClick={cancel}>Cancel</button>
        </form>
      </div>
  )
}

export default UpdateEvent;
