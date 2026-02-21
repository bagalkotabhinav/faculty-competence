import config from './config';
import Cookies from 'js-cookie';

export default class Data {
  /**
   * Make a Fetch request to the REST API
   * @param {String} path - API endpoint path (e.g. /courses, /users)
   * @param {String} [method='GET'] - HTTP method
   * @param {Object|null} [body=null] - Request payload
   * @param {String|null} [token=null] - JWT token for authenticated requests
   * @returns {Promise<Response>} Fetch API response
   */
  async api(path, method = 'GET', body = null, token = null) {
    const url = config.apiBaseUrl + path;

    const options = {
      method,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
    };

    if (body !== null) options.body = JSON.stringify(body);
    if (token) options.headers.Authorization = `Bearer ${token}`;

    const response = await fetch(url, options);

    // token missing/expired/invalid
    if ((response.status === 401 || response.status === 403) && path !== '/login') {
      Cookies.remove('authenticatedUser');
      window.location.assign('/signin');
      return response;
    }


    return response;
  }


  /**
   * Authenticate a user and retrieve a JWT token
   * @param {String} emailAddress - User email address
   * @param {String} password - User password
   * @returns {Promise<Object>} { user, token } on success or error message object
   */
  async loginUser(emailAddress, password) {
    const response = await this.api('/login', 'POST', { emailAddress, password });

    if (response.status === 200) {
      return response.json().then(data => data);
    } else if (response.status === 400 || response.status === 401) {
      return response.json().then(message => message);
    } else {
      throw new Error('Login request failed');
    }
  }

  /**
   * Retrieve the currently authenticated user
   * @param {String} token - JWT token
   * @returns {Promise<Object>} User data or error message
   */
  async getUser(token) {
    const response = await this.api('/users', 'GET', null, token);
    if (response.status === 200) {
      return response.json().then(data => data);
    } else {
      throw new Error();
    }
  }

  /**
   * Create a new user
   * @param {Object} user - User details
   * @returns {Promise<Array>} Empty array on success or validation errors
   */
  async createUser(user) {
    const response = await this.api('/users', 'POST', user);
    if (response.status === 201) {
      return [];
    } else if (response.status === 400) {
      return response.json().then(data => data.errors);
    } else {
      throw new Error();
    }
  }

  /**
   * Update an existing user
   * @param {String} id - User ID
   * @param {Object} user - Updated user data
   * @param {String} token - JWT token
   * @returns {Promise<Array>} Empty array on success or validation errors
   */
  async updateUser(id, user, token) {
    const response = await this.api(`/users/${id}`, 'PUT', user, token);
    if (response.status === 204) {
      return [];
    } else if (response.status === 400) {
      return response.json().then(data => data.errors);
    } else {
      throw new Error('Failed to update user');
    }
  }

  /**
   * Retrieve all courses
   * @returns {Promise<Object>} List of courses
   */
  async getCourses() {
    const response = await this.api('/courses', 'GET');
    if (response.status === 200) {
      return response.json().then(data => data);
    } else {
      throw new Error();
    }
  }

  /**
   * Retrieve a course by ID
   * @param {String} id - Course ID
   * @returns {Promise<Object>} Course data
   */
  async getCourse(id) {
    const response = await this.api(`/courses/${id}`, 'GET');
    if (response.status === 200) {
      return response.json().then(data => data);
    } else {
      throw new Error();
    }
  }

  /**
   * Create a new course
   * @param {Object} course - Course details
   * @param {String} token - JWT token
   * @returns {Promise<Array>} Empty array on success or validation errors
   */
  async createCourse(course, token) {
    const response = await this.api('/courses', 'POST', course, token);
    if (response.status === 201) {
      return [];
    } else if (response.status === 400) {
      return response.json().then(data => data.errors);
    } else {
      throw new Error();
    }
  }

  /**
   * Delete a course
   * @param {String} id - Course ID
   * @param {String} token - JWT token
   * @returns {Promise<Array>} Empty array on success or validation errors
   */
  async deleteCourse(id, token) {
    const response = await this.api(`/courses/${id}`, 'DELETE', null, token);
    if (response.status === 204) {
      return [];
    } else if (response.status === 400) {
      return response.json().then(data => data.errors);
    } else {
      throw new Error();
    }
  }

  /**
   * Update an existing course
   * @param {String} id - Course ID
   * @param {Object} course - Updated course data
   * @param {String} token - JWT token
   * @returns {Promise<Array>} Empty array on success or validation errors
   */
  async updateCourse(id, course, token) {
    const response = await this.api(`/courses/${id}`, 'PUT', course, token);
    if (response.status === 204) {
      return [];
    } else if (response.status === 400) {
      return response.json().then(data => data.errors);
    } else {
      throw new Error();
    }
  }

  /**
   * Retrieve all events
   * @returns {Promise<Object>} List of events
   */
  async getEvents() {
    const response = await this.api('/events', 'GET');
    if (response.status === 200) {
      return response.json().then(data => data);
    } else {
      throw new Error();
    }
  }

