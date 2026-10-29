import { Code2, FileCode } from 'lucide-react'
import { useState } from 'react'

const fileContents: Record<string, string> = {
  'App.tsx': '// FLÂNEUR main React application\n// Coordinates product, cart, theme, and modal state.',
  'HeroSlider.tsx': '// Auto-playing image and video hero banner\n// Supports three slides with manual dot navigation.',
  'Products.tsx': '// Product catalog with category filtering and pagination\n// Displays up to four products per page.',
  'Cart.tsx': '// Shopping cart with quantity controls and order summary.',
}

type CodeInspectorProps = {
  open: boolean
  onClose: () => void
}

export default function CodeInspector({ open, onClose }: CodeInspectorProps) {
  const [selectedFile, setSelectedFile] = useState('App.tsx')
  if (!open) return null

  return (
    <aside className="fixed bottom-0 left-0 right-0 z-50 border-t border-zinc-700 bg-zinc-900 text-zinc-200 shadow-2xl">
      <div className="flex items-center justify-between border-b border-zinc-800 bg-zinc-950 px-4 py-2">
        <div className="flex items-center space-x-2">
          <Code2 className="h-4 w-4 text-blue-400" />
          <span className="font-mono text-xs font-bold">VS Code Component Explorer</span>
        </div>
        <button type="button" onClick={onClose} className="text-xs text-zinc-400 hover:text-white">Close [X]</button>
      </div>
      <div className="flex">
        <nav className="w-48 space-y-1 border-r border-zinc-800 bg-zinc-950 p-2 font-mono text-xs" aria-label="Source files">
          {Object.keys(fileContents).map((filename) => (
            <button
              type="button"
              key={filename}
              onClick={() => setSelectedFile(filename)}
              className={`flex w-full items-center space-x-2 rounded px-2 py-1.5 text-left ${selectedFile === filename ? 'bg-blue-600 text-white' : 'text-zinc-400 hover:bg-zinc-800'}`}
            >
              <FileCode className="h-3.5 w-3.5" />
              <span>{filename}</span>
            </button>
          ))}
        </nav>
        <pre className="max-h-48 flex-1 overflow-x-auto bg-zinc-900 p-4 font-mono text-xs text-emerald-400"><code>{fileContents[selectedFile]}</code></pre>
      </div>
    </aside>
  )
}
