import config from './config';

export default class Data {
  /**
   * Function to make Fetch requests to our custom REST API
   * @param {*} path - route or path to API endpoint e.g. /courses, /users
   * @param {*} method - e.g. POST, GET
   * @param {*} body - body of the request (optional)
   * @param {*} requiresAuth - whether the API request requires authentication
   * @param {*} credentials - if API request requires authentication, enter in user's credentials (username/email address and password)
   * @returns {function} Make the Fetch API request
   */
  api(path, method = 'GET', body = null, requiresAuth = false, credentials = null) {
    const url = config.apiBaseUrl + path;

    const options = {
      method,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
    };

    if (body !== null) {
      options.body = JSON.stringify(body);
    }

    if (requiresAuth) {
      const encodedCredentials = btoa(`${credentials.username}:${credentials.password}`);
      options.headers['Authorization'] = `Basic ${encodedCredentials}`;
    }
    return fetch(url,options);
  }

  /**
   * Get the user from the database for Sign In
   * @param {String} username - for Authentication, the user's email address acts as the "username"
   * @param {String} password 
   * @returns API response if successful
   */
  async getUser(username, password) {
    const response = await this.api(`/users`, 'GET', null, true, { username, password });
    if (response.status === 200) {
      return response.json().then(data => data);
    }
    else if (response.status === 401) {
      return response.json().then(message => message);
    }
    else {
      throw new Error();
    }
  }

  /**
   * Create a new user in the database
   * @param {Object} user 
   * @returns empty response if successful
   */
  async createUser(user) {
    const response = await this.api('/users', 'POST', user);
    if (response.status === 201) {
      return [];
    }
    else if (response.status === 400) {
      return response.json().then(data => {
        return data.errors;
      });
    }
    else {
      throw new Error();
    }
  }

/**
 * Update a particular user
 * @param {String} id - User ID
 * @param {Object} user - with updated firstName, lastName, affiliation, areaOfInterest, homepage, and optionally password
 * @param {String} username - user's email address
 * @param {String} password - user's current password for authentication
 * @returns empty response if successful
 */
async updateUser(id, user, username, password) {
  const response = await this.api(`/users/${id}`, 'PUT', user, true, { username, password });
  if (response.status === 204) {
    return [];
  } else if (response.status === 400) {
    return response.json().then(data => data.errors);
  } else if (response.status === 401) {
    throw new Error('Unauthorized access');
  } else if (response.status === 403) {
    throw new Error('Forbidden access');
  } else {
    throw new Error('Failed to update user');
  }
}



  /**
   * Get all available courses
   * @returns API response if successful
   */
  async getCourses() {
    const response = await this.api('/courses', 'GET', null, false);
    if (response.status === 200) {
      return response.json().then(data => data);
    } else {
      throw new Error();
    }
  }

  /**
   * Get a specific course by id
   * @param {String} id - Course ID
   * @returns API response if successful
   */
  async getCourse(id) {
    const response = await this.api(`/courses/${id}`, 'GET', null, false);
    if (response.status === 200) {
      return response.json().then(data => data);
    } else {
      throw new Error();
    }
  }

  /**
   * Create a new course
   * @param {Object} course - with title, description, estimated time and materials needed
   * @param {String} username - user's email address
   * @param {String} password 
   * @returns empty response if successful
   */
  async createCourse(course, username, password) {
    const response = await this.api('/courses', 'POST', course, true, { username, password });
    if (response.status === 201) {
      return [];
    }
    else if (response.status === 400) {
      return response.json().then(data => {
        return data.errors;
      });
    }
    else {
      throw new Error();
    }
  }

  /**
   * Delete a specific course
   * Only users who are authors of the course are authorised to delete the course
   * @param {String} id - Course ID
   * @param {String} username - user's email address
   * @param {String} password 
   * @returns empty response if successful
   */
  async deleteCourse(id, username, password) {
    const response = await this.api(`/courses/${id}`, 'DELETE', null, true, { username, password });
    if (response.status === 204) {
      return [];
    }
    else if (response.status === 400) {
      return response.json().then(data => {
        return data.errors;
      });
    }
    else {
      throw new Error();
    }
  }

