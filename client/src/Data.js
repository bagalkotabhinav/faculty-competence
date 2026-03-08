import config from './config';
import Cookies from 'js-cookie';

export default class Data {

  /**
   * Core API request helper
   */
  async api(path, method = 'GET', body = null, token = null) {

    const url = config.apiBaseUrl + path;

    const options = {
      method,
      cache: "no-store",
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      }
    };

    if (body !== null) {
      options.body = JSON.stringify(body);
    }

    if (token) {
      options.headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(url, options);

    // If token invalid or expired, logout automatically
    if ((response.status === 401 || response.status === 403) && path !== '/login') {
      Cookies.remove('authenticatedUser');
      window.location.assign('/signin');
      return response;
    }

    return response;
  }


  /**
   * ============================
   * AUTHENTICATION
   * ============================
   */

  async loginUser(emailAddress, password) {

    const response = await this.api('/login', 'POST', {
      emailAddress,
      password
    });

    if (response.status === 200) {
      return response.json();
    }

    if (response.status === 400 || response.status === 401) {
      return response.json();
    }

    throw new Error('Login failed');
  }


  async getUser(token) {

    const response = await this.api('/users', 'GET', null, token);

    if (response.status === 200) {
      return response.json();
    }

    throw new Error();
  }


  async createUser(user) {

    const response = await this.api('/users', 'POST', user);

    if (response.status === 201) return [];

    if (response.status === 400) {
      const data = await response.json();
      return data.errors;
    }

    throw new Error();
  }


  async updateUser(id, user, token) {

    const response = await this.api(`/users/${id}`, 'PUT', user, token);

    if (response.status === 204) return [];

    if (response.status === 400) {
      const data = await response.json();
      return data.errors;
    }

    throw new Error();
  }



  /**
   * =================================
   * GENERIC RESOURCE CRUD FUNCTIONS
   * =================================
   */


  async getResources(resource, token) {

    const response = await this.api(`/resources/${resource}`, 'GET', null, token);

    if (response.status === 200) {
      return response.json();
    }

    throw new Error(`Failed to fetch ${resource}`);
  }



  async getResource(resource, id, token) {

    const response = await this.api(`/resources/${resource}/${id}`, 'GET', null, token);

    if (response.status === 200) {
      return response.json();
    }

    throw new Error(`Failed to fetch ${resource}`);
  }



  async createResource(resource, data, token) {

    const response = await this.api(`/resources/${resource}`, 'POST', data, token);

    if (response.status === 201) return [];

    if (response.status === 400) {
      const result = await response.json();
      return result.errors;
    }

    throw new Error(`Failed to create ${resource}`);
  }



  async updateResource(resource, id, data, token) {

    const response = await this.api(`/resources/${resource}/${id}`, 'PUT', data, token);

    if (response.status === 204) return [];

    if (response.status === 400) {
      const result = await response.json();
      return result.errors;
    }

    throw new Error(`Failed to update ${resource}`);
  }



  async deleteResource(resource, id, token) {

    const response = await this.api(`/resources/${resource}/${id}`, 'DELETE', null, token);

    if (response.status === 204) return [];

    throw new Error(`Failed to delete ${resource}`);
  }

}