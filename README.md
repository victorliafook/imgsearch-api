# imgsearch-api
JS full stack app to seach images through a third-party api

# User Stories
- I can get the image URLs, alt text and page urls for a set of images relating to a given search string.

- I can paginate through the responses by adding a ?offset=2 parameter to the URL.

- I can get a list of the most recently submitted search strings.

# How to use it
use the following routes to use the api:
- api/imgsrc/[what you want to search goes here][?offset=somenumberhere] 
- api/latest

it always returns 10 results per page. The "latest" route returns the latest 10 queries submitted to the api.
