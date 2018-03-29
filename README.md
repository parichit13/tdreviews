# Tiger Direct Review Scraping API

This project is built on Node.js and Phantom.js using Express framework.

## Server

Run `node server.js` for a dev server. Navigate to `http://localhost:3000/`.

## Routes

The project is deployed on heroku with the base link: [https://tdreviews.herokuapp.com/](https://tdreviews.herokuapp.com/)

 1. `POST /reviews` - Get all reviews for the provided product page
 2. `POST /reviews?limit={number}` - Get limited reviews for the provided product page based on the number provided.
 
The request takes a JSON post body
```javascript
{
  url: string
}
```

The `url` field must be set with the link of the product page to be scraped for reviews.

The Review object has the following definition:

```javascript
{
  title: string, //title of review
  comment: string, // review text
  reviewer_name: string, // name of reviewer
  rating: number, // overall rating of review
  date: string // date of review as string
}
```