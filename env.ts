require('dotenv').config()
export = {
    client_id: process.env.client_id ?? "",
    client_secret: process.env.client_secret ?? "",
    r_url: process.env.r_url
}