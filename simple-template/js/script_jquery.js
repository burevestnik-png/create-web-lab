// Write your code here

$('root-button').on('click', () => {
    fetch('server/server.php', {
        method: 'POST'
    })
        .then(response => response.text())
        .then(value => {
            console.log("Response from php script:", value);
            $('.placeholder').innerHTML(value);
        })
});
