export const getManifestConfig = () => {
  const matches: Array<string> = ['*://*.tiktokglobalshop.com/product/*', '*://*.baidu.com/*']
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

export default {}