  /**
   * Retrieve an event by ID
   * @param {String} id - Event ID
   * @returns {Promise<Object>} Event data
   */
  async getEvent(id) {
    const response = await this.api(`/events/${id}`, 'GET');
    if (response.status === 200) {
      return response.json().then(data => data);
    } else {
      throw new Error();
    }
  }

  /**
   * Create a new event
   * @param {Object} event - Event details
   * @param {String} token - JWT token
   * @returns {Promise<Array>} Empty array on success or validation errors
   */
  async createEvent(event, token) {
    const response = await this.api('/events', 'POST', event, token);
    if (response.status === 201) {
      return [];
    } else if (response.status === 400) {
      return response.json().then(data => data.errors);
    } else {
      throw new Error('Failed to create event');
    }
  }

  /**
   * Delete an event
   * @param {String} id - Event ID
   * @param {String} token - JWT token
   * @returns {Promise<Array>} Empty array on success or validation errors
   */
  async deleteEvent(id, token) {
    const response = await this.api(`/events/${id}`, 'DELETE', null, token);
    if (response.status === 204) {
      return [];
    } else if (response.status === 400) {
      return response.json().then(data => data.errors);
    } else {
      throw new Error();
    }
  }

  /**
   * Update an existing event
   * @param {String} id - Event ID
   * @param {Object} event - Updated event data
   * @param {String} token - JWT token
   * @returns {Promise<Array>} Empty array on success or validation errors
   */
  async updateEvent(id, event, token) {
    const response = await this.api(`/events/${id}`, 'PUT', event, token);
    if (response.status === 204) {
      return [];
    } else if (response.status === 400) {
      return response.json().then(data => data.errors);
    } else {
      throw new Error();
    }
  }

  /**
   * Retrieve all journals
   * @returns {Promise<Object>} List of journals
   */
  async getJournals() {
    const response = await this.api('/journals', 'GET');
    if (response.status === 200) {
      return response.json().then(data => data);
    } else {
      throw new Error();
    }
  }

  /**
   * Retrieve a journal by ID
   * @param {String} id - Journal ID
   * @returns {Promise<Object>} Journal data
   */
  async getJournal(id) {
    const response = await this.api(`/journals/${id}`, 'GET');
    if (response.status === 200) {
      return response.json().then(data => data);
    } else {
      throw new Error();
    }
  }

  /**
   * Create a new journal entry
   * @param {Object} journal - Journal details
   * @param {String} token - JWT token
   * @returns {Promise<Array>} Empty array on success or validation errors
   */
  async createJournal(journal, token) {
    const response = await this.api('/journals', 'POST', journal, token);
    if (response.status === 201) {
      return [];
    } else if (response.status === 400) {
      return response.json().then(data => data.errors);
    } else {
      throw new Error('Failed to create journal');
    }
  }

  /**
   * Delete a journal
   * @param {String} id - Journal ID
   * @param {String} token - JWT token
   * @returns {Promise<Array>} Empty array on success or validation errors
   */
  async deleteJournal(id, token) {
    const response = await this.api(`/journals/${id}`, 'DELETE', null, token);
    if (response.status === 204) {
      return [];
    } else if (response.status === 400) {
      return response.json().then(data => data.errors);
    } else {
      throw new Error();
    }
  }

  /**
   * Update an existing journal
   * @param {String} id - Journal ID
   * @param {Object} journal - Updated journal data
   * @param {String} token - JWT token
   * @returns {Promise<Array>} Empty array on success or validation errors
   */
  async updateJournal(id, journal, token) {
    const response = await this.api(`/journals/${id}`, 'PUT', journal, token);
    if (response.status === 204) {
      return [];
    } else if (response.status === 400) {
      return response.json().then(data => data.errors);
    } else {
      throw new Error();
    }
  }

  /**
   * Retrieve all conferences
   * @returns {Promise<Object>} List of conferences
   */
  async getConferences() {
    const response = await this.api('/conferences', 'GET');
    if (response.status === 200) {
      return response.json().then(data => data);
    } else {
      throw new Error('Failed to fetch conferences');
    }
  }

  /**
   * Retrieve a conference by ID
   * @param {String} id - Conference ID
   * @returns {Promise<Object>} Conference data
   */
  async getConference(id) {
    const response = await this.api(`/conferences/${id}`, 'GET');
    if (response.status === 200) {
      return response.json().then(data => data);
    } else {
      throw new Error('Failed to fetch conference');
    }
  }

  /**
   * Create a new conference entry
   * @param {Object} conference - Conference details
   * @param {String} token - JWT token
   * @returns {Promise<Array>} Empty array on success or validation errors
   */
  async createConference(conference, token) {
    const response = await this.api('/conferences', 'POST', conference, token);
    if (response.status === 201) {
      return [];
    } else if (response.status === 400) {
      return response.json().then(data => data.errors);
    } else {
      throw new Error('Failed to create conference');
    }
  }

