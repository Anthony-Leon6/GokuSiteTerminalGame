document.getElementById('commandInput').addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
    const command = event.target.value;
    processCommand(command);
    event.target.value = '';
    }
});
function processCommand(command) {
    const output = document.getElementById('output');
    output.textContent += `\n$ ${command}`;
    
}