import fs from 'fs'
import { resolve } from 'path'
import type { PluginOption } from 'vite'

const outDir = resolve(__dirname, '../dist')

export default function makeManifest(): PluginOption {
  return {
    name: 'make-manifest',
    async buildStart() {
      try {
        console.log('Starting manifest generation...')
        
        if (!fs.existsSync(outDir)) {
          console.log('Creating dist directory...')
          fs.mkdirSync(outDir, { recursive: true })
        }
        
        const manifestPath = resolve(outDir, 'manifest.json')
        const manifest = getManifestConfig()
        
        console.log('Writing manifest file...')
        await fs.promises.writeFile(
          manifestPath,
          JSON.stringify(manifest, null, 2),
          'utf-8'
        )
        
        console.log(`Manifest file generated successfully at: ${manifestPath}`)
      } catch (error) {
        console.error('Error generating manifest:', error)
        throw error
      }
    }
  }
}
export const getManifestConfig = () => {
  const matches: Array<string> = ['*://*.tiktokglobalshop.com/product/*', '*://erp.91miaoshou.com/common_collect_box/*']
  return {
    manifest_version: 3,
    name: 'My Vite Extension',
    version: '1.0.0',
    background: {
      service_worker: 'src/background/index.ts'
    },
    action: {
      default_popup: 'src/popup/index.html'
    },
    description: 'My Vite Extension',
    icons: {
      16: 'icon/audio.png',
      48: 'icon/audio.png',
      128: 'icon/audio.png'
    },
    content_scripts: [
      {
        js: ['src/content/index.ts'],
        run_at: 'document_end',
        matches,
        all_frames: true
      }
    ],
    externally_connectable: {
      matches
    },
    web_accessible_resources: [
      {
        resources: ['assets/*', 'icon/*', 'vendor/*', 'src/*', 'styles/*'],
        matches: ['<all_urls>']
      }
    ],
    host_permissions: matches,
    permissions: [
      'webRequest',
      'declarativeNetRequest',
      'declarativeNetRequestWithHostAccess',
      'declarativeNetRequestFeedback',
      'scripting',
      'notifications',
      'background',
      'tabs',
      'unlimitedStorage',
      'storage',
      'contextMenus',
      'webNavigation',
      'cookies',
      'offscreen'
    ]
  }
}