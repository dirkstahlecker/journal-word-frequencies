-- CREATE TABLE names (
--   displayname text,
--   actualname [
--     {
--       firstname: text,
--       lastname: text
--     }
--   ]
-- );



CREATE TABLE names
(
  name_id      SERIAL PRIMARY KEY NOT NULL,
  displayname  text not null
);

CREATE TABLE firstlast
(
  firstandlast_id    SERIAL PRIMARY KEY NOT NULL,
  name_id            integer not null references names(name_id),
  firstname          text not null,
  lastname           text not null
);


-- INSERT INTO firstlast (name_id, firstname, lastname) VALUES
--     ((SELECT name_id FROM names WHERE displayname='dirk'), 'dirk', 'stahlecker');

-- 'psql postgres' to start in command line