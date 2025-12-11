import { FileTreeNode, FileTreeNodeType } from '@/types';
import { isAudioFile, isSubtitleFile } from './audioUtils';

/**
 * Determine the type of file
 */
function getFileType(file: File): FileTreeNodeType {
  if (isAudioFile(file)) return 'audio';
  if (isSubtitleFile(file)) return 'subtitle';
  return 'other';
}

/**
 * Parse path string into segments
 */
function parsePath(path: string): string[] {
  return path.split('/').filter(Boolean);
}

/**
 * Build a file tree from a FileList with webkitRelativePath
 */
export function buildFileTree(files: FileList | File[]): FileTreeNode[] {
  const root: FileTreeNode = {
    id: 'root',
    name: 'root',
    type: 'folder',
    path: '',
    children: [],
    isExpanded: true,
  };

  const fileArray = Array.from(files);

  // Sort files by path for consistent ordering
  fileArray.sort((a, b) => {
    const pathA = (a as any).webkitRelativePath || a.name;
    const pathB = (b as any).webkitRelativePath || b.name;
    return pathA.localeCompare(pathB);
  });

  for (const file of fileArray) {
    const relativePath = (file as any).webkitRelativePath || file.name;
    const segments = parsePath(relativePath);
    
    // Skip if no path
    if (segments.length === 0) continue;

    let currentNode = root;
    let currentPath = '';

    // Build folder structure
    for (let i = 0; i < segments.length; i++) {
      const segment = segments[i];
      currentPath = currentPath ? `${currentPath}/${segment}` : segment;
      const isLastSegment = i === segments.length - 1;

      // Ensure children array exists
      if (!currentNode.children) {
        currentNode.children = [];
      }

      // Find or create child node
      let childNode = currentNode.children.find((c) => c.name === segment);

      if (!childNode) {
        childNode = {
          id: currentPath,
          name: segment,
          type: isLastSegment ? getFileType(file) : 'folder',
          path: currentPath,
          isExpanded: false,
        };

        if (isLastSegment) {
          // It's a file
          childNode.file = file;
        } else {
          // It's a folder
          childNode.children = [];
        }

        currentNode.children.push(childNode);
      }

      // Move to next level
      currentNode = childNode;
    }
  }

  // Return the children of root (not root itself)
  return root.children || [];
}

/**
 * Flatten the file tree to get all audio tracks
 */
export function extractAudioTracks(tree: FileTreeNode[]): FileTreeNode[] {
  const tracks: FileTreeNode[] = [];

  function traverse(nodes: FileTreeNode[]) {
    for (const node of nodes) {
      if (node.type === 'audio' && node.file) {
        tracks.push(node);
      }
      if (node.children) {
        traverse(node.children);
      }
    }
  }

  traverse(tree);
  return tracks;
}

/**
 * Find a node in the tree by ID
 */
export function findNodeById(
  tree: FileTreeNode[],
  id: string
): FileTreeNode | null {
  for (const node of tree) {
    if (node.id === id) return node;
    if (node.children) {
      const found = findNodeById(node.children, id);
      if (found) return found;
    }
  }
  return null;
}

/**
 * Toggle folder expansion state
 */
export function toggleNodeExpansion(
  tree: FileTreeNode[],
  nodeId: string
): FileTreeNode[] {
  return tree.map((node) => {
    if (node.id === nodeId) {
      return { ...node, isExpanded: !node.isExpanded };
    }
    if (node.children) {
      return { ...node, children: toggleNodeExpansion(node.children, nodeId) };
    }
    return node;
  });
}

/**
 * Get breadcrumb path for a given node
 */
export function getBreadcrumbs(path: string): string[] {
  return path.split('/').filter(Boolean);
}

/**
 * Count files by type in tree
 */
export function countFilesByType(tree: FileTreeNode[]): {
  audio: number;
  subtitle: number;
  folders: number;
} {
  let audio = 0;
  let subtitle = 0;
  let folders = 0;

  function traverse(nodes: FileTreeNode[]) {
    for (const node of nodes) {
      if (node.type === 'audio') audio++;
      else if (node.type === 'subtitle') subtitle++;
      else if (node.type === 'folder') {
        folders++;
        if (node.children) traverse(node.children);
      }
    }
  }

  traverse(tree);
  return { audio, subtitle, folders };
}
