document.addEventListener("DOMContentLoaded", function() {

    function writeJob(job) {
        console.log(
            '%c' + job.title + ' 🔘 %c' + job.description,
            'font-weight: 700; color: #333', 'color: #333'
        );

        console.log(
            '%cLocations: %c' +
            job.locations.join(' | '),
            'font-weight: 700; color: #555', 'color: #555'
        );

        console.log(
            '%cCheck out: %c' + job.url + '\n\n',
            'color: #555', 'color: #31b3c7'
        );
    }

    function displayJobs(jobs) {
        console.log('🌟️ %cartkonekt %cis hiring!', 'font-weight: 700; color: #31b3c7', 'color: #333;');
        console.log('Join us for %c💲 + 🍵 + 🚲 + 🍺 + 🍔', 'font-size: 2em');

        console.log('\nOpen jobs:\n%c----------\n', 'color: #676767');

        jobs.forEach(function (job) {
            writeJob(job);
        });

        console.log('%cType %capply %c😉', 'color: #333', 'color: #333; font-weight: 700', 'color: #333; font-weight: 400');
    }

    function getJobs() {
        var request = new XMLHttpRequest();
        request.open('GET', 'https://artkonekt.com/jobs.json', true);

        request.onload = function() {
            if (request.status >= 200 && request.status < 400) {
                displayJobs(JSON.parse(request.responseText));
            }
        };

        request.send();
    }

    getJobs();
    
    function sendApplication(contact) {
        var request = new XMLHttpRequest();
        request.open('POST', 'https://artkonekt.com/jobs/apply.php', true);

        request.onload = function() {
            if (request.status >= 200 && request.status < 400) {
                console.log(
                    '%c✔️ Roger that! %cWe\'ll reach out to you soon at ' + contact,
                    'color: green; font-weight: 700', 'color: #333'
                );
            } else {
                console.log('%c💩 %cError ' + request.status +
                    '. We suck. Can you fix this? Please get in touch here: %chttps://artonekt.com/contact',
                    'font-size: 2em; color: #64382F', 'color: #333', 'color: #31b3c7'
                );
            }
        };

        request.onerror = function (e) {
            console.log('%c💩 %cthat\'s an error: ' + e, 'font-size: 2em; color: #64382F', 'color: #333');
            console.log('%cPlease get in touch here: %chttps://artonekt.com/contact',
                'color: #333', 'color: #31b3c7'
            );
        };

        request.setRequestHeader("Content-type","application/x-www-form-urlencoded");
        request.send('contact=' + contact);
    }

    window.applie = function () {
        var contact = prompt('Enter your contact (email, chat, whatever) & we\'ll get back to you');
        if (contact) {
            sendApplication(contact);
            return 'Sending application...';
        }

        return 'Try again!';
    }

    Object.defineProperty(window, 'apply', { get: applie });

});
