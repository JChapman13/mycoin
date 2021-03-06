const User = require("../models/user.js");
const jwt = require("jsonwebtoken"); // import the jwt library
const bcrypt = require("bcrypt"); // import bcrypt

const SALT_ROUNDS = 6;

module.exports = {
  create,
  login,
  edit,
  delete: deleteUser,
  addCoinToUser,
  getUser,
  addParams,
  addNotification,
  deleteWatchlistItem,
  deleteNotification,
};

async function create(req, res) {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, SALT_ROUNDS);
    const user = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
    });
    const token = jwt.sign({ user }, process.env.SECRET, { expiresIn: "24h" });
    res.status(200).json(token);
    console.log("user created", user);
  } catch (err) {
    console.log("user creation error", err);
    res.status(400).json(err);
  }
}

async function edit(req, res) {
  try {
    console.log("Updated Received");
    const hashedPassword = await bcrypt.hash(req.body.password, SALT_ROUNDS);
    const user = await User.findByIdAndUpdate(
      { _id: req.params.id },
      {
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword,
      },
      { returnDocument: "after" }
    );

    console.log("Updated User", user);
    const token = jwt.sign({ user }, process.env.SECRET, {
      expiresIn: "24h",
    });
    res.status(200).json(token);
    console.log("Updated Complete");
  } catch (err) {
    console.log("user update error", err);
    res.status(400).json(err);
  }
}

async function deleteUser(req, res) {
  try {
    console.log("User Delete Request Received");
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    res.status(200).json(deletedUser);
  } catch (err) {
    console.log("user delete error", err);
    res.status(400).json(err);
  }
}

async function login(req, res) {
  console.log(req.body.name);
  try {
    const user = await User.findOne({ name: req.body.name });
    console.log(user);
    // check password. if it's bad throw an error.
    if (!(await bcrypt.compare(req.body.password, user.password)))
      throw new Error("Password incorrect");
    console.log("password okay");
    // if we got to this line, password is ok. give user a new token.
    const token = jwt.sign({ user }, process.env.SECRET, { expiresIn: "24h" });
    res.status(200).json(token);
  } catch (err) {
    res.status(400).json(err);
  }
}
async function getUser(req, res) {
  try {
    const user = await User.findOne({ _id: req.body._id });
    // check password. if it's bad throw an error.
    // if we got to this line, password is ok. give user a new token.
    const token = jwt.sign({ user }, process.env.SECRET, { expiresIn: "24h" });
    res.json(token);
  } catch {
    res.status(400).json("Bad Credentials");
  }
}

async function addCoinToUser(req, res) {
  try {
    const user = await User.findByIdAndUpdate(
      { _id: req.params.id },
      {
        $push: { watchlist: req.body.watchlist },
      },
      { returnDocument: "after" }
    );
    const token = jwt.sign({ user: user }, process.env.SECRET, {
      expiresIn: "24h",
    });
    res.status(200).json(token);
  } catch (err) {
    console.log("user delete error", err);
    res.status(400).json(err);
  }
}

async function addParams(req, res) {
  try {
    console.log(req.body);
    const coin = await User.findOneAndUpdate(
      {
        _id: req.params.id,
        "watchlist._id": req.body._id,
      },
      {
        $set: {
          "watchlist.$.upperLimit": req.body.upperLimit,
          "watchlist.$.lowerLimit": req.body.lowerLimit,
        },
      }
    );
    console.log("coin:", coin);
    const user = await User.findById(req.params.id);
    console.log("user", user);
    const token = jwt.sign({ user: user }, process.env.SECRET, {
      expiresIn: "24h",
    });
    res.status(200).json(token);
  } catch (err) {
    console.log("coin update error", err);
    res.status(400).json(err);
  }
}

async function addNotification(req, res) {
  try {
    const user = await User.findByIdAndUpdate(
      { _id: req.params.id },
      {
        $push: { notifications: req.body },
      },
      { returnDocument: "after" }
    );
    const token = jwt.sign({ user: user }, process.env.SECRET, {
      expiresIn: "24h",
    });
    res.status(200).json(token);
  } catch (err) {
    console.log("user delete error", err);
    res.status(400).json(err);
  }
}

async function deleteWatchlistItem(req, res) {
  try {
    const coin = await User.findByIdAndUpdate(
      { _id: req.params.id },
      {
        $pull: {
          watchlist: {
            _id: req.body._id,
          },
        },
      },
      { returnDocument: "after" }
    );
    console.log(coin, "this is the coin");
    const token = jwt.sign({ user: coin }, process.env.SECRET, {
      expiresIn: "24h",
    });
    res.status(200).json(token);
  } catch (err) {
    console.log("coin update error", err);
    res.status(400).json(err);
  }
}

async function deleteNotification(req, res) {
  try {
    const coin = await User.findByIdAndUpdate(
      { _id: req.params.id },
      {
        $pull: {
          notifications: {
            _id: req.body._id,
          },
        },
      },
      { returnDocument: "after" }
    );
    console.log(coin, "this is the coin");
    const token = jwt.sign({ user: coin }, process.env.SECRET, {
      expiresIn: "24h",
    });
    res.status(200).json(token);
  } catch (err) {
    console.log("coin update error", err);
    res.status(400).json(err);
  }
}
