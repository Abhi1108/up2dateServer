const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

app.use(bodyParser.json());
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", req.headers.origin);
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

mongoose.Promise = global.Promise;
mongoose
  .connect(
    "mongodb+srv://abhi123:123Karan321@cluster0-scspx.mongodb.net/users?retryWrites=true&w=majority",
    {
      useNewUrlParser: true
    }
  )
  .catch(err => console.log(err));

const userSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  username: {
    type: String,
    maxLength: 100
  }
});

const User = mongoose.model("User", userSchema);

app.post("/api/register", (req, res) => {
  const user = new User(req.body);

  user.save((err, doc) => {
    if (err) return res.json({ success: false, error: err });
    res.status(200).json({ success: true, user: doc });
  });
});

app.post("/api/login", (req, res) => {
  User.findOne({ email: req.body.email }, (err, user) => {
    if (!user)
      return res.json({
        isAuth: false,
        message: "Auth failed, email not found"
      });

    if (req.body.password != user.password)
      return res.json({
        isAuth: false,
        message: "Auth failed, wrong password"
      });

    res.send({
      isAuth: true,
      username: user.username,
      email: user.email
    });
  });
});

app.get("/api/users", (req, res) => {
  User.find({}, (err, users) => {
    if (err) return res.status(400).send(err);
    res.status(200).json(users);
  });
});

const port = process.env.PORT || 3001;

app.listen(port, () => console.log(`Server running on port ${port}`));