  /**
   * Delete a conference
   * @param {String} id - Conference ID
   * @param {String} token - JWT token
   * @returns {Promise<Array>} Empty array on success or validation errors
   */
  async deleteConference(id, token) {
    const response = await this.api(`/conferences/${id}`, 'DELETE', null, token);
    if (response.status === 204) {
      return [];
    } else if (response.status === 400) {
      return response.json().then(data => data.errors);
    } else {
      throw new Error('Failed to delete conference');
    }
  }

  /**
   * Update an existing conference
   * @param {String} id - Conference ID
   * @param {Object} conference - Updated conference data
   * @param {String} token - JWT token
   * @returns {Promise<Array>} Empty array on success or validation errors
   */
  async updateConference(id, conference, token) {
    const response = await this.api(`/conferences/${id}`, 'PUT', conference, token);
    if (response.status === 204) {
      return [];
    } else if (response.status === 400) {
      return response.json().then(data => data.errors);
    } else {
      throw new Error('Failed to update conference');
    }
  }

  /**
   * Retrieve all books
   * @returns {Promise<Object>} List of books
   */
  async getBooks() {
    const response = await this.api('/books', 'GET');
    if (response.status === 200) {
      return response.json().then(data => data);
    } else {
      throw new Error('Failed to fetch books');
    }
  }

  /**
   * Retrieve a book by ID
   * @param {String} id - Book ID
   * @returns {Promise<Object>} Book data
   */
  async getBook(id) {
    const response = await this.api(`/books/${id}`, 'GET');
    if (response.status === 200) {
      return response.json().then(data => data);
    } else {
      throw new Error('Failed to fetch book');
    }
  }

  /**
   * Create a new book entry
   * @param {Object} book - Book details
   * @param {String} token - JWT token
   * @returns {Promise<Array>} Empty array on success or validation errors
   */
  async createBook(book, token) {
    const response = await this.api('/books', 'POST', book, token);
    if (response.status === 201) {
      return [];
    } else if (response.status === 400) {
      return response.json().then(data => data.errors);
    } else {
      throw new Error('Failed to create book');
    }
  }

  /**
   * Delete a book
   * @param {String} id - Book ID
   * @param {String} token - JWT token
   * @returns {Promise<Array>} Empty array on success or validation errors
   */
  async deleteBook(id, token) {
    const response = await this.api(`/books/${id}`, 'DELETE', null, token);
    if (response.status === 204) {
      return [];
    } else if (response.status === 400) {
      return response.json().then(data => data.errors);
    } else {
      throw new Error('Failed to delete book');
    }
  }

  /**
   * Update an existing book
   * @param {String} id - Book ID
   * @param {Object} book - Updated book data
   * @param {String} token - JWT token
   * @returns {Promise<Array>} Empty array on success or validation errors
   */
  async updateBook(id, book, token) {
    const response = await this.api(`/books/${id}`, 'PUT', book, token);
    if (response.status === 204) {
      return [];
    } else if (response.status === 400) {
      return response.json().then(data => data.errors);
    } else {
      throw new Error('Failed to update book');
    }
  }

  /**
   * Retrieve all patents
   * @returns {Promise<Object>} List of patents
   */
  async getPatents() {
    const response = await this.api('/patents', 'GET');
    if (response.status === 200) {
      return response.json().then(data => data);
    } else {
      throw new Error('Failed to fetch patents');
    }
  }

  /**
   * Retrieve a patent by ID
   * @param {String} id - Patent ID
   * @returns {Promise<Object>} Patent data
   */
  async getPatent(id) {
    const response = await this.api(`/patents/${id}`, 'GET');
    if (response.status === 200) {
      return response.json().then(data => data);
    } else {
      throw new Error('Failed to fetch patent');
    }
  }

  /**
   * Create a new patent entry
   * @param {Object} patent - Patent details
   * @param {String} token - JWT token
   * @returns {Promise<Array>} Empty array on success or validation errors
   */
  async createPatent(patent, token) {
    const response = await this.api('/patents', 'POST', patent, token);
    if (response.status === 201) {
      return [];
    } else if (response.status === 400) {
      return response.json().then(data => data.errors);
    } else {
      throw new Error('Failed to create patent');
    }
  }

  /**
   * Delete a patent
   * @param {String} id - Patent ID
   * @param {String} token - JWT token
   * @returns {Promise<Array>} Empty array on success or validation errors
   */
  async deletePatent(id, token) {
    const response = await this.api(`/patents/${id}`, 'DELETE', null, token);
    if (response.status === 204) {
      return [];
    } else if (response.status === 400) {
      return response.json().then(data => data.errors);
    } else {
      throw new Error('Failed to delete patent');
    }
  }

  /**
   * Update an existing patent
   * @param {String} id - Patent ID
   * @param {Object} patent - Updated patent data
   * @param {String} token - JWT token
   * @returns {Promise<Array>} Empty array on success or validation errors
   */
  async updatePatent(id, patent, token) {
    const response = await this.api(`/patents/${id}`, 'PUT', patent, token);
    if (response.status === 204) {
      return [];
    } else if (response.status === 400) {
      return response.json().then(data => data.errors);
    } else {
      throw new Error('Failed to update patent');
    }
  }
}