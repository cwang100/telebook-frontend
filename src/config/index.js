
// import {environment as prod } from './environment.prod'
import {environment as dev } from './environment.dev'

const config = {

}

// const configEnv = process.env.NODE_ENV === 'production' ? prod : dev
const configEnv = dev

export default {
  ...config,
  ...configEnv
}
