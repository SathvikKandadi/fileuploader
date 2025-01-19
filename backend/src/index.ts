import express from 'express';
import cors from 'cors';
import router from './routes';

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({extended:false}));

app.use("/api" , router);

app.listen(PORT , () => console.log(`App started on port 3000`));