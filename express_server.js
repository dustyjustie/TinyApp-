var express = require("express");
var app = express();
app.set("view engine", "ejs");
// const bodyParser = require("body-parser");
// const cookieParser = require("cookie-parser");
app.use(bodyParser.urlencoded());
// app.use(cookieParser('warBdur7mw9exxemt3wW6wJh'));
var PORT = process.env.PORT || 8080; // default port 8080

var urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

// app.use((req, res, next) => {
//   req.cookies = new Cookies( req, res, { "keys": keys } )
//   next();
//  })

app.get("/", (req, res) => {
  res.end("Hello! " + req.signedCookies.loginName);
});

// app.post("/login", (req, res) => {
//   res.cookie("loginName", req.body.username, { signed: true });
//   res.redirect("/urls/new");
// });

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.end("<html><body>Hello <b>World</b></body></html>\n");
});

app.get("/urls", (req, res) => {
  let templateVars = { urls: urlDatabase };
  console.log(templateVars);
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.post("/urls", (req, res) => {
  var newUrl = generateRandomString(6);
  urlDatabase[newUrl] = req.body.longURL  // debug statement to see POST parameters
  res.redirect("/urls/" + newUrl);         // Respond with 'Ok' (we will replace this)
});

// app.post("/urls", (req, res) => {
//   res.direct("/urls");
// });


// "/urs/:keys/:OTHERSHIT"
app.get("/urls/:id", (req, res) => {
  let url = urlDatabase[req.params.id];
  console.log(url);
  res.render("urls_show", {
    url: url,
    shortUrl: req.params.id
  });
});

app.post("/urls/:id/delete", (req, res) => {
  // Do deleting here
  delete urlDatabase[req.params.id];
  res.redirect('/urls')
});

app.post("/urls/:id/edit", (req, res) => {
  urlDatabase[req.params.id] = req.body.editedUrl
  res.redirect('/urls')
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

function generateRandomString () {
  var random = ""
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for( var i=0; i < 6; i++ )
  random += possible.charAt(Math.floor(Math.random() * possible.length));
  return random;

}