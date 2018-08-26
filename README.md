# Birdview
This is the backend service for birdview.

*Birdview* is an application that helps law enforcements and parents locate missing loved ones more efficiently and in a short period of time. It uses Computer Vision and Natural Language Processing to detect potential matches with reported cases.

Parents can report a case with picture and information about their missing kids. Once BirdView receives the report, it starts matching it with data from social networks and send any potential results soleley to law enforcements in order to preserve the privacy and security of everyone.

Police officers and query our database for potentail matches to assess the cases and pick up any clues to where they can locate missing people.

This service supports the following endpoints:
/profiles To view/report missing kids
/journal To view potential matches for missing kids

To run:
```
git clone https://github.com/birdviewHackThe6ix/backend.git
cd backend

npm install
npm start
```

The service listens on link: http://localhost:3001/