import React, { useState, useEffect, useContext } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import Context from '../../../Context';
import Loading from '../../Loading';

const JournalDetail = () => {
  const context = useContext(Context.Context);
  const [journal, setJournalDetail] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const authUser = context.authenticatedUser;

  const { id } = useParams();
  let navigate = useNavigate();

  useEffect(() => {
    // Fetch the journal details from the database
    const controller = new AbortController();
    context.data.getJournal(id)
      .then(response => {
        if (response.id) {
          setJournalDetail(response);
        } else {
          // If no journal is found, redirect to Not Found
          navigate('/notfound');
        }
      })
      .catch((error) => {
        console.error('Error fetching and parsing journal', error);
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
    context.data.deleteJournal(id, authUser.emailAddress, authUser.password)
      .then((response) => {
        // If the journal is successfully deleted, navigate to the journal list
        if (response.length) {
          navigate('/error');
        } else {
          navigate('/journals');
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

  // Only show the journal details if the journal exists
  return (
    journal ? (
      <div>
        <div className="actions--bar">
          <div className="wrap">
            {authUser && authUser.id === journal.User.id ? (
              <>
                <Link to={`/journals/${id}/update`} className="button">Update Journal</Link>
                <button className="button" onClick={handleDelete}>Delete Journal</button>
              </>
            ) : null}
            <Link to="/" className="button button-secondary">Return to List</Link>
          </div>
        </div>

        <div className="wrap">
          <h2>Journal Detail</h2>
          <div className="main--flex">
            <div>
              <h3 className="course--detail--title">Journal</h3>
              <h4 className="course--name">{journal.title}</h4>

              <p><strong>Authors:</strong> {journal.authors}</p>

              <p><strong>Publisher:</strong> {journal.publisher}</p>
            </div>
            <div>
              <h3 className="course--detail--title">Publication Date</h3>
              <p>{new Date(journal.publicationDate).toLocaleDateString('en-CA')}</p>

              <h3 className="course--detail--title">Journal</h3>
              <p>{journal.journal}</p>

              <h3 className="course--detail--title">Volume</h3>
              <p>{journal.volume}</p>

              <h3 className="course--detail--title">Issue</h3>
              <p>{journal.issue}</p>

              <h3 className="course--detail--title">Pages</h3>
              <p>{journal.pages}</p>
            </div>
          </div>
        </div>
      </div>
    ) : null
  );
}

export default JournalDetail;
