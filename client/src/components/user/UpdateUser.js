import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Context from '../../Context';
import Loading from '../layout/Loading';

const UpdateUser = () => {
  const context = useContext(Context.Context);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState({
    designation: '',
    firstName: '',
    lastName: '',
    affiliation: '',
    areasOfInterest: '',
    homepage: '',
    emailAddress: '',
    password: '',
  });
  const [errors, setErrors] = useState([]);

  const { id } = useParams();
  let navigate = useNavigate();

  useEffect(() => {

    const fetchUser = async () => {
      try {
        if (!context || !context.authenticatedUser || !context.data) {
          console.error('Context is not set up correctly:', context);
          navigate('/signin');
          return;
        }

        const { authenticatedUser, data } = context;
        const response = await data.getUser(authenticatedUser.token);
        
        if (response.id === parseInt(id)) {
          setUser(response);
        } else {
          navigate('/forbidden');
        }
      } catch (error) {
        console.error('Error fetching user data', error);
        navigate('/error');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [context, id, navigate]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setUser(prevUser => ({ ...prevUser, [name]: value }));
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      if (!context || !context.authenticatedUser || !context.data) {
        console.error('Context is not set up correctly:', context);
        navigate('/signin');
        return;
      }
  
      const { authenticatedUser, data } = context;
  
      // Send updated user data to the API
      const response = await data.updateUser(id, user, authenticatedUser.token);
      
      if (response.length) {
        setErrors(response);
      } else {
        // Update the context with the new user data
        context.actions.updateAuthenticatedUser({
          ...authenticatedUser,
          ...user, // Merge updated user info with the current authenticated user
        });
        navigate('/');
      }
    } catch (error) {
      console.error('Error updating user', error);
      navigate('/error');
    }
  };
  
  

  const handleCancel = (event) => {
    event.preventDefault();
    navigate('/');
  }

  if (isLoading) return <Loading />;

  if (!context || !context.authenticatedUser) {
    return <div>Error: User not authenticated. Please <a href="/signin">sign in</a>.</div>;
  }

  return (
    <div className="wrap">
      <h2>Update User</h2>
      {errors.length > 0 && (
        <div className="validation--errors">
          <h3>Validation Errors</h3>
          <ul>
            {errors.map((error, i) => <li key={i}>{error}</li>)}
          </ul>
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="main--flex">
          <div>
          <div>
        <label htmlFor="lastName">Designation</label>
        <input
          id="designation"
          name="designation"
          type="text"
          value={user.designation}
          onChange={handleChange}
          placeholder="Enter designation"
        />
      </div>
          <div>
        <label htmlFor="firstName">First Name</label>
        <input
          id="firstName"
          name="firstName"
          type="text"
          value={user.firstName}
          onChange={handleChange}
          placeholder="Enter first name"
        />
      </div>

      <div>
        <label htmlFor="lastName">Last Name</label>
        <input
          id="lastName"
          name="lastName"
          type="text"
          value={user.lastName}
          onChange={handleChange}
          placeholder="Enter last name"
        />
      </div>

      <div>
        <label htmlFor="emailAddress">Email Address</label>
        <input
          id="emailAddress"
          name="emailAddress"
          type="email"
          value={user.emailAddress}
          onChange={handleChange}
          placeholder="Enter email address"
        />
      </div>

      <div>
        <label htmlFor="affiliation">Affiliation</label>
        <input
          id="affiliation"
          name="affiliation"
          type="text"
          value={user.affiliation}
          onChange={handleChange}
          placeholder="Enter affiliation"
        />
      </div>

      <div>
        <label htmlFor="areasOfInterest">Areas of Interest</label>
        <input
          id="areasOfInterest"
          name="areasOfInterest"
          type="text"
          value={user.areasOfInterest}
          onChange={handleChange}
          placeholder="Enter areas of interest"
        />
      </div>

      <div>
        <label htmlFor="homepage">Homepage</label>
        <input
          id="homepage"
          name="homepage"
          type="text"
          value={user.homepage}
          onChange={handleChange}
          placeholder="Enter homepage URL"
        />
      </div>

      <div>
        <label htmlFor="password">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          value={user.password}
          onChange={handleChange}
          placeholder="Leave blank to keep current password"
        />
      </div>
          </div>
        </div>
        <button className="button" type="submit">Update User</button>
        <button className="button button-secondary" onClick={handleCancel}>Cancel</button>
      </form>
    </div>
  );
}

export default UpdateUser;