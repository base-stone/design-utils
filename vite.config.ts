import { defineConfig } from 'vite'
import shell from 'rollup-plugin-shell'
import dts from 'vite-plugin-dts'

export default defineConfig({
  plugins: [
    shell({
      commands: ['sudo rm -rf dist'],
      hook: 'buildStart'
    }),
    dts({ rollupTypes: true })
  ],
  esbuild: {
    drop: ['console', 'debugger']
  },
  build: {
    rollupOptions: {
      output: {
        dir: `./dist`
      }
    },
    lib: {
      entry: './src/main.ts',
      name: 'librarys',
      fileName: (format: string) => {
        format = format.replace(/umd/, 'global')
        return `design-librarys.${format}.prod.js`
      },
      formats: ['es']
    },
    cssCodeSplit: false
  }
})
