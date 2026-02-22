import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Context from '../../../Context';
import Loading from '../../Loading';

const UpdatePatent = () => {
  const context = useContext(Context.Context);
  const [isLoading, setIsLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [inventors, setInventors] = useState('');
  const [publicationDate, setPublicationDate] = useState('');
  const [patentOffice, setPatentOffice] = useState('');
  const [patentNumber, setPatentNumber] = useState('');
  const [applicationNumber, setApplicationNumber] = useState('');
  const [errors, setErrors] = useState([]);
  const authUser = context.authenticatedUser;

  const { id } = useParams();
  let navigate = useNavigate();

  const patentOffices = [
    "CGPDTM - Indian Patent Office",
    "USPTO - United States Patent and Trademark Office",
    "EPO - European Patent Office",
    "JPO - Japan Patent Office",
    "CNIPA - China National Intellectual Property Administration",
    "KIPO - Korean Intellectual Property Office",
    "IPO - Intellectual Property Office (UK)",
    "CIPO - Canadian Intellectual Property Office",
    "IP Australia",
    "INPI - French National Institute of Industrial Property",
    "DPMA - German Patent and Trade Mark Office",
  ];

  useEffect(() => {
    if (!authUser?.token) return;
    const controller = new AbortController();
    context.data.getPatent(id,authUser.token)
      .then((response) => {
        if (response.error === "Sorry, we couldn't find the patent you were looking for.") {
          navigate('/notfound');
        } else {
          if (authUser.id === response.userid) {
            setTitle(response.title);
            setInventors(response.inventors);
            setPublicationDate(response.publicationDate);
            setPatentOffice(response.patentOffice);
            setPatentNumber(response.patentNumber);
            setApplicationNumber(response.applicationNumber);
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
  }, [authUser.id, authUser.token, id, navigate, context.data]);

  const onChange = (event) => {
    const { name, value } = event.target;
    switch (name) {
      case 'title': setTitle(value); break;
      case 'inventors': setInventors(value); break;
      case 'publicationDate': setPublicationDate(value); break;
      case 'patentOffice': setPatentOffice(value); break;
      case 'patentNumber': setPatentNumber(value); break;
      case 'applicationNumber': setApplicationNumber(value); break;
      default: break;
    }
  };

  const submit = (event) => {
    event.preventDefault();

    const updatedPatent = {
      title,
      inventors,
      publicationDate,
      patentOffice,
      patentNumber,
      applicationNumber,
      userid: authUser.id,
    };

    context.data.updatePatent(id, updatedPatent, authUser.token)
      .then((response) => {
        if (response.length) {
          setErrors(response);
        } else {
          navigate('/patents');
        }
      })
      .catch((error) => {
        console.error(error);
        navigate('/error');
      });
  };

  const cancel = (event) => {
    event.preventDefault();
    navigate('/patents');
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="wrap">
      <h2>Update Patent</h2>
      {errors.length > 0 && (
        <div className="validation--errors">
          <h3>Validation Errors</h3>
          <ul>
            {errors.map((error, i) => <li key={i}>{error}</li>)}
          </ul>
        </div>
      )}
      <form onSubmit={submit}>
        <div className="main--flex">
          <div>
            <label htmlFor="title">Title</label>
            <input id="title" name="title" type="text" value={title} onChange={onChange} />

            <label htmlFor="inventors">Inventors</label>
            <input id="inventors" name="inventors" type="text" value={inventors} onChange={onChange} />

            <label htmlFor="publicationDate">Publication Date</label>
            <input id="publicationDate" name="publicationDate" type="date" value={publicationDate} onChange={onChange} />

            <label htmlFor="patentOffice">Patent Office</label>
            <select id="patentOffice" name="patentOffice" value={patentOffice} onChange={onChange}>
              <option value="">Select a Patent Office</option>
              {patentOffices.map((office, index) => (
                <option key={index} value={office}>{office}</option>
              ))}
            </select>

            <label htmlFor="patentNumber">Patent Number</label>
            <input id="patentNumber" name="patentNumber" type="text" value={patentNumber} onChange={onChange} />

            <label htmlFor="applicationNumber">Application Number</label>
            <input id="applicationNumber" name="applicationNumber" type="text" value={applicationNumber} onChange={onChange} />
          </div>
        </div>
        <button className="button" type="submit">Update Patent</button>
        <button className="button button-secondary" onClick={cancel}>Cancel</button>
      </form>
    </div>
  );
};

export default UpdatePatent;