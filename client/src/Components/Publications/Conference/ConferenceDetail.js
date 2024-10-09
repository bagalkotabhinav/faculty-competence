import React, { useState, useEffect, useContext } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import Context from '../../../Context';
import Loading from '../../Loading';

const ConferenceDetail = () => {
  const context = useContext(Context.Context);
  const [conference, setConferenceDetail] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const authUser = context.authenticatedUser;

  const { id } = useParams();
  let navigate = useNavigate();

  useEffect(() => {
    // Fetch the conference details from the database
    const controller = new AbortController();
    context.data.getConference(id)
      .then(response => {
        if (response.id) {
          setConferenceDetail(response);
        } else {
          // If no conference is found, redirect to Not Found
          navigate('/notfound');
        }
      })
      .catch((error) => {
        console.error('Error fetching and parsing conference', error);
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
    context.data.deleteConference(id, authUser.emailAddress, authUser.password)
      .then((response) => {
        // If the conference is successfully deleted, navigate to the conference list
        if (response.length) {
          navigate('/error');
        } else {
          navigate('/conferences');
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

  // Only show the conference details if the conference exists
  return (
    conference ? (
      <div>
        <div className="actions--bar">
          <div className="wrap">
            {authUser && authUser.id === conference.User.id ? (
              <>
                <Link to={`/conferences/${id}/update`} className="button">Update Conference</Link>
                <button className="button" onClick={handleDelete}>Delete Conference</button>
              </>
            ) : null}
            <Link to="/" className="button button-secondary">Return to List</Link>
          </div>
        </div>

        <div className="wrap">
          <h2>Conference Detail</h2>
          <div className="main--flex">
            <div>
              <h3 className="course--detail--title">Conference</h3>
              <h4 className="course--name">{conference.title}</h4>

              <p><strong>Authors:</strong> {conference.authors}</p>

              <p><strong>Conference:</strong> {conference.conference}</p>
            </div>
            <div>
              <h3 className="course--detail--title">Publication Date</h3>
              <p>{new Date(conference.publicationDate).toLocaleDateString('en-CA')}</p>

              <h3 className="course--detail--title">Volume</h3>
              <p>{conference.volume}</p>

              <h3 className="course--detail--title">Issue</h3>
              <p>{conference.issue}</p>

              <h3 className="course--detail--title">Pages</h3>
              <p>{conference.pages}</p>
            </div>
          </div>
        </div>
      </div>
    ) : null
  );
}

export default ConferenceDetail;
