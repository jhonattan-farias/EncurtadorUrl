import { fauna } from "../services/fauna";
import {query as q} from 'faunadb'
import shortid from 'shortid'


import express, { Request, Response } from 'express'
const app = express()

app.get('/getUrls',async (req:Request, res:Response) => {

  try{
    const response:any = await 
    fauna.query(
      q.Map(
        q.Paginate(q.Match(q.Index("url_by_id"),'123456')),
        q.Lambda("X", q.Get(q.Var("X")))
      )
    )
    res.status(200).json(response.data)
  
  } catch (err) {
    console.log(err)
  }
})

app.get('/getUrls/user/:name', async (req,res) => {
  const { name } = req.params
  try{
    const response:{data:any[]} = await fauna.query(
        q.Map(
          q.Paginate(q.Match(q.Index("urls_by_user"),name)),
          q.Lambda("X", q.Get(q.Var("X")))
        )
    )

    const takeOnlyData = response.data.map(item => item.data)

    res.json(takeOnlyData)
  } catch(err) {
    console.log(err)
  }
})

app.get('/accessUrl/:speedly/:code', async (req,res) => {
  const { speedly, code } = req.params

  const shortedUrl = `${speedly}/${code}`

  console.log(shortedUrl)

  let data: any = await fauna.query(
    q.Select(
      'data',
      q.Get(
        q.Match(
          q.Index("url_by_shorturl"),
          shortedUrl
        ),
      )
    )
  )

  
  data.clicks++
  
  console.log(data)
  await fauna.query(
    q.Replace(
      q.Select(
        'ref',
        q.Get(
          q.Match(
            q.Index('url_by_shorturl'),
            shortedUrl
            )
        )
      ),
      { data }
    )
  )

  res.json(data)
})

app.post('/saveUrl',async (req,res) => {
    if(req.method === 'POST'){
      const { fullurl, shorturl, username } = req.headers
      const id = '123456'

      try{
          await fauna.query(
            q.Create(
              q.Collection('urls'),
              { data: { fullurl, shorturl, username, id, clicks:0 } }
            )  
          )
        
          } catch(err) {
          console.log(err)    
      }
    }
  else{
      res.setHeader('Allow','POST')
      res.status(405).send('Method not allowed')
  }
})

app.post("/subscribe", async (req:Request,res:Response) => {
  const { username: userName, userpassword: userPassword }: any = req.headers
  const generateId = `${userName}${shortid.generate()}`

  try{
    const user = {
      userName,
      userPassword,
      id: generateId
    } 
    
    const response: { data: any } = await fauna.query(
        q.If(
          q.Not(
            q.Exists(
              q.Match(
                q.Index('user_by_name'),
                userName
              )
            )
            ),
            q.Create(
              q.Collection('users'),
              { data: user }
            ),
            q.Get(
              q.Match(
                q.Index('user_by_name'),
                userName
              )
            )
          )
    )

    res.json(response.data)

    } catch(err) { 
    return res.status(400).json(err)
   }

}) 

app.delete('/delete/:url/:code',async (req,res) => {
  const { url, code } = req.params
  const shortedUrl = `${url}/${code}`

  try{
    const urlRef = await fauna.query(
        q.Select(
          'ref',
          q.Get(
            q.Match(
              q.Index('url_by_shorturl'),
              shortedUrl
            )
          )
        )
      )

    await fauna.query( q.Delete( urlRef ) )
    
  } catch(err) {
    console.log(err)
  }
})

module.exports = {
  path:'/api',
  handle:app
}
