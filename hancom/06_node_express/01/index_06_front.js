const readline = require('readline');
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

function ask() {
    rl.question('메시지: ', (message) => {
        fetch('http://192.168.20.15/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message })
        })
            .then(r => r.json())
            .then(console.log)
            .catch(() => console.log('서버가 꺼져있습니다.'))
            .finally(ask);
    });
}

ask();
