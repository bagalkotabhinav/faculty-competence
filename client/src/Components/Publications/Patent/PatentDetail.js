import React, { useState, useEffect, useContext } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import Context from '../../../Context';
import Loading from '../../Loading';

const PatentDetail = () => {
  const context = useContext(Context.Context);
  const [patent, setPatentDetail] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const authUser = context.authenticatedUser;

  const { id } = useParams();
  let navigate = useNavigate();

  useEffect(() => {
    const controller = new AbortController();
    context.data.getPatent(id,authUser.token)
      .then(response => {
        if (response.id) {
          setPatentDetail(response);
        } else {
          navigate('/notfound');
        }
      })
      .catch((error) => {
        console.error('Error fetching and parsing patent', error);
        navigate('/error');
      })
      .finally(() => {
        setIsLoading(false);
      });
    return () => controller?.abort();
  }, [id, navigate, context.data]);

  const handleDelete = (event) => {
    event.preventDefault();
    context.data.deletePatent(id, authUser.token)
      .then((response) => {
        if (response.length) {
          navigate('/error');
        } else {
          navigate('/patents');
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

  return (
    patent ? (
      <div>
        <div className="actions--bar">
          <div className="wrap">
            {authUser && authUser.id === patent.User.id ? (
              <>
                <Link to={`/patents/${id}/update`} className="button">Update Patent</Link>
                <button className="button" onClick={handleDelete}>Delete Patent</button>
              </>
            ) : null}
            <Link to="/patents" className="button button-secondary">Return to List</Link>
          </div>
        </div>

        <div className="wrap">
          <h2>Patent Detail</h2>
          <div className="main--flex">
            <div>
              <h3 className="course--detail--title">Patent</h3>
              <h4 className="course--name">{patent.title}</h4>
              <p><strong>Inventors:</strong> {patent.inventors}</p>
            </div>
            <div>
              <h3 className="course--detail--title">Publication Date</h3>
              <p>{new Date(patent.publicationDate).toLocaleDateString()}</p>

              <h3 className="course--detail--title">Patent Office</h3>
              <p>{patent.patentOffice}</p>

              <h3 className="course--detail--title">Patent Number</h3>
              <p>{patent.patentNumber}</p>

              <h3 className="course--detail--title">Application Number</h3>
              <p>{patent.applicationNumber}</p>
            </div>
          </div>
        </div>
      </div>
    ) : null
  );
}

export default PatentDetail;