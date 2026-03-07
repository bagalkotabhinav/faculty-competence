import React, { useState, useContext } from 'react';
import Context from '../../Context';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react';

const UserSignUp = () => {
  const context = useContext(Context.Context);
  const [designation, setDesignation] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [affiliation, setAffiliation] = useState('');
  const [areasOfInterest, setAreasOfInterest] = useState('');
  const [homepage, setHomepage] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState([]);
  const [showPassword, setShowPassword] = useState(false);

  let navigate = useNavigate();

  const onChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;

    if (name === 'designation') setDesignation(value);
    if (name === 'firstName') setFirstName(value);
    if (name === 'lastName') setLastName(value);
    if (name === 'affiliation') setAffiliation(value);
    if (name === 'areasOfInterest') setAreasOfInterest(value);
    if (name === 'homepage') setHomepage(value);
    if (name === 'emailAddress') setEmailAddress(value);
    if (name === 'password') setPassword(value);
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const submit = (event) => {
    event.preventDefault();
    const user = {
      designation,
      firstName,
      lastName,
      affiliation,
      areasOfInterest,
      homepage,
      emailAddress,
      password,
    };

    context.data.createUser(user)
      .then(errors => {
        if (errors.length) {
          setErrors(errors);
        } else {
          context.actions.signIn(emailAddress, password)
            .then(() => {
              navigate('/');
            });
        }
      })
      .catch((error) => {
        console.error(error);
        navigate('/error');
      });
  };

  const cancel = (event) => {
    event.preventDefault();
    navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">Sign Up</h1>
        {errors.length ? (
          <div className="validation--errors mb-4 text-red-500">
            <h3 className="text-lg font-bold">Validation Errors</h3>
            <ul>
              {errors.map((error, i) => (
                <li key={i}>{error}</li>
              ))}
            </ul>
          </div>
        ) : null}
        <form className="space-y-4" onSubmit={submit}>
          {/* Designation */}
          <div className="relative">
            <label htmlFor="designation" className="block text-sm font-medium text-gray-700 mb-1">Designation</label>
            <input id="designation" name="designation" type="text" value={designation} onChange={onChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="For eg. Associate Professor" />
          </div>
          
          {/* First Name */}
          <div className="relative">
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
            <input id="firstName" name="firstName" type="text" value={firstName} onChange={onChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter your first name" />
          </div>

          {/* Last Name */}
          <div className="relative">
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
            <input id="lastName" name="lastName" type="text" value={lastName} onChange={onChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter your last name" />
          </div>

          {/* Affiliation */}
          <div className="relative">
            <label htmlFor="affiliation" className="block text-sm font-medium text-gray-700 mb-1">Affiliation</label>
            <input id="affiliation" name="affiliation" type="text" value={affiliation} onChange={onChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder=" For eg. Associate Professor, Dept. of ISE, RVCE" />
          </div>

          {/* Areas of Interest */}
          <div className="relative">
            <label htmlFor="areasOfInterest" className="block text-sm font-medium text-gray-700 mb-1">Areas of Interest</label>
            <input id="areasOfInterest" name="areasOfInterest" type="text" value={areasOfInterest} onChange={onChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Natural Language Processing, Cyber Security" />
          </div>

          {/* Homepage */}
          <div className="relative">
            <label htmlFor="homepage" className="block text-sm font-medium text-gray-700 mb-1">Homepage</label>
            <input id="homepage" name="homepage" type="url" value={homepage} onChange={onChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="For eg. www.rvce.edu.in/john-doe" />
          </div>

          {/* Email Address */}
          <div className="relative">
            <label htmlFor="emailAddress" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <div className="relative">
              <input id="emailAddress" name="emailAddress" type="email" value={emailAddress} onChange={onChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pl-10" placeholder="Enter your email" />
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            </div>
          </div>

          {/* Password */}
          <div className="relative">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <div className="relative">
              <input id="password" name="password" type={showPassword ? 'text' : 'password'} value={password} onChange={onChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pl-10 pr-10" placeholder="Enter your password" />
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <button type="button" onClick={togglePasswordVisibility} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 focus:outline-none">
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div>
            <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">Sign Up</button>
          </div>
          <div>
            <button type="button" onClick={cancel} className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300">Cancel</button>
          </div>
        </form>
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link to='/signin' className="font-medium text-blue-600 hover:text-blue-500">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default UserSignUp;
