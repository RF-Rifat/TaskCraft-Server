const express = require("express");
require("dotenv").config();
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
console.log(process.env.DB_PASS, process.env.DB_USER);

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

    // Blood Bag Collection
    const taskCollection = client
      .db("taskManager")
      .collection("taskList");

    app.post("/task", async (req, res) => {
      const newUser = req.body;
      const result = await taskCollection.insertOne(newUser);
      console.log(result);
      res.send(result);
    });

    // app.delete("/bloodBag", async (req, res) => {
    //   try {
    //     const result = await bloodBagCollection.deleteMany({});
    //     res.send(result);
    //   } catch (error) {
    //     console.error("Error deleting documents:", error);
    //     res.status(500).send("Internal Server Error");
    //   }
    // });

    app.get("/task", async (req, res) => {
      const page = parseInt(req.query.page) || 1;
      const pageSize = parseInt(req.query.pageSize) || 10;

      console.log(page);
      console.log(pageSize);

      try {
        const totalItems = await taskCollection.countDocuments();
        const totalPages = Math.ceil(totalItems / pageSize);

        const result = await taskCollection
          .find()
          .skip((page - 1) * pageSize)
          .limit(pageSize)
          .toArray();

        res.json({ data: result, totalPages });
        console.log({ data: result, totalPages });
      } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
      }
    });

    app.get("/task", async (req, res) => {
      const page = parseInt(req.query.page) || 1;
      const pageSize = parseInt(req.query.pageSize) || 10;
      const searchQuery = req.query.search || "";

      try {
        let filter = {};

        if (searchQuery) {
          filter = { FacilityName: { $regex: new RegExp(searchQuery, "i") } };
        }

        const totalItems = await taskCollection.countDocuments(filter);
        const totalPages = Math.ceil(totalItems / pageSize);

        const result = await taskCollection
          .find(filter)
          .skip((page - 1) * pageSize)
          .limit(pageSize)
          .toArray();

        res.json({ data: result, totalPages });
      } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
      }
    });

    // blood donation req api
    const bloodDonationCollection = client
      .db("taskManager")
      .collection("donorList");

    app.get("/bloodDonation", async (req, res) => {
      const cursor = bloodDonationCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.post("/bloodDonation", async (req, res) => {
      const newUser = req.body;
      const result = await bloodDonationCollection.insertOne(newUser);
      console.log(result);
      res.send(result);
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
