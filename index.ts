import express, { Response, Request} from 'express';
import { randomBytes } from 'crypto'
import session from 'express-session';
import router from './router'
const app: express.Application = express();


app.set('view engine', 'ejs')
app.use(
	session({
		secret: randomString(),
		resave: false,
		saveUninitialized: false,
	})
  )
app.get('/', (req: Request, res: Response) => {
	const Esession = req.session as any
    res.render('index.ejs', { user: Esession.user })
})

app.listen(8080, () => {
    console.log("App started!")
})
function randomString() {
    return randomBytes(24).toString('hex')
}


router(app);
