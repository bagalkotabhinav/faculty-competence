CREATE TABLE `Users` (
  `id` INTEGER NOT NULL AUTO_INCREMENT,
  `designation` VARCHAR(255) NULL,
  `firstName` VARCHAR(255) NOT NULL,
  `lastName` VARCHAR(255) NOT NULL,
  `emailAddress` VARCHAR(255) NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `affiliation` VARCHAR(100) NULL,
  `areasOfInterest` VARCHAR(255) NULL,
  `homepage` VARCHAR(255) NULL,
  `createdAt` DATETIME NOT NULL,
  `updatedAt` DATETIME NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_address_unique` (`emailAddress`)
) ENGINE=InnoDB;

CREATE TABLE `Courses` (
  `id` INTEGER NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(255) NOT NULL,
  `description` TEXT NOT NULL,
  `estimatedTime` VARCHAR(255) NULL,
  `materialsNeeded` VARCHAR(255) NULL,
  `userid` INTEGER NULL,
  `createdAt` DATETIME NOT NULL,
  `updatedAt` DATETIME NOT NULL,
  PRIMARY KEY (`id`),
  KEY `courses_userid_idx` (`userid`),
  CONSTRAINT `courses_userid_fk` FOREIGN KEY (`userid`) REFERENCES `Users` (`id`)
    ON UPDATE CASCADE ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE `Events` (
  `id` INTEGER NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(255) NOT NULL,
  `description` TEXT NOT NULL,
  `eventType` VARCHAR(255) NOT NULL,
  `participationType` VARCHAR(255) NOT NULL,
  `eventDate` DATETIME NOT NULL,
  `location` VARCHAR(255) NOT NULL,
  `userid` INTEGER NOT NULL,
  `createdAt` DATETIME NOT NULL,
  `updatedAt` DATETIME NOT NULL,
  PRIMARY KEY (`id`),
  KEY `events_userid_idx` (`userid`),
  CONSTRAINT `events_userid_fk` FOREIGN KEY (`userid`) REFERENCES `Users` (`id`)
    ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE `Journals` (
  `id` INTEGER NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(255) NOT NULL,
  `authors` VARCHAR(255) NOT NULL,
  `publicationDate` DATETIME NOT NULL,
  `journal` VARCHAR(255) NOT NULL,
  `volume` VARCHAR(255) NULL,
  `issue` VARCHAR(255) NULL,
  `pages` VARCHAR(255) NULL,
  `publisher` VARCHAR(255) NOT NULL,
  `userid` INTEGER NOT NULL,
  `createdAt` DATETIME NOT NULL,
  `updatedAt` DATETIME NOT NULL,
  PRIMARY KEY (`id`),
  KEY `journals_userid_idx` (`userid`),
  CONSTRAINT `journals_userid_fk` FOREIGN KEY (`userid`) REFERENCES `Users` (`id`)
    ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE `Conferences` (
  `id` INTEGER NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(255) NOT NULL,
  `authors` VARCHAR(255) NOT NULL,
  `publicationDate` DATETIME NOT NULL,
  `conference` VARCHAR(255) NOT NULL,
  `volume` VARCHAR(255) NULL,
  `issue` VARCHAR(255) NULL,
  `pages` VARCHAR(255) NULL,
  `userid` INTEGER NOT NULL,
  `createdAt` DATETIME NOT NULL,
  `updatedAt` DATETIME NOT NULL,
  PRIMARY KEY (`id`),
  KEY `conferences_userid_idx` (`userid`),
  CONSTRAINT `conferences_userid_fk` FOREIGN KEY (`userid`) REFERENCES `Users` (`id`)
    ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE `Books` (
  `id` INTEGER NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(255) NOT NULL,
  `authors` VARCHAR(255) NOT NULL,
  `publicationDate` DATETIME NOT NULL,
  `volume` VARCHAR(255) NULL,
  `pages` VARCHAR(255) NOT NULL,
  `userid` INTEGER NOT NULL,
  `createdAt` DATETIME NOT NULL,
  `updatedAt` DATETIME NOT NULL,
  PRIMARY KEY (`id`),
  KEY `books_userid_idx` (`userid`),
  CONSTRAINT `books_userid_fk` FOREIGN KEY (`userid`) REFERENCES `Users` (`id`)
    ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE `Patents` (
  `id` INTEGER NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(255) NOT NULL,
  `inventors` VARCHAR(255) NOT NULL,
  `publicationDate` DATETIME NOT NULL,
  `patentOffice` VARCHAR(255) NOT NULL,
  `patentNumber` VARCHAR(255) NOT NULL,
  `applicationNumber` VARCHAR(255) NOT NULL,
  `userid` INTEGER NOT NULL,
  `createdAt` DATETIME NOT NULL,
  `updatedAt` DATETIME NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `patents_patent_number_unique` (`patentNumber`),
  UNIQUE KEY `patents_application_number_unique` (`applicationNumber`),
  KEY `patents_userid_idx` (`userid`),
  CONSTRAINT `patents_userid_fk` FOREIGN KEY (`userid`) REFERENCES `Users` (`id`)
    ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB;
