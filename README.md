# VistaPath Challenge - Front End

This is the front end repository for the Vistapath challenge. This repo is one of a pair. For the back end, see
[https://github.com/howardreith/vistapathChallengeBackEnd](https://github.com/howardreith/vistapathChallengeBackEnd)

## Instructions for running

1. Follow instructions for starting the back end as available in the Readme for the repo linked above.
2. Install dependencies with `yarn install` or `npm install`.
3. In the root directory, create a file `.env` with the following:
```
REACT_APP_BACKEND_URL="http://localhost:8080"
```
If you boot your node server at another local host, obviously this value will need to be different.

4. Start the local server with `yarn start` or `npm run start`. This will boot up the webpack server at localhost:3000.

Note that the back end CORS setup is expecting requests from localhost:3000. If you use a different port, make sure
to address as much in your .env file for the back end.

## Instructions for running tests

1. With dependencies installed, run `yarn test` or `npm run test`.

## Discussion

### Architecture

#### Front End

I am using React for its relative ease of state management and surgical DOM updates. Since there is a fair amount of
state modification occurring both via server updates and user actions, a framework like React is a reasonable choice.

Since the state management needs of this app are simple, and the circumstances for re-rendering few,
I did not feel the need for any heavy state management libraries or even the use of a context provider.
All state could be adequately managed via local useState hooks.

I am using the Material UI styling library for relative ease of styling.

Since I am the only person working in this code base, I did not feel the need to employ Typescript, though
I am using React propTypes to enforce some prop validation.

I am using the react-dropzone library for file uploads, 'cause I'm not writing that for a code challenge.

#### Back End

Seeing as how this is little more than a CRUD app I saw no cause to employ a framework other than Node. I'm sending
JSON over the web, might as well write the app in Javascript.

Since the actions are literally ordinary CRUD actions, I saw no reason to employ any means beyond REST at this time.
I thus followed an ordinary Controller / Service / Repository layer pattern (with the repository layer being satisfied
with my Mongoose models).

#### Database

I observed the following requirements:

* Data will be nested and require some degree of querying power.
* Users will be actively updating the data.
* In terms of CAP, since no priority was recommended, decided to prioritize availability over consistency at this time.
* I found the data simply easiest to visualize as a document.

Since users will be updating data, some sort of database technology is necessary. That is to say, since the data is
not static, it would not make sense to just store it in a CSV and read it into memory or something like that. The
data must be persisted and updated in real-time.

Since the data is nested, a key-value store DB like Redis or Riak did not seem appropriate. The data did not seem
reasonably modeled as a Graph, so a Graph DB seems inappropriate. Since we will not be focusing heavily on data
analysis, a columnar database did not seem appropriate either.

So as is often the case I was left choosing between relational and document DBs. If I knew consistency was a
strong requirement, I would have gone relational, probably SQLite or Postgres depending on how heavy I thought
my queries would be. However, since this data seems easily representable as a document, and since I could see
an argument for prioritizing availability, I ultimately went with MongoDB accessed through Mongoose.

#### Testing

I am using Jest for front and back-end testing. I am somewhat regretting this decision, at least on the back end,
as jest does not play well with the latest version of Node. This is discussed in the TODOs below.
I am using react-testing-library for React testing and shelf for in-memory mongo testing.

#### Notable Decisions

I opted to store my image files in a dedicated S3 bucket. I inquired before working on the project
if there were any security requirements for said images and was told no. Shifting the burden of
storage and serving those images to the S3 server thus saves my server a great deal of load. This should be faster
and more maintainable than if I stored my images on the server with my data.

I am using the AirBNB linter to keep me honest and my code relatively clean and adhering to standards.

I am only updating local state with changes made by the active user. I did not think it appropriate to re-fetch
the entire database every time the user makes a change. As I mention in the TODOs below, a websocket connection
should be present to push changes from other users.

I am assuming a relatively small data set, which is why I do no pagination for the back end requests
or for what is displayed in the table. If the data set is very large, the filtering I presently do in the
front end will need to be shifted to the back end.

### Notable things still to do

* The page is clearly not very beautiful as of yet. It could use some prettifying, such as making an image carousel,
making a modal to display full-sized images rather than redirecting to S3, and more.
* My code coverage, especially on the front end, is poor. I need to write a great deal more unit tests.
* My components are a bit verbose. They can be broken up into smaller components and more succinctly unit tested.
The editing form vs. the case analysis display view, for example, should be split into separate sub-components.
* It is possible for other users to update data while I am using the app, and the present implementation will not
push these updates to the UI. I would like to implement a websocket to guarantee real-time data updates.
* I am presently not deleting files out of my S3 server when a user deletes a previously uploaded image. This should
be fixed.
* The present version of Node's module functionality doesn't play well with jest mocking, thus I was having a hard time 
mocking out my S3 upload helper module to prevent my tests from trying to upload to my S3 bucket when they ran. This
needs to be resolved and proper tests for both uploading and including image files need to be written.
* I do not have hardly anything in the way of error handling at the moment. I assume happy path for basically
all back end requests. This should be remedied.
* Some of my object propTypes are just empty shapes. They should be fleshed out.
* I am presently only enforcing status change limitations on the front end. The back end should throw
errors if an invalid status change is attempted.
* I don't presently have any loading animations. That should be fixed.
* My timestamps are raw ISO timestamps. They should be more human-friendly.