  /**
   * Update a particular course
   * @param {String} id - Course ID
   * @param {Object} course - with updated title, description, estimated time and materials needed
   * @param {String} username - user's email address
   * @param {String} password 
   * @returns empty response if successful
   */
  async updateCourse(id, course, username, password) {
    const response = await this.api(`/courses/${id}`, 'PUT', course, true, { username, password });
    if (response.status === 204) {
      return [];
    }
    else if (response.status === 400) {
      return response.json().then(data => {
        return data.errors;
      });
    }
    else {
      throw new Error();
    }
  }

  


      /**
     * Get all available events
     * @returns API response if successful
     */
    async getEvents() {
      const response = await this.api('/events', 'GET', null, false);
      if (response.status === 200) {
        return response.json().then(data => data);
      } else {
        throw new Error();
      }
    }

    /**
     * Get a specific event by id
     * @param {String} id - Event ID
     * @returns API response if successful
     */
    async getEvent(id) {
      const response = await this.api(`/events/${id}`, 'GET', null, false);
      if (response.status === 200) {
        return response.json().then(data => data);
      } else {
        throw new Error();
      }
    }

    /**
 * Create a new event
 * @param {Object} event - with event details such as title, description, event type, participation type, event date, and location
 * @param {String} username - user's email address
 * @param {String} password 
 * @returns empty response if successful
 */
async createEvent(event, username, password) {
  const response = await this.api('/events', 'POST', event, true, { username, password });
  if (response.status === 201) {
    return [];
  } else if (response.status === 400) {
    return response.json().then(data => {
      return data.errors;
    });
  } else {
    console.error('Failed to create event. Status:', response.status);
    throw new Error('Failed to create event');
  }
}


    /**
     * Delete a specific event
     * Only users who created the event are authorized to delete it
     * @param {String} id - Event ID
     * @param {String} username - user's email address
     * @param {String} password 
     * @returns empty response if successful
     */
    async deleteEvent(id, username, password) {
      const response = await this.api(`/events/${id}`, 'DELETE', null, true, { username, password });
      if (response.status === 204) {
        return [];
      }
      else if (response.status === 400) {
        return response.json().then(data => {
          return data.errors;
        });
      }
      else {
        throw new Error();
      }
    }

    /**
     * Update a particular event
     * @param {String} id - Event ID
     * @param {Object} event - with updated event details such as title, description, event type, participation type, event date, and location
     * @param {String} username - user's email address
     * @param {String} password 
     * @returns empty response if successful
     */
    async updateEvent(id, event, username, password) {
      const response = await this.api(`/events/${id}`, 'PUT', event, true, { username, password });
      if (response.status === 204) {
        return [];
      }
      else if (response.status === 400) {
        return response.json().then(data => {
          return data.errors;
        });
      }
      else {
        throw new Error();
      }
    }


        /**
     * Get all available journals
     * @returns API response if successful
     */
    async getJournals() {
      const response = await this.api('/journals', 'GET', null, false);
      if (response.status === 200) {
        return response.json().then(data => data);
      } else {
        throw new Error();
      }
    }

    /**
     * Get a specific journal by id
     * @param {String} id - Journal ID
     * @returns API response if successful
     */
    async getJournal(id) {
      const response = await this.api(`/journals/${id}`, 'GET', null, false);
      if (response.status === 200) {
        return response.json().then(data => data);
      } else {
        throw new Error();
      }
    }

    /**
     * Create a new journal entry
     * @param {Object} journal - with journal details such as title, authors, journal, volume, issue, pages, publication date, publisher
     * @param {String} username - user's email address
     * @param {String} password 
     * @returns empty response if successful
     */
    async createJournal(journal, username, password) {
      const response = await this.api('/journals', 'POST', journal, true, { username, password });
      if (response.status === 201) {
        return [];
      } else if (response.status === 400) {
        return response.json().then(data => {
          return data.errors;
        });
      } else {
        console.error('Failed to create journal. Status:', response.status);
        throw new Error('Failed to create journal');
      }
    }

    /**
     * Delete a specific journal
     * Only users who created the journal are authorized to delete it
     * @param {String} id - Journal ID
     * @param {String} username - user's email address
     * @param {String} password 
     * @returns empty response if successful
     */
    async deleteJournal(id, username, password) {
      const response = await this.api(`/journals/${id}`, 'DELETE', null, true, { username, password });
      if (response.status === 204) {
        return [];
      }
      else if (response.status === 400) {
        return response.json().then(data => {
          return data.errors;
        });
      }
      else {
        throw new Error();
      }
    }

    /**
     * Update a particular journal
     * @param {String} id - Journal ID
     * @param {Object} journal - with updated journal details such as title, authors, journal, volume, issue, pages, publication date, publisher
     * @param {String} username - user's email address
     * @param {String} password 
     * @returns empty response if successful
     */
    async updateJournal(id, journal, username, password) {
      const response = await this.api(`/journals/${id}`, 'PUT', journal, true, { username, password });
      if (response.status === 204) {
        return [];
      }
      else if (response.status === 400) {
        return response.json().then(data => {
          return data.errors;
        });
      }
      else {
        throw new Error();
      }
    }


          /**
       * Get all available conferences
       * @returns API response if successful
       */
      async getConferences() {
        const response = await this.api('/conferences', 'GET', null, false);
        if (response.status === 200) {
          return response.json().then(data => data);
        } else {
          throw new Error('Failed to fetch conferences');
        }
      }

      /**
       * Get a specific conference by id
       * @param {String} id - Conference ID
       * @returns API response if successful
       */
      async getConference(id) {
        const response = await this.api(`/conferences/${id}`, 'GET', null, false);
        if (response.status === 200) {
          return response.json().then(data => data);
        } else {
          throw new Error('Failed to fetch conference');
        }
      }

      /**
       * Create a new conference entry
       * @param {Object} conference - with conference details such as title, authors, conference, volume, issue, pages, publication date
       * @param {String} username - user's email address
       * @param {String} password - user's password
       * @returns empty response if successful
       */
      async createConference(conference, username, password) {
        const response = await this.api('/conferences', 'POST', conference, true, { username, password });
        if (response.status === 201) {
          return [];
        } else if (response.status === 400) {
          return response.json().then(data => {
            return data.errors;
          });
        } else {
          console.error('Failed to create conference. Status:', response.status);
          throw new Error('Failed to create conference');
        }
      }

      /**
       * Delete a specific conference
       * Only users who created the conference are authorized to delete it
       * @param {String} id - Conference ID
       * @param {String} username - user's email address
       * @param {String} password - user's password
       * @returns empty response if successful
       */
      async deleteConference(id, username, password) {
        const response = await this.api(`/conferences/${id}`, 'DELETE', null, true, { username, password });
        if (response.status === 204) {
          return [];
        } else if (response.status === 400) {
          return response.json().then(data => {
            return data.errors;
          });
        } else {
          throw new Error('Failed to delete conference');
        }
      }

      /**
       * Update a particular conference
       * @param {String} id - Conference ID
       * @param {Object} conference - with updated conference details such as title, authors, conference, volume, issue, pages, publication date
       * @param {String} username - user's email address
       * @param {String} password - user's password
       * @returns empty response if successful
       */
      async updateConference(id, conference, username, password) {
        const response = await this.api(`/conferences/${id}`, 'PUT', conference, true, { username, password });
        if (response.status === 204) {
          return [];
        } else if (response.status === 400) {
          return response.json().then(data => {
            return data.errors;
          });
        } else {
          throw new Error('Failed to update conference');
        }
      }

