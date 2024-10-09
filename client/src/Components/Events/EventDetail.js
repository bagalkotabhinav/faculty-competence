import React, { useState, useEffect, useContext } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import Context from '../../Context';
import Loading from '../Loading';

const EventDetail = () => {
  const context = useContext(Context.Context);
  const [event, setEventDetail] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const authUser = context.authenticatedUser;

  const { id } = useParams();
  let navigate = useNavigate();

  useEffect(() => {
    // Fetch the event details from the database
    const controller = new AbortController();
    context.data.getEvent(id)
      .then(response => {
        if (response.id) {
          setEventDetail(response);
        } else {
          // If no event is found, redirect to Not Found
          navigate('/notfound');
        }
      })
      .catch((error) => {
        console.error('Error fetching and parsing event', error);
        navigate('/error');
      })
      .finally(() => {
        setIsLoading(false);
      });
    // Clean up to prevent memory leak
    return () => controller?.abort();
  }, [id, navigate, context.data]);

  const handleDelete = (event) => {
    event.preventDefault();
    context.data.deleteEvent(id, authUser.emailAddress, authUser.password)
      .then((response) => {
        // If the event is successfully deleted, navigate to the event list
        if (response.length) {
          navigate('/error');
        } else {
          navigate('/events');
        }
      })
      .catch((error) => {
        console.error(error);
        navigate('/error');
      });
  }

  if (isLoading) {
    return <Loading />;
  }

  // Only show the event details if the event exists
  return (
    event ? (
      <div>
        <div className="actions--bar">
          <div className="wrap">
            {authUser && authUser.id === event.User.id ? (
              <>
                <Link to={`/events/${id}/update`} className="button">Update Event</Link>
                <button className="button" onClick={handleDelete}>Delete Event</button>
              </>
            ) : null}
            <Link to="/" className="button button-secondary">Return to List</Link>
          </div>
        </div>

        <div className="wrap">
          <h2>Event Detail</h2>
          <div className="main--flex">
            <div>
              <h3 className="course--detail--title">Event</h3>
              <h4 className="course--name">{event.title}</h4>

              <ReactMarkdown>{event.description}</ReactMarkdown>
            </div>
            <div>
              <h3 className="course--detail--title">Event Type</h3>
              <p>{event.eventType}</p>

              <h3 className="course--detail--title">Participation Type</h3>
              <p>{event.participationType}</p>

              <h3 className="course--detail--title">Event Date</h3>
              <p>{new Date(event.eventDate).toLocaleDateString('en-CA')}</p>

              <h3 className="course--detail--title">Event Location</h3>
              <p>{event.location}</p>
            </div>
          </div>
        </div>
      </div>
    ) : null
  );
}

export default EventDetail;
