import { test, expect } from '@playwright/test';

let authToken: string

test.beforeAll('login and take AuthToken', async ({ request }) => {
  const loginResponse = await request.post('https://conduit-api.bondaracademy.com/api/users/login', {
    data: { "user": { "email": "sotirisapitestingtutorial@gmail.com", "password": "password1234" } }
  })
  const loginResponseJSON = await loginResponse.json()
  authToken = `Token ${loginResponseJSON.user.token}`
})

test('get tags', async ({ request }) => {
  const responseTags = await request.get('https://conduit-api.bondaracademy.com/api/tags')
  const responseTagsJSON = await responseTags.json()

  expect(responseTags.status()).toEqual(200)
  expect(responseTagsJSON.tags).toContain('YouTube')
});

test('get articles', async ({ request }) => {
  const responseArticles = await request.get('https://conduit-api.bondaracademy.com/api/articles?limit=10&offset=0')
  const responseArticlesJSON = await responseArticles.json()


  expect(responseArticles.status()).toEqual(200)
  expect(responseArticlesJSON.articlesCount).toBeLessThanOrEqual(10)
  expect(responseArticlesJSON.articles.length).toBeLessThanOrEqual(10)
});

test('create article and delete', async ({ request }) => {



  const createArticleResponse = await request.post('https://conduit-api.bondaracademy.com/api/articles/', {
    data: {
      "article": {
        "title": "New article sotiris",
        "description": "test",
        "body": "test",
        "tagList": [
          "test1 test2"
        ]
      }
    },
    headers: { Authorization: authToken }
  })

  expect(createArticleResponse.status()).toEqual(201)

  const responseArticles = await request.get('https://conduit-api.bondaracademy.com/api/articles?limit=10&offset=0', {
    headers: { Authorization: authToken }
  })

  const responseArticlesJSON = await responseArticles.json()
  expect(responseArticles.status()).toEqual(200)

  expect(responseArticlesJSON.articles[0].title).toEqual('New article sotiris')
  const articleSlug = responseArticlesJSON.articles[0].slug


  const deleteArticleResponse = await request.delete(`https://conduit-api.bondaracademy.com/api/articles/${articleSlug}`, {
    headers: { Authorization: authToken }
  })
  expect(deleteArticleResponse.status()).toEqual(204)

})

test('create,update and delete article', async ({ request }) => {
  const loginResponse = await request.post('https://conduit-api.bondaracademy.com/api/users/login', {
    data: { "user": { "email": "sotirisapitestingtutorial@gmail.com", "password": "password1234" } }
  })
  const loginResponseJSON = await loginResponse.json()
  const authToken = `Token ${loginResponseJSON.user.token}`


  const createArticleResponse = await request.post('https://conduit-api.bondaracademy.com/api/articles/', {
    data: {
      "article": {
        "title": "New article to update",
        "description": "test",
        "body": "test",
        "tagList": [
          "test1 test2"
        ]
      }
    },
    headers: { Authorization: authToken }
  })

  expect(createArticleResponse.status()).toEqual(201)

  const responseArticles = await request.get('https://conduit-api.bondaracademy.com/api/articles?limit=10&offset=0', {
    headers: { Authorization: authToken }
  })

  const responseArticlesJSON = await responseArticles.json()
  expect(responseArticles.status()).toEqual(200)

  expect(responseArticlesJSON.articles[0].title).toEqual('New article to update')
  const articleSlug = responseArticlesJSON.articles[0].slug


  const updateArticleResponse = await request.put(`https://conduit-api.bondaracademy.com/api/articles/${articleSlug}`, {
    data: {
      "article": {
        "title": "Article updated",
        "description": "desc updated",
        "body": "body updated",
        "tagList": ["tag"],
        "slug": articleSlug
      }
    },
    headers: {
      Authorization: authToken
    }
  })

  const updateArticleResponseJSON = await updateArticleResponse.json()
  expect(updateArticleResponse.status()).toEqual(200)
  const updatedArticeSlug = updateArticleResponseJSON.article.slug


  const deleteArticleResponse = await request.delete(`https://conduit-api.bondaracademy.com/api/articles/${updatedArticeSlug}`, {
    headers: { Authorization: authToken }
  })
  expect(deleteArticleResponse.status()).toEqual(204)

})

