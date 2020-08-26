import * as $ from 'jquery';
import './styles/style.scss';

const tsTestSyntax: string = 'Wow, it works!';

$('#root-button').on('click', () => {
    fetch('server/server.php', {
        method: 'POST'
    })
        .then(response => response.text())
        .then(value => {
            console.log("Response from php script:", value);
            $('.placeholder').html(value);
        })
});
