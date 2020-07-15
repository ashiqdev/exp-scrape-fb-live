## Bikoy.com adds

from root folder give this command:

```
node bikroy.js
```

## FETCH INFO FROM URLS USING QUEUE AND MORE
### FROM url-api folder give this command

`DEBUG=scraper dotenv -e .env nodemon scraper.js`

### You can use curl to hit the api

### To creatre/add bunch of request at a time, go to url-api folder from your terminal and paste those:

```
curl "http://localhost:3000/add?url=example.com"
curl "http://localhost:3000/add?url=example.net"
curl "http://localhost:3000/add?url=example.org"
curl "http://localhost:3000/add?url=bikroy.com"
curl "http://localhost:3000/add?url=google.com"
```

### To get a single item:

```
curl "http://localhost:3000/site/id"
```
you can get the id from your database gui. I used mongodb atlas as database connection string. so I found it there.


### To get all items
 ```curl "http://localhost:3000"``` 


