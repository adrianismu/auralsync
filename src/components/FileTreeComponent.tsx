import { motion, AnimatePresence } from 'framer-motion';
import {
  Folder,
  FolderOpen,
  Music,
  FileText,
  ChevronRight,
} from 'lucide-react';
import { FileTreeNode } from '@/types';
import { usePlayerStore } from '@/store/playerStore';

interface FileTreeItemProps {
  node: FileTreeNode;
  level: number;
}

function FileTreeItem({ node, level }: FileTreeItemProps) {
  const { currentTrackId, playTrack, toggleFolder } = usePlayerStore();
  const isActive = currentTrackId === node.id;

  const handleClick = () => {
    if (node.type === 'folder') {
      toggleFolder(node.id);
    } else if (node.type === 'audio') {
      playTrack(node.id);
    }
  };

  const getIcon = () => {
    switch (node.type) {
      case 'folder':
        return node.isExpanded ? (
          <FolderOpen className="w-4 h-4 text-yellow-400" />
        ) : (
          <Folder className="w-4 h-4 text-yellow-500" />
        );
      case 'audio':
        return <Music className="w-4 h-4 text-blue-400" />;
      case 'subtitle':
        return <FileText className="w-4 h-4 text-purple-400" />;
      default:
        return <FileText className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.2 }}
        onClick={handleClick}
        className={`
          flex items-center gap-2 px-3 py-2 cursor-pointer rounded-md transition-all
          hover:bg-white/5
          ${isActive ? 'bg-immersive-accent/20 shadow-lg shadow-immersive-accent/20' : ''}
        `}
        style={{ paddingLeft: `${level * 16 + 12}px` }}
      >
        {/* Chevron for folders */}
        {node.type === 'folder' && (
          <motion.div
            animate={{ rotate: node.isExpanded ? 90 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronRight className="w-3 h-3 text-immersive-muted" />
          </motion.div>
        )}

        {/* Icon */}
        {getIcon()}

        {/* Name */}
        <span
          className={`
            text-sm flex-1 truncate
            ${isActive ? 'text-white font-semibold' : 'text-immersive-text'}
          `}
          title={node.name}
        >
          {node.name}
        </span>

        {/* Active indicator */}
        {isActive && (
          <motion.div
            layoutId="activeIndicator"
            className="w-1 h-1 rounded-full bg-immersive-accent"
            animate={{ scale: [1, 1.5, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
          />
        )}
      </motion.div>

      {/* Children (folders) */}
      <AnimatePresence>
        {node.type === 'folder' && node.isExpanded && node.children && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            {node.children.map((child) => (
              <FileTreeItem key={child.id} node={child} level={level + 1} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface FileTreeComponentProps {
  tree: FileTreeNode[];
}

export function FileTreeComponent({ tree }: FileTreeComponentProps) {
  if (tree.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-immersive-muted p-8 text-center">
        <Folder className="w-16 h-16 mb-4 opacity-30" />
        <p>No folders loaded</p>
        <p className="text-sm mt-2 opacity-70">Drop a folder to get started</p>
      </div>
    );
  }

  return (
    <div className="py-2 overflow-y-auto h-full">
      {tree.map((node) => (
        <FileTreeItem key={node.id} node={node} level={0} />
      ))}
    </div>
  );
}
