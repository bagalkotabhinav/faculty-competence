import React, { Component } from 'react';
import Cookies from 'js-cookie';
import Data from './Data';

const Context = React.createContext();

export class Provider extends Component {
  state = {
    authenticatedUser: Cookies.getJSON('authenticatedUser') || null,
  };

  constructor() {
    super();
    this.data = new Data();
  }

  render() {
    const { authenticatedUser } = this.state;
    const value = {
      authenticatedUser,
      data: this.data,
      actions: {
        signIn: this.signIn,
        signOut: this.signOut,
        updateAuthenticatedUser: this.updateAuthenticatedUser,  // Add the new update method
      },
    };
    return (
      <Context.Provider value={value}>
        {this.props.children}
      </Context.Provider>
    );
  }

    /**
   * Sign in with JWT login route
   * @param {String} emailAddress
   * @param {String} password
   * @returns {Object} authenticated user object (with token) or error object
   */
  signIn = async (emailAddress, password) => {
    const result = await this.data.loginUser(emailAddress, password);
    // result on success: { user: {...}, token: "..." }

    if (result?.user?.id && result?.token) {
      const authenticatedUser = {
        ...result.user,
        token: result.token,
      };

      this.setState({ authenticatedUser });
      Cookies.set('authenticatedUser', JSON.stringify(authenticatedUser), { expires: 1 });

      return authenticatedUser; // keeps response.id behavior working
    }

    return result; // backend error message object
  };

    /**
   * Update authenticated user fields, keep existing token
   * @param {Object} updatedUser
   */
  updateAuthenticatedUser = (updatedUser) => {
    const token = this.state.authenticatedUser?.token || null;
    const authenticatedUser = { ...updatedUser, token };

    this.setState({ authenticatedUser });
    Cookies.set('authenticatedUser', JSON.stringify(authenticatedUser), { expires: 1 });
  };

  /**
   * Signs the user out by setting a null authenticated user and removing cookies
   */
  signOut = () => {
    this.setState({ authenticatedUser: null });
    Cookies.remove('authenticatedUser');
  }
}

export const Consumer = Context.Consumer;

/**
 * A higher-order component that wraps the provided component in a Context Consumer component.
 * @param {class} Component - A React component.
 * @returns {function} A higher-order component.
 */
export function withContext(Component) {
  return function ContextComponent(props) {
    return (
      <Context.Consumer>
        {context => <Component {...props} context={context} />}
      </Context.Consumer>
    );
  }
}

const contextObjects = { withContext, Context };
export default contextObjects;
