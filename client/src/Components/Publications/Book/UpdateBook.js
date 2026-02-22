import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Context from '../../../Context';
import Loading from '../../Loading';

const UpdateBook = () => {
  const context = useContext(Context.Context);
  const [isLoading, setIsLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [authors, setAuthors] = useState('');
  const [publicationDate, setPublicationDate] = useState('');
  const [volume, setVolume] = useState('');
  const [pages, setPages] = useState('');
  const [errors, setErrors] = useState([]);
  const authUser = context.authenticatedUser;

  const { id } = useParams();
  let navigate = useNavigate();

  useEffect(() => {
    const controller = new AbortController();
    context.data.getBook(id,authUser.token)
      .then((response) => {
        if (response.error === "Sorry, we couldn't find the book you were looking for.") {
          navigate('/notfound');
        } else {
          if (authUser.id === response.userid) {
            setTitle(response.title);
            setAuthors(response.authors);
            setPublicationDate(response.publicationDate);
            setVolume(response.volume);
            setPages(response.pages);
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
    return () => controller?.abort();
  }, [authUser.id, id, navigate, context.data]);

  const onChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;

    switch (name) {
      case 'title':
        setTitle(value);
        break;
      case 'authors':
        setAuthors(value);
        break;
      case 'publicationDate':
        setPublicationDate(value);
        break;
      case 'volume':
        setVolume(value);
        break;
      case 'pages':
        setPages(value);
        break;
      default:
        break;
    }
  };

  const submit = (event) => {
    event.preventDefault();

    const updatedBook = {
      title,
      authors,
      publicationDate,
      volume,
      pages,
      userid: authUser.id,
    };

    context.data.updateBook(id, updatedBook, authUser.token)
      .then((response) => {
        if (response.length) {
          setErrors(response);
        } else {
          navigate('/books');
        }
      })
      .catch((error) => {
        console.error(error);
        navigate('/error');
      });
  };

  const cancel = (event) => {
    event.preventDefault();
    navigate('/books');
  };

  return (
    isLoading ?
      <Loading />
      : <div className="wrap">
        <h2>Update Book</h2>
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
              <label htmlFor="title">Title</label>
              <input id="title" name="title" type="text" value={title} onChange={onChange} />

              <label htmlFor="authors">Authors</label>
              <input id="authors" name="authors" type="text" value={authors} onChange={onChange} />

              <label htmlFor="publicationDate">Publication Date</label>
              <input id="publicationDate" name="publicationDate" type="date" value={publicationDate} onChange={onChange} />

              <label htmlFor="volume">Volume</label>
              <input id="volume" name="volume" type="text" value={volume} onChange={onChange} />

              <label htmlFor="pages">Pages</label>
              <input id="pages" name="pages" type="text" value={pages} onChange={onChange} />
            </div>
          </div>
          <button className="button" type="submit" onClick={submit}>Update Book</button>
          <button className="button button-secondary" onClick={cancel}>Cancel</button>
        </form>
      </div>
  );
};

export default UpdateBook;