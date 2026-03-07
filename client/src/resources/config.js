export const resourceConfig = {

  courses: {
    title: "Course",
    plural: "Courses",

    tableFields: [
      { name: "title", label: "Title" },
      { name: "description", label: "Description" }
    ],

    fields: [
      { name: "title", label: "Title" },
      { name: "description", label: "Description" },
      { name: "estimatedTime", label: "Estimated Time" },
      { name: "materialsNeeded", label: "Materials Needed" }
    ]
  },

  events: {
    title: "Event",
    plural: "Events",

    tableFields: [
      { name: "title", label: "Title" },
      { name: "eventType", label: "Event Type" },
      { name: "eventDate", label: "Event Date", type: "date" },
      { name: "location", label: "Location" }
    ],

    fields: [
      { name: "title", label: "Title" },
      { name: "description", label: "Description" },
      { name: "eventType", label: "Event Type" },
      { name: "participationType", label: "Participation Type" },
      { name: "eventDate", label: "Event Date", type: "date" },
      { name: "location", label: "Location" }
    ]
  },

  journals: {
    title: "Journal",
    plural: "Journals",

    tableFields: [
      { name: "title", label: "Title" },
      { name: "authors", label: "Authors" },
      { name: "publicationDate", label: "Publication Date", type: "date" },
      { name: "journal", label: "Journal" }
    ],

    fields: [
      { name: "title", label: "Title" },
      { name: "authors", label: "Authors" },
      { name: "publicationDate", label: "Publication Date", type: "date" },
      { name: "journal", label: "Journal" },
      { name: "volume", label: "Volume" },
      { name: "issue", label: "Issue" },
      { name: "pages", label: "Pages" },
      { name: "publisher", label: "Publisher" }
    ]
  },

  conferences: {
    title: "Conference",
    plural: "Conferences",

    tableFields: [
      { name: "title", label: "Title" },
      { name: "authors", label: "Authors" },
      { name: "conference", label: "Conference" },
      { name: "publicationDate", label: "Publication Date", type: "date" }
    ],

    fields: [
      { name: "title", label: "Title" },
      { name: "authors", label: "Authors" },
      { name: "conference", label: "Conference" },
      { name: "publicationDate", label: "Publication Date", type: "date" },
      { name: "volume", label: "Volume" },
      { name: "issue", label: "Issue" },
      { name: "pages", label: "Pages" }
    ]
  },

  books: {
    title: "Book",
    plural: "Books",

    tableFields: [
      { name: "title", label: "Title" },
      { name: "authors", label: "Authors" },
      { name: "publicationDate", label: "Publication Date", type: "date" }
    ],

    fields: [
      { name: "title", label: "Title" },
      { name: "authors", label: "Authors" },
      { name: "publicationDate", label: "Publication Date", type: "date" },
      { name: "volume", label: "Volume" },
      { name: "pages", label: "Pages" }
    ]
  },

  patents: {
    title: "Patent",
    plural: "Patents",

    tableFields: [
      { name: "title", label: "Title" },
      { name: "inventors", label: "Inventors" },
      { name: "publicationDate", label: "Publication Date", type: "date" },
      { name: "patentOffice", label: "Patent Office" },
      { name: "patentNumber", label: "Patent Number" }
    ],

    fields: [
      { name: "title", label: "Title" },
      { name: "inventors", label: "Inventors" },
      { name: "publicationDate", label: "Publication Date", type: "date" },
      { name: "patentOffice", label: "Patent Office" },
      { name: "patentNumber", label: "Patent Number" },
      { name: "applicationNumber", label: "Application Number" }
    ]
  }

};