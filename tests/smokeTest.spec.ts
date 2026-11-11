import { expect } from "../utils/custom-expect";
import { APILogger } from "../utils/logger";
import { test } from "../utils/fixtures";


test('get tags', async ({ api }) => {

  const response = await api
    .path('/tags')
    .params({ limit: 10, offset: 0 })
    .getRequest(200)


  expect(response.tags.length).shouldEqual(10)

});

test('get articles', async ({ api }) => {
  const response = await api
    .path('/articles')
    .params({ limit: 10, offset: 0 })
    .getRequest(200)

  expect(response.articlesCount).toBeLessThanOrEqual(10)
  expect(response.articles.length).toBeLessThanOrEqual(10)
});

test('create article and delete', async ({ api }) => {

  const createArticleResponse = await api
    .path('/articles')
    .body({
      "article": {
        "title": "New article sotiris",
        "description": "test",
        "body": "test",
        "tagList": [
          "test1 test2"
        ]
      }
    })
    .postRequest(201)

  const getArticlesResponse = await api
    .path('/articles')
    .params({ limit: 10, offset: 0 })
    .getRequest(200)

  expect(getArticlesResponse.articles[0].title).toEqual('New article sotiris')
  const articleSlug = getArticlesResponse.articles[0].slug

  await api
    .path(`/articles/${articleSlug}`)
    .params({})
    .deleteRequest(204)

})

test('create,update and delete article', async ({ api }) => {
  const createArticleResponse = await api
    .path('/articles')
    .body({
      "article": {
        "title": "New article sotiris",
        "description": "test",
        "body": "test",
        "tagList": [
          "test1 test2"
        ]
      }
    })
    .postRequest(201)

    


  const getArticlesResponse = await api
    .path('/articles')
    .params({ limit: 10, offset: 0 })
    .getRequest(200)

  expect(getArticlesResponse.articles[0].title).toEqual('New article sotiris')
  const articleSlug = getArticlesResponse.articles[0].slug

  const updateArticleResponse = await api
    .path('/articles')
    .body({
      "article": {
        "title": "Article updated",
        "description": "desc updated",
        "body": "body updated",
        "tagList": ["tag"],
        "slug": articleSlug
      }
    })
    .updateRequest(200, articleSlug)

  const updatedArticeSlug = updateArticleResponse.article.slug

  const getArticlesResponse2 = await api
    .path('/articles')
    .params({ limit: 10, offset: 0 })
    .getRequest(200)

  expect(getArticlesResponse2.articles[0].title).toEqual('Article updated')

  await api
    .path(`/articles/${updatedArticeSlug}`)
    .deleteRequest(204)


  const getArticlesResponse3 = await api
    .path('/articles')
    .params({ limit: 10, offset: 0 })
    .getRequest(200)

  expect(getArticlesResponse3.articles[0].title).not.toEqual('Article updated')



})

