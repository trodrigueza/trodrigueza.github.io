import { visit } from 'unist-util-visit';

export function rehypeCodeBlock() {
  return (tree) => {
    visit(tree, 'element', (node, index, parent) => {
      // Find <pre> elements that contain <code> (code blocks)
      if (node.tagName === 'pre' && node.children && node.children.length > 0) {
        const codeChild = node.children.find(child => child.tagName === 'code');
        
        if (codeChild) {
          // Extract language from class (e.g., "language-javascript")
          const className = codeChild.properties?.className || [];
          const languageClass = className.find(cls => cls.startsWith('language-'));
          const language = languageClass ? languageClass.replace('language-', '') : '';
          
          // Get the class from the pre element (Shiki adds classes here)
          const preClassName = node.properties?.className?.join(' ') || '';
          
          // Create a wrapper div with our custom component structure
          const wrapper = {
            type: 'element',
            tagName: 'div',
            properties: {
              className: ['code-block-container']
            },
            children: [
              // Keep the original pre element
              {
                ...node,
                properties: {
                  ...node.properties,
                  'data-language': language
                }
              },
              // Add the copy button
              {
                type: 'element',
                tagName: 'button',
                properties: {
                  type: 'button',
                  className: ['copy-button'],
                  'aria-label': 'Copy code to clipboard'
                },
                children: [
                  {
                    type: 'element',
                    tagName: 'span',
                    properties: {
                      className: ['copy-icon-container'],
                      'aria-hidden': 'true'
                    },
                    children: [
                      {
                        type: 'element',
                        tagName: 'svg',
                        properties: {
                          className: ['copy-icon'],
                          xmlns: 'http://www.w3.org/2000/svg',
                          width: '16',
                          height: '16',
                          viewBox: '0 0 24 24',
                          fill: 'none',
                          stroke: 'currentColor',
                          'stroke-width': '2',
                          'stroke-linecap': 'round',
                          'stroke-linejoin': 'round'
                        },
                        children: [
                          {
                            type: 'element',
                            tagName: 'rect',
                            properties: {
                              x: '9',
                              y: '9',
                              width: '13',
                              height: '13',
                              rx: '2',
                              ry: '2'
                            },
                            children: []
                          },
                          {
                            type: 'element',
                            tagName: 'path',
                            properties: {
                              d: 'M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1'
                            },
                            children: []
                          }
                        ]
                      },
                      {
                        type: 'element',
                        tagName: 'svg',
                        properties: {
                          className: ['check-icon'],
                          xmlns: 'http://www.w3.org/2000/svg',
                          width: '16',
                          height: '16',
                          viewBox: '0 0 24 24',
                          fill: 'none',
                          stroke: 'currentColor',
                          'stroke-width': '2',
                          'stroke-linecap': 'round',
                          'stroke-linejoin': 'round'
                        },
                        children: [
                          {
                            type: 'element',
                            tagName: 'polyline',
                            properties: {
                              points: '20 6 9 17 4 12'
                            },
                            children: []
                          }
                        ]
                      }
                    ]
                  }
                ]
              }
            ]
          };
          
          // Replace the pre element with our wrapper
          parent.children[index] = wrapper;
        }
      }
    });
  };
}