      /**
 * Get all available books
 * @returns API response if successful
 */
async getBooks(username, password) {
  const response = await this.api('/books', 'GET', null, true, { username, password });
  if (response.status === 200) {
    return response.json().then(data => data);
  } else {
    throw new Error('Failed to fetch books');
  }
}

/**
 * Get a specific book by id
 * @param {String} id - Book ID
 * @returns API response if successful
 */
async getBook(id,username,password) {
  const response = await this.api(`/books/${id}`, 'GET', null, true, {username, password});
  if (response.status === 200) {
    return response.json().then(data => data);
  } else {
    throw new Error('Failed to fetch book');
  }
}

/**
 * Create a new book entry
 * @param {Object} book - with book details such as title, authors, volume, pages, publication date
 * @param {String} username - user's email address
 * @param {String} password - user's password
 * @returns empty response if successful
 */
async createBook(book, username, password) {
  const response = await this.api('/books', 'POST', book, true, { username, password });
  if (response.status === 201) {
    return [];
  } else if (response.status === 400) {
    return response.json().then(data => {
      return data.errors;
    });
  } else {
    console.error('Failed to create book. Status:', response.status);
    throw new Error('Failed to create book');
  }
}

/**
 * Delete a specific book
 * Only users who created the book are authorized to delete it
 * @param {String} id - Book ID
 * @param {String} username - user's email address
 * @param {String} password - user's password
 * @returns empty response if successful
 */
async deleteBook(id, username, password) {
  const response = await this.api(`/books/${id}`, 'DELETE', null, true, { username, password });
  if (response.status === 204) {
    return [];
  } else if (response.status === 400) {
    return response.json().then(data => {
      return data.errors;
    });
  } else {
    throw new Error('Failed to delete book');
  }
}

/**
 * Update a particular book
 * @param {String} id - Book ID
 * @param {Object} book - with updated book details such as title, authors, volume, pages, publication date
 * @param {String} username - user's email address
 * @param {String} password - user's password
 * @returns empty response if successful
 */
async updateBook(id, book, username, password) {
  const response = await this.api(`/books/${id}`, 'PUT', book, true, { username, password });
  if (response.status === 204) {
    return [];
  } else if (response.status === 400) {
    return response.json().then(data => {
      return data.errors;
    });
  } else {
    throw new Error('Failed to update book');
  }
}



/**
 * Get all available patents
 * @returns API response if successful
 */
async getPatents() {
  const response = await this.api('/patents', 'GET', null, false);
  if (response.status === 200) {
    return response.json().then(data => data);
  } else {
    throw new Error('Failed to fetch patents');
  }
}

/**
 * Get a specific patent by id
 * @param {String} id - Patent ID
 * @returns API response if successful
 */
async getPatent(id) {
  const response = await this.api(`/patents/${id}`, 'GET', null, false);
  if (response.status === 200) {
    return response.json().then(data => data);
  } else {
    throw new Error('Failed to fetch patent');
  }
}

/**
 * Create a new patent entry
 * @param {Object} patent - with patent details such as title, inventors, publicationDate, patentOffice, patentNumber, applicationNumber
 * @param {String} username - user's email address
 * @param {String} password - user's password
 * @returns empty response if successful
 */
async createPatent(patent, username, password) {
  const response = await this.api('/patents', 'POST', patent, true, { username, password });
  if (response.status === 201) {
    return [];
  } else if (response.status === 400) {
    return response.json().then(data => {
      return data.errors;
    });
  } else {
    console.error('Failed to create patent. Status:', response.status);
    throw new Error('Failed to create patent');
  }
}

/**
 * Delete a specific patent
 * Only users who created the patent are authorized to delete it
 * @param {String} id - Patent ID
 * @param {String} username - user's email address
 * @param {String} password - user's password
 * @returns empty response if successful
 */
async deletePatent(id, username, password) {
  const response = await this.api(`/patents/${id}`, 'DELETE', null, true, { username, password });
  if (response.status === 204) {
    return [];
  } else if (response.status === 400) {
    return response.json().then(data => {
      return data.errors;
    });
  } else {
    throw new Error('Failed to delete patent');
  }
}

/**
 * Update a particular patent
 * @param {String} id - Patent ID
 * @param {Object} patent - with updated patent details such as title, inventors, publicationDate, patentOffice, patentNumber, applicationNumber
 * @param {String} username - user's email address
 * @param {String} password - user's password
 * @returns empty response if successful
 */
async updatePatent(id, patent, username, password) {
  const response = await this.api(`/patents/${id}`, 'PUT', patent, true, { username, password });
  if (response.status === 204) {
    return [];
  } else if (response.status === 400) {
    return response.json().then(data => {
      return data.errors;
    });
  } else {
    throw new Error('Failed to update patent');
  }
}

}

