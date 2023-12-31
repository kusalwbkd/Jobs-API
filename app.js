require('dotenv').config();
require('express-async-errors');
const express = require('express');


//extra security packages

const helmet=require('helmet')
const cors=require('cors')
const xss=require('xss-clean')
const rateLimiter=require('express-rate-limit')



const app = express();


const connectDB=require('./db/connect')
//routers

const authenticatedUser=require('./middleware/authentication')
const authRouter=require('./routes/auth')
const jobsRouter=require('./routes/jobs')


// error handler
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

app.use(express.json());

// extra packages

app.set('trust proxy',1)
app.use(rateLimiter({
	windowMs: 15 * 60 * 1000, // 15 minutes
	limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
	standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
	// store: ... , // Use an external store for consistency across multiple server instances.
}))
app.use(helmet())
app.use(cors())
app.use(xss())

// routes
app.use('/api/v1/auth',authRouter)
app.use('/api/v1/jobs',authenticatedUser,jobsRouter)
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);


app.get('/', (req, res) => {
  res.send('<h1>Jobs API</h1>');
});

const port = process.env.PORT || 5000;

const start = async () => {
  try {

    await connectDB(process.env.MONGO_URI)
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();