import React, { useState, useEffect } from 'react';

interface CLICommand {
  id: string;
  command: string;
  output: string[];
  timestamp: number;
}

export const CLIInterface: React.FC = () => {
  const [commands, setCommands] = useState<CLICommand[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(docHeight > 0 ? scrollTop / docHeight : 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const mockCommands: { [key: string]: string[] } = {
    'projects': [
      '$ ls projects/',
      'interactive-experience-platform/',
      'design-system-library/',
      'analytics-dashboard/',
      'ecommerce-redesign/',
      'fitness-tracker-app/',
      'generative-art-platform/',
    ],
    'about': [
      '$ cat about.txt',
      'Web Developer & Creative Thinker',
      'Passionate about blending technical excellence with artistic vision.',
      'Full-stack development | Design Systems | Product Strategy',
    ],
    'skills': [
      '$ echo $TECH_STACK',
      'Frontend: React, TypeScript, Tailwind CSS, Next.js',
      'Backend: Node.js, Python, PostgreSQL, GraphQL',
      'Design: Figma, UI/UX, Design Systems',
    ],
    'contact': [
      '$ whoami',
      'hello@example.com',
      'github.com/portfolio',
      'linkedin.com/in/portfolio',
    ],
    'help': [
      '$ help',
      'Available commands:',
      'projects  - View all projects',
      'about     - Developer biography',
      'skills    - Technical skills',
      'contact   - Get in touch',
      'clear     - Clear terminal',
    ],
    'clear': [],
  };

  const handleCommand = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== 'Enter') return;

    const cmd = inputValue.trim().toLowerCase();
    const output = mockCommands[cmd] || [
      `$ ${inputValue}`,
      'command not found',
      'type "help" for available commands',
    ];

    setCommands([
      ...commands,
      {
        id: Date.now().toString(),
        command: inputValue,
        output: cmd === 'clear' ? [] : output,
        timestamp: Date.now(),
      },
    ]);

    if (cmd === 'clear') {
      setCommands([]);
    }

    setInputValue('');
  };

  // Calculate position based on scroll (emerging from space)
  const yOffset = scrollProgress * 300;
  const opacity = Math.min(1, scrollProgress * 2);
  const scale = 0.8 + scrollProgress * 0.2;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '40px',
        right: '40px',
        width: '400px',
        maxHeight: '500px',
        backgroundColor: 'rgba(10, 14, 39, 0.9)',
        border: '2px solid #8b5a8e',
        borderRadius: '8px',
        padding: '20px',
        fontFamily: '"Courier New", monospace',
        fontSize: '12px',
        color: '#4a9ba8',
        overflow: 'auto',
        boxShadow: '0 0 20px rgba(139, 90, 142, 0.5)',
        transform: `translateY(-${yOffset}px) scale(${scale})`,
        transformOrigin: 'bottom right',
        opacity,
        transition: 'all 0.05s ease-out',
        pointerEvents: opacity > 0.5 ? 'auto' : 'none',
        zIndex: 100,
      }}
    >
      {/* Terminal Header */}
      <div style={{ marginBottom: '12px', paddingBottom: '8px', borderBottom: '1px solid #8b5a8e' }}>
        <div style={{ color: '#8b5a8e', fontWeight: 'bold' }}>spacetime.cli v1.0</div>
        <div style={{ fontSize: '10px', color: '#6b7aa1', marginTop: '4px' }}>
          Astronaut Terminal Interface
        </div>
      </div>

      {/* Command Output */}
      <div style={{ marginBottom: '12px', maxHeight: '350px', overflowY: 'auto' }}>
        {commands.map((cmd) => (
          <div key={cmd.id} style={{ marginBottom: '12px' }}>
            <div style={{ color: '#4a9ba8' }}>
              <span style={{ color: '#8b5a8e' }}>$</span> {cmd.command}
            </div>
            <div style={{ marginLeft: '12px', marginTop: '4px', color: '#a8d4d4' }}>
              {cmd.output.map((line, idx) => (
                <div key={idx}>{line}</div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Input Prompt */}
      <div style={{ display: 'flex', alignItems: 'center', borderTop: '1px solid #8b5a8e', paddingTop: '8px' }}>
        <span style={{ color: '#8b5a8e', marginRight: '6px' }}>$</span>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleCommand}
          placeholder="type 'help' for commands"
          style={{
            flex: 1,
            backgroundColor: 'transparent',
            border: 'none',
            color: '#4a9ba8',
            outline: 'none',
            fontFamily: '"Courier New", monospace',
            fontSize: '12px',
            caretColor: '#4a9ba8',
          }}
          autoFocus
        />
      </div>
    </div>
  );
};
