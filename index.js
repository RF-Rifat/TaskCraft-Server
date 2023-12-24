const express = require("express");
require("dotenv").config();
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.tryvron.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});
async function run() {
  try {
    // user collection

    const userCollection = client.db("taskManager").collection("userList");

    app.get("/user", async (req, res) => {
      const cursor = userCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.post("/user", async (req, res) => {
      const newUser = req.body;
      const result = await userCollection.insertOne(newUser);
      console.log(result);
      res.send(result);
    });

    app.put("/user/:id", async (req, res) => {
      const userId = req.params.id;
      const filter = { _id: new ObjectId(userId) };
      const options = { upsert: true };
      const updatedUserData = req.body;
      console.log(updatedUserData);
      const user = {
        $set: {
          email: updatedUserData.email,
          name: updatedUserData.name,
          avatar: updatedUserData.avatar,
        },
      };
      const result = await userCollection.updateOne(filter, user, options);
    });

    // update status
    app.put("/user/:id/update-status", async (req, res) => {
      const userId = req.params.id;
      const newStatus = req.body.status;

      const filter = { _id: new ObjectId(userId) };
      const update = { $set: { status: newStatus } };

      try {
        const result = await userCollection.updateOne(filter, update);

        if (result.matchedCount === 0) {
          return res.status(404).json({ message: "User not found" });
        }

        res.json(result);
      } catch (error) {
        console.error("Error updating user status:", error.message);
        res.status(500).json({ message: "Internal server error" });
      }
    });

    //update status by user email query
    app.put("/user/update-status/:email", async (req, res) => {
      const userEmail = req.params.email;
      const newStatus = req.body.status;

      if (!userEmail || !newStatus) {
        return res
          .status(400)
          .json({ message: "Email and status are required" });
      }

      const filter = { email: userEmail };
      const update = { $set: { status: newStatus } };

      try {
        const result = await userCollection.updateOne(filter, update);

        if (result.matchedCount === 0) {
          return res.status(404).json({ message: "User not found" });
        }

        res.json(result);
      } catch (error) {
        console.error("Error updating user status:", error.message);
        res.status(500).json({ message: "Internal server error" });
      }
    });

    // task  req api
    const taskListCollection = client.db("taskManager").collection("taskList");

    app.get("/taskList", async (req, res) => {
      const cursor = taskListCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.post("/taskList", async (req, res) => {
      const newUser = req.body;
      const result = await taskListCollection.insertOne(newUser);
      console.log(result);
      res.send(result);
    });
    // get taskList by user
    app.get("/taskList/:email", async (req, res) => {
      const { email } = req.params;
      const userTask = await taskListCollection.find({ email }).toArray();
      console.log(userTask);
      res.send(userTask);
    });
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Task Manager Server is Running");
});
app.listen(port, () => {
  console.log("Task Manager Server is Running");
});
