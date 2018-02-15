CREATE TABLE User(
  username VARCHAR(20),
  password VARCHAR(20),
  first_name VARCHAR(20),
  isAdmin BOOLEAN,
  isActive BOOLEAN,
  joined TIMESTAMP,
  PRIMARY KEY (username)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE Post(
  date TIMESTAMP,
  username VARCHAR(20),
  post_count int,
  FOREIGN KEY (username) REFERENCES User (username)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE Neomail(
  id INT AUTO_INCREMENT,
  date TIMESTAMP,
  sender VARCHAR(20),
  receiver VARCHAR(20),
  subj_line VARCHAR(30),
  content VARCHAR(1400),
  PRIMARY KEY (id), 
  FOREIGN KEY (sender) REFERENCES User (username),
  FOREIGN KEY (receiver) REFERENCES User (username)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE Week(
  id INT AUTO_INCREMENT,
  week TIMESTAMP,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
