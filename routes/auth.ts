import express from 'express';
import config from '../env'
const Router = express.Router()
const fetch = require('node-fetch')





Router
.get('/login', async (req: express.Request, res: express.Response) => {
    const { code } = req.query as any
	const session = req.session as any
    if(code) {
        try {
            const oauthResult = await fetch('https://discord.com/api/oauth2/token', {
					method: 'POST',
					body: new URLSearchParams({
					client_id: config.client_id,
					client_secret: config.client_secret,
					code: code,
					grant_type: 'authorization_code',
					redirect_uri: `http://localhost:8080/auth/login`,
					scope: 'identify guilds',
					}),
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded',
						},
				});
				
				const oauthData = await oauthResult.json();
				if(oauthData.error_description === 'Invalid "code" in request.') return res.redirect("/")
				const userResult = await fetch('https://discord.com/api/users/@me', {
					headers: {
						authorization: `${oauthData.token_type} ${oauthData.access_token}`,
					},
				});
				const guildRes = await fetch('https://discord.com/api/users/@me/guilds', {
					headers: {
						authorization: `${oauthData.token_type} ${oauthData.access_token}`,
					},
				});
				const userData = await userResult.json();
				const guildData = await guildRes.json()
				session.user = {
					id: userData.id,
					username: userData.username,
					avatar: `https://cdn.discordapp.com/avatars/${userData.id}/${userData.avatar}`,
					discriminator: userData.discriminator,
					guilds: guildData,
				}
				
				res.redirect('/')
        } catch (error) {
            console.log(error)
        }
    } else return res.redirect('https://discord.com/api/oauth2/authorize?client_id=943389705418969158&redirect_uri=http%3A%2F%2Flocalhost%3A8080%2Fauth%2Flogin&response_type=code&scope=identify%20guilds')
})
.get('/logout', (req: express.Request, res: express.Response) => {
    const session = req.session as any
    res.redirect("/")
    return session.destroy()
	// going to take a look into discord api see you in part 2 :)
})

export = Router