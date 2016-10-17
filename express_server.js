var express = require("express");
var app = express();
app.set("view engine", "ejs");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcrypt");
app.use(bodyParser.urlencoded());
app.use(cookieParser('warBdur7mw9exxemt3wW6wJh'));
var PORT = process.env.PORT || 8080; // default port 8080

var urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

const data = {
  users: [
    {
      username: 'justin',
      password: '$2a$04$wOM88anyXZgL0Rr13ey7Xu32dknWKigX7JGpW7Jr6gq05R5sHRdOK',
      email: "justin@gmail.com"
    }
  ]
};

// app.use((req, res, next) => {
//   req.cookies = new Cookies( req, res, { "keys": keys } )
//   next();
//  })

// app.get("/", (req, res) => {
//   res.end("Hello! " + req.signedCookies.loginName);
// });

//// Middleware that injects user into request object and template locals
app.get("/welcome", (req, res) => {
  var user = req.signedCookies.loginName;
  var hash = bcrypt.hashSync('testing', 10);
  console.log(hash);
  res.render("urls_welcome", { user: user });
});

app.get("/create-account", (req, res) => {
  res.render("urls_create")
});

app.post("/login", (req, res) => {
  const usr = req.body.username;
  const pwd = req.body.password;
  //finds user by username. client is putting in "usr"
  const user = data.users.find((user) => {return user.username === usr});
  debugger;
  bcrypt.compare(pwd, user.password, (err, matched) => {
    if(matched) {
      console.log('=====> password matched');
      res.cookie("username", req.body.username, { signed: true });
      res.redirect("/urls/new");
    } else {
      res.redirect("/welcome");
    }
  })
});


app.post("/create-account", (req, res) => {
  bcrypt.hash(req.body.password, 10, (err, hash) => {
    if(err) {
      res.send("There was an error creating your account.");
      return;
    }
    data.users.push({username: req.body.username, password: hash, email: req.body.email});
    console.log("All users are: ", data.users);
    res.redirect("/urls");
  });
});

app.use((req, res, next) => {
  if(!req.signedCookies.username) {
    res.redirect("/welcome")
  }
  next();
});

app.get("/urls/new", (req, res) => {
  let templateVars = {
    username: req.signedCookies.username,
    urls: urlDatabase,
    user: data.users,
  };
  console.log("THIS IS HERE: ", req)
  res.render("urls_new", templateVars);
});


app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.end("<html><body>Hello <b>World</b></body></html>\n");
});

app.get("/urls", (req, res) => {
  let templateVars = {
    urls: urlDatabase,
    username: data.users[0].username,
    input: req.body.username
  };
  console.log(templateVars);
  res.render("urls_index", templateVars);
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

app.post("/logout", (req, res) => {
  res.cookie("username", "", {signed: true})
  res.redirect("/welcome")
})

app.post("/urls/:id/edit", (req, res) => {
  urlDatabase[req.params.id] = req.body.editedUrl;
  res.redirect('/urls');
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