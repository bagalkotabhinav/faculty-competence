import React, { useState, useEffect, useContext } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import Context from '../../../Context';
import Loading from '../../Loading';

const BookDetail = () => {
  const context = useContext(Context.Context);
  const [book, setBookDetail] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const authUser = context.authenticatedUser;

  const { id } = useParams();
  let navigate = useNavigate();

  useEffect(() => {
    const controller = new AbortController();
    context.data.getBook(id)
      .then(response => {
        if (response.id) {
          setBookDetail(response);
        } else {
          navigate('/notfound');
        }
      })
      .catch((error) => {
        console.error('Error fetching and parsing book', error);
        navigate('/error');
      })
      .finally(() => {
        setIsLoading(false);
      });
    return () => controller?.abort();
  }, [id, navigate, context.data]);

  const handleDelete = (event) => {
    event.preventDefault();
    context.data.deleteBook(id, authUser.emailAddress, authUser.password)
      .then((response) => {
        if (response.length) {
          navigate('/error');
        } else {
          navigate('/books');
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
    book ? (
      <div>
        <div className="actions--bar">
          <div className="wrap">
            {authUser && authUser.id === book.User.id ? (
              <>
                <Link to={`/books/${id}/update`} className="button">Update Book</Link>
                <button className="button" onClick={handleDelete}>Delete Book</button>
              </>
            ) : null}
            <Link to="/" className="button button-secondary">Return to List</Link>
          </div>
        </div>

        <div className="wrap">
          <h2>Book Detail</h2>
          <div className="main--flex">
            <div>
              <h3 className="course--detail--title">Book</h3>
              <h4 className="course--name">{book.title}</h4>
              <p><strong>Authors:</strong> {book.authors}</p>
            </div>
            <div>
              <h3 className="course--detail--title">Publication Date</h3>
              <p>{new Date(book.publicationDate).toLocaleDateString('en-CA')}</p>

              <h3 className="course--detail--title">Volume</h3>
              <p>{book.volume}</p>

              <h3 className="course--detail--title">Pages</h3>
              <p>{book.pages}</p>
            </div>
          </div>
        </div>
      </div>
    ) : null
  );
}

export default BookDetail;