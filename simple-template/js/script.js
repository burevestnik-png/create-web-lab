// Write your code here

document.getElementById('root-button').addEventListener('click', () => {
    fetch('server/server.php', {
        method: 'POST'
    })
        .then(response => response.text())
        .then(value => {
            console.log("Response from php", value);
            document.querySelector('.placeholder').appendChild(value)
        })
});
