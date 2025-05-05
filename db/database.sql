create database pxldb;
\c pxldb

create user secadv with password 'ilovesecurity';
grant all privileges on database pxldb to secadv;
BEGIN;

create table users (id serial primary key, user_name text not null unique, password text not null);
grant all privileges on table users to secadv;

insert into users (user_name, password) values ('pxl-admin', '$2b$10$EbS7FISGcgS4W1CcbbazC.OCH9x8RJaSRGzD51S0J8sd1kKceSoXS') ;
insert into users (user_name, password) values ('george', '$2b$10$W/WpjTPeRQEk3WIo7oqaFOTTPd93WYGJgEdBf8Ihea7xxAnkD.yd6') ;

COMMIT;