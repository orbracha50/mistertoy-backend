import path from 'path';
import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'

import { toyService } from './api/toy/toy.service.js';
import { loggerService } from './services/logger,service.js';
import { utilService } from './services/util.service.js';
import { authRoutes } from './api/auth/auth.routes.js';
import { userRoutes } from './api/user/user.routes.js';
import { toyRoutes } from './api/toy/toy.routes.js';
const app = express()


app.use(cookieParser())
app.use(express.json())


if (process.env.NODE_ENV === 'production') {
    app.use(express.static('public'))
  } else {
    const corsOptions = {
      origin: [
        'http://127.0.0.1:3030',
        'http://localhost:3030',
        'http://localhost:5173',
        'http://127.0.0.1:5173',
      ],
      credentials: true,
    }
    app.use(cors(corsOptions))
  }

// routes
app.use('/api/auth', authRoutes)
app.use('/api/user', userRoutes)
app.use('/api/toy', toyRoutes)


// REST API for toys

// toy LIST


app.get('/**', (req, res) => {
    res.sendFile(path.resolve('public/index.html'))
})


const PORT = 3030
app.listen(PORT, () =>
    loggerService.info(`Server listening on port http://127.0.0.1:${PORT}/`)
)
