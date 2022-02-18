import express from "express";
import auth from './routes/auth'
export = (app: express.Application) => {
    app.use('/auth', auth)
}
