const { spawn } = require('child_process');
const path = require('path');

const BACKEND_PORT = 5000;
const FRONTEND_PORT = 5173;

console.clear();
console.log('\x1b[36m%s\x1b[0m', '--------------------------------------------------');
console.log('\x1b[36m%s\x1b[0m', ' OPS WATCH MODE : STARTING SERVICES');
console.log('\x1b[36m%s\x1b[0m', '--------------------------------------------------');
console.log(` Customer URL: \x1b[32mhttp://localhost:${FRONTEND_PORT}\x1b[0m`);
console.log(` Admin Panel:  \x1b[32mhttp://localhost:${FRONTEND_PORT}/admin\x1b[0m`);
console.log('\x1b[36m%s\x1b[0m', '--------------------------------------------------');

// Define paths
const serverDir = path.join(__dirname, 'server');
const clientDir = path.join(__dirname, 'client');

// Start Backend
const backend = spawn('npm', ['run', 'dev'], { cwd: serverDir, shell: true });

backend.stdout.on('data', (data) => {
    const output = data.toString().trim();
    if (output) {
        // Highlight structured logs
        if (output.includes('[OPS_WATCH]') || output.includes('[BACKEND]')) {
            console.log(`\x1b[35m[BACKEND]\x1b[0m ${output.replace('[BACKEND]', '')}`);
        } else {
            console.log(`[BACKEND] ${output}`);
        }
    }
});

backend.stderr.on('data', (data) => {
    console.error(`\x1b[31m[BACKEND_ERR]\x1b[0m ${data.toString().trim()}`);
});

// Start Frontend
const frontend = spawn('npm', ['run', 'dev', '--', '--port', FRONTEND_PORT.toString(), '--strictPort'], { cwd: clientDir, shell: true });

frontend.stdout.on('data', (data) => {
    const output = data.toString().trim();
    if (output && !output.includes('hmr update')) {
        console.log(`\x1b[34m[FRONTEND]\x1b[0m ${output}`);
    }
});

frontend.stderr.on('data', (data) => {
    console.error(`\x1b[31m[FRONTEND_ERR]\x1b[0m ${data.toString().trim()}`);
});

process.on('SIGINT', () => {
    console.log('\nStopping services...');
    try {
        process.kill(backend.pid); // Attempt to kill child processes
        process.kill(frontend.pid);
    } catch (e) {
        // Ignore errors if already dead
    }
    process.exit();
});
