import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Context from '../../../Context';

const CreateConference = () => {
  const context = useContext(Context.Context);
  const [title, setTitle] = useState('');
  const [authors, setAuthors] = useState('');
  const [publicationDate, setPublicationDate] = useState('');
  const [conference, setConference] = useState('');
  const [volume, setVolume] = useState('');
  const [issue, setIssue] = useState('');
  const [pages, setPages] = useState('');
  const [errors, setErrors] = useState([]);
  const authUser = context.authenticatedUser;

  let navigate = useNavigate();

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
      case 'conference':
        setConference(value);
        break;
      case 'volume':
        setVolume(value);
        break;
      case 'issue':
        setIssue(value);
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

    const conferenceData = {
      title,
      authors,
      publicationDate,
      conference,
      volume,
      issue,
      pages,
      userid: authUser.id,
    };

    context.data.createConference(conferenceData, authUser.token)
      .then(errors => {
        if (errors.length) {
          setErrors(errors);
        } else {
          navigate('/conferences');
        }
      })
      .catch((error) => {
        console.error(error);
        navigate('/error');
      });
  };

  const cancel = (event) => {
    event.preventDefault();
    navigate('/conferences');
  };

  return (
    <div className="wrap">
      <h2>Create Conference</h2>
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

            <label htmlFor="conference">Conference</label>
            <input id="conference" name="conference" type="text" value={conference} onChange={onChange} />

            <label htmlFor="volume">Volume</label>
            <input id="volume" name="volume" type="text" value={volume} onChange={onChange} />

            <label htmlFor="issue">Issue</label>
            <input id="issue" name="issue" type="text" value={issue} onChange={onChange} />

            <label htmlFor="pages">Pages</label>
            <input id="pages" name="pages" type="text" value={pages} onChange={onChange} />
          </div>
        </div>
        <button className="button" type="submit" onClick={submit}>Create Conference</button>
        <button className="button button-secondary" onClick={cancel}>Cancel</button>
      </form>
    </div>
  );
};

export default CreateConference;
