import React, { useState, useEffect, useContext } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import Context from '../../Context';
import Loading from '../Loading';

const CourseDetail = () => {
  const context = useContext(Context.Context);
  const [course, setCourseDetail] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const authUser = context.authenticatedUser;

  const { id } = useParams();
  let navigate = useNavigate();

  useEffect(() => {
    // Fetch the course details from the database
    const controller = new AbortController();
    context.data.getCourse(id)
      .then(response => {
        if (response.id) {
          setCourseDetail(response);
        } else {
          // If no course is found, redirect to Not Found
          navigate('/notfound');
        }
      })
      .catch((error) => {
        console.error('Error fetching and parsing course', error);
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
    context.data.deleteCourse(id, authUser.emailAddress, authUser.password)
      .then((response) => {
        // If the course is successfully deleted, navigate to the homepage
        if (response.length) {
          navigate('/error');
        } else {
          navigate('/courses');
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

  // Only show the course details if the course exists
  return (
    course ? (
      <div>
        <div className="actions--bar">
          <div className="wrap">
            {authUser && authUser.id === course.User.id ? (
              <>
                <Link to={`/courses/${id}/update`} className="button">Update Course</Link>
                <button className="button" onClick={handleDelete}>Delete Course</button>
              </>
            ) : null}
            <Link to="/" className="button button-secondary">Return to List</Link>
          </div>
        </div>

        <div className="wrap">
          <h2>Course Detail</h2>
          <div className="main--flex">
            <div>
              <h3 className="course--detail--title">Course</h3>
              <h4 className="course--name">{course.title}</h4>
              {course.User ? (
                <p>By {course.User.firstName} {course.User.lastName}</p>
              ) : null}
              <ReactMarkdown>{course.description}</ReactMarkdown>
            </div>
            <div>
              <h3 className="course--detail--title">Course Duration</h3>
              <p>{course.estimatedTime}</p>

              <h3 className="course--detail--title">Prerequisites</h3>
              <ul className="course--detail--list">
                <ReactMarkdown>{course.materialsNeeded}</ReactMarkdown>
              </ul>
            </div>
          </div>
        </div>
      </div>
    ) : null
  );
}

export default CourseDetail;





