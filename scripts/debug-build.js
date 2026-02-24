const { spawn } = require('child_process');

console.log('Starting debug build...');

const build = spawn('npx', ['next', 'build'], {
    stdio: 'inherit',
    shell: true
});

build.on('close', (code) => {
    console.log(`Build process exited with code ${code}`);
    process.exit(code);
});
