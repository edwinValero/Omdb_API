import express from 'express';
import 'reflect-metadata';
import { createConnection } from 'typeorm';
import moviesRoutes from './routes/moviesRoutes';

const app = express();
createConnection();

// variables
app.set('port', process.env.PORT || 3000);

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// routes
app.use('/movies', moviesRoutes);

app.listen(app.get('port'), () => {
  console.log('Server on port', app.get('port'));
});
