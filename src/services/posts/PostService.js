import { firebaseRef, firebaseAuth, db } from '../../fireStoreClient'

import { FollowService } from '../follow'
import { SocialError } from '../../class/common'
import { Post } from '../../class/posts'

const followService = new FollowService()

export class PostService {
  addPost(post) {
    return new Promise((resolve, reject) => {
      let postRef = db.collection(`posts`).doc()
      postRef.set({ ...post, id: postRef.id })
        .then(() => {
          resolve(postRef.id)
        })
        .catch((error) => {
          reject(new SocialError(error.code, error.message))
        })
    })
  }

  updatePost(post) {
    return new Promise((resolve, reject) => {
      const batch = db.batch()
      const postRef = db.doc(`posts/${post.id}`)

      batch.update(postRef, { ...post })
      batch.commit().then(() => {
        resolve()
      })
        .catch((error) => {
          reject(new SocialError(error.code, error.message))
        })
    })
  }

  deletePost(postId) {
    return new Promise((resolve, reject) => {
      const batch = db.batch()
      const postRef = db.doc(`posts/${postId}`)

      batch.delete(postRef)
      batch.commit().then(() => {
        resolve()
      })
      .catch((error) => {
        reject(new SocialError(error.code, error.message))
      })
    })
  }

  getPosts(currentUserId, lastPostId, page = 0, limit = 10) {
      return new Promise((resolve, reject) => {
        let postList = []

        followService.getAllFollowers(currentUserId).then((users) => {
          if (users.length == 0) {
            this.getPostsByUserId(currentUserId, lastPostId, page, limit).then((result) => {
              resolve(result)
            })
          } else {
            const promiseList = []
            users.forEach((userId) => {
              promiseList.push(this.getPostsByUserId(userId))
            })

            Promise.all(promiseList).then((resolved) => {
              resolved.forEach((result) => {
                postList = postList.concat(result.posts)
              })
              this.getPostsByUserId(currentUserId).then((result) => {
                postList = postList.concat(result.posts)
                resolve(this.pagingPosts(postList, lastPostId, limit))
              })
            })
          }
        })
          // .catch((error) => {
          //   reject(new SocialError(error.code, error.message))
          // })
      })
    }

  getPostsByUserId(userId, lastPostId, page, limit) {
      return new Promise((resolve, reject) => {

        let parsedData = []

        let query = db.collection('posts').where('ownerUserId', '==', userId)
        if (lastPostId && lastPostId !== '') {
          query = query.orderBy('id').orderBy('creationDate', 'desc').startAfter(lastPostId)
        }
        if (limit) {
          query = query.limit(limit)
        }
        query.get().then((posts) => {
          let newLastPostId = posts.size > 0 ? posts.docs[posts.docs.length - 1].id : ''
          posts.forEach((postResult) => {
            const post = postResult.data()
            parsedData = [
              ...parsedData,
              {
                [postResult.id]: {
                  id: postResult.id,
                  ...post
                }
              }

            ]
          })
          resolve({ posts: parsedData, newLastPostId })
        })

      })
    }

  getPostById(postId) {
    return new Promise((resolve, reject) => {

      let postsRef = db.doc(`posts/${postId}`)
      postsRef.get().then((snapshot) => {
        let newPost = snapshot.data() || {}
        let post = {
          id: postId,
          ...newPost
        }
        resolve(post)
      })
      .catch((error) => {
        reject(new SocialError(error.code, error.message))
      })
    })
  }

  pagingPosts(postList, lastPostId, limit) {
    let sortedObjects = postList.sort((a, b) => {
      const aKey = Object.keys(a)[0]
      const bKey = Object.keys(b)[0]
      return b[bKey].creationDate - a[aKey].creationDate
    })
    if (lastPostId && lastPostId !== '') {
      const lastPostIndex = sortedObjects.findIndex((arg) => {
        return Object.keys(arg)[0] === lastPostId
      })
      sortedObjects = sortedObjects.slice(lastPostIndex + 1, lastPostIndex + limit + 1)
    } else if (sortedObjects.length > limit) {
      sortedObjects = sortedObjects.slice(0, limit)
    }

    const newLastPostId = sortedObjects && sortedObjects.length > 0 ? Object.keys(sortedObjects[sortedObjects.length - 1])[0] : ''

    return { posts: sortedObjects, newLastPostId }
  }
}
