// @ts-check
import { nodeConfig } from '@node-admin/eslint-config/node'

export default nodeConfig({
  tsconfigRootDir: import.meta.dirname,
  ignores: ['eslint.config.mjs'],
})
