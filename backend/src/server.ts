import express, { Request, Response } from "express";
import cors from 'cors';
const app = express();

app.use(cors({
  origin: 'http://localhost:3000',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}));

const port = 3001;

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

app.get("/users", (req: Request, res: Response) => {
  res.send([
    {
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        email: 'johndoe@gmail.com'
    },
    {
        id: 2,
        firstName: 'Jane',
        lastName: 'Doe',
        email: 'janedoe@gmail.com'
    },
    {
        id: 3,
        firstName: 'Gary',
        lastName: 'Doe',
        email: 'garydoe@gmail.com'
    }
  ]);
});

app.post("/users", (req: Request, res: Response) => {
    try {
        // TODO: create user in MySQL DB
        res.send('User successfully created');
    } catch(err) {
        console.error(err);
        res.send('Error creating user');
    }
});

app.put("/users/:id", (req: Request, res: Response) => {
  const {id} = req.params;
  try {
      // TODO: update user in MySQL DB
      res.send('User successfully updated');
  } catch(err) {
      console.error(err);
      res.send('Error updating user');
  }
});

app.delete("/users/:id", (req: Request, res: Response) => {
  const {id} = req.params;
  try {
      // TODO: delete user in MySQL DB
      res.send('User successfully deleted');
  } catch(err) {
      console.error(err);
      res.send('Error deleting user');
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
