 // task Collection
 const taskCollection = client.db("taskManager").collection("taskList");

 app.post("/task", async (req, res) => {
   const newTask = req.body;
   const result = await taskCollection.insertOne(newTask);
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

 // app.get("/task", async (req, res) => {
 //   const page = parseInt(req.query.page) || 1;
 //   const pageSize = parseInt(req.query.pageSize) || 10;

 //   console.log(page);
 //   console.log(pageSize);

 //   try {
 //     const totalItems = await taskCollection.countDocuments();
 //     const totalPages = Math.ceil(totalItems / pageSize);

 //     const result = await taskCollection
 //       .find()
 //       .skip((page - 1) * pageSize)
 //       .limit(pageSize)
 //       .toArray();

 //     res.json({ data: result, totalPages });
 //     console.log({ data: result, totalPages });
 //   } catch (error) {
 //     res.status(500).json({ error: "Internal Server Error" });
 //   }
 // });

 // app.get("/task", async (req, res) => {
 //   const page = parseInt(req.query.page) || 1;
 //   const pageSize = parseInt(req.query.pageSize) || 10;
 //   const searchQuery = req.query.search || "";

 //   try {
 //     let filter = {};

 //     if (searchQuery) {
 //       filter = { FacilityName: { $regex: new RegExp(searchQuery, "i") } };
 //     }

 //     const totalItems = await taskCollection.countDocuments(filter);
 //     const totalPages = Math.ceil(totalItems / pageSize);

 //     const result = await taskCollection
 //       .find(filter)
 //       .skip((page - 1) * pageSize)
 //       .limit(pageSize)
 //       .toArray();

 //     res.json({ data: result, totalPages });
 //   } catch (error) {
 //     res.status(500).json({ error: "Internal Server Error" });
 //   }
 // });
