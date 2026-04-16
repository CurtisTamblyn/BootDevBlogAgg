## Boot.dev Guided Project: Blog Aggregator

A simple RSS feed aggregator written in TypeScript for Node 22.15.0. This is the result of a guided project of [Boot.dev](https://www.boot.dev) for learning backend TypeScript. It is a CLI application that takes various commands to register users, add RSS feeds, save them to a local Postgresql database, and allow the user to view the saved posts.

### Commands

#### help
"help" lists all commands with their description of what they do.
It takes no parameters.

#### register
"register" creates a new user. A user is required to associate with RSS feeds and posts and the blog aggregator will not function without a user.
It takes one parameter: The username to register.

#### login
"login" logs the user in as the provied username. There is no authentication for this project, so only a username is required to log in.
It takes one parameter: 
1. The username to log in as.

#### users
"users" lists all registered users in the database. It is used for testing purposes.
It takes no parameters.

#### addfeed
"addfeed" adds a URL pointing to a RSS feed to the database. Feeds are pulled and parsed as a RSS XML string and saved in the database by the "agg" command.
The creator of a feed automatically follows their feed.
It takes two parameters:
1. The name of the feed. This is user-defined and must be supplied.
2. The URL to the feed. The feed is not checked to exist or parsable at this time. The URL is also required to be unique, as feeds are tied to their creator user, likely to take advantage of a cascade delete of users to also delete feeds.

#### feeds
"feeds" displays all the saved feeds, their name, URL, and the name of the user who created them. It is used for testing purposes.
It takes no parameters.

#### follow
"follow" makes the current logged in user to follow a feed. This determines which feeds they view with the "browse" command.
When a user creates a feed with the "addfeed" command, they automatically follow it.
It takes one parameter:
1. The URL of the RSS feed to follow. The feed must already exist in the database with the "addfeed" command.

#### unfollow
"unfollow" removes the logged in user from following a feed.
It takes one parameter:
1. The URL of the RSS feed to follow. The feed must already exist in the database with the "addfeed" command.

#### following
"following" displays all feeds the current logged in user is following.
It takes no parameters.

#### browse
"browse" shows all saved posts from the "agg" service for the logged in user.
It takes two parameters.
1. The number of RSS posts to view. This parameter is optional and defaults to 2 if a value is not supplied.
2. The offset of RSS posts to view. This parameter is optional and defaults to 0 if a value is not supplied.

#### agg
"agg" starts the aggregation service. It will run a loop of every RSS feed in the database, with the oldest feeds first, and pull and parse the RSS feed. It will then save each RSS post in the database. It checks one RSS feed at a time, to avoid DOS'ing the servers tested against.
It is not set to parse RSS feeds that exceed 1,000 lines.
The service repeats until it is terminated with a CTRL+C command from the terminal.
It takes one parameter:
1. A time unit interval in the format of value followed by a time unit, acceping ms, s, m, h. It is case sensitive. To prevent DOS situations for this project, it has a minimum time interval of 10 seconds.
  Example time parameters: 5s  10m  300h

#### reset
"reset" deletes all users from the database, and accordingly cascades through the rest of the database to delete all RSS feeds and posts accordingly. Used for testing purposes.
It takes no parameters.
