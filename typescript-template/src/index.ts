import './styles/style.css'

const tsTestSyntax: string = 'Wow, it works!';

document.getElementById('root-button').addEventListener('click', () => {
    fetch('server/server.php', {
        method: 'POST'
    })
        .then(response => response.text())
        .then(value => {
            console.log("Response from php script:", value);
            console.log(tsTestSyntax);
            document.querySelector('.placeholder').innerHTML = value;
        })
});
