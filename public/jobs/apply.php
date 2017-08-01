<?php
/**
 * Contains index.php.
 *
 * @copyright   Copyright (c) 2017 Attila Fulop
 * @author      Attila Fulop
 * @license     MIT
 * @since       2017-08-01
 *
 */

include __DIR__ . '/.env.php';


if ('POST' !== $_SERVER['REQUEST_METHOD']) {
    http_response_code(400);
    die('Your request sucks 💩');
}

file_put_contents(
    __DIR__ . '/' . date('YmdHis') . '_' . mt_rand(100, 999) . '.txt',
    sprintf("REQUEST:\n%s\n\nSERVER:\n%s\n",
        print_r($_REQUEST, true),
        print_r($_SERVER, true)
    )
);

function mg_send($to, $subject, $message)
{

    $ch = curl_init();

    curl_setopt($ch, CURLOPT_HTTPAUTH, CURLAUTH_BASIC);
    curl_setopt($ch, CURLOPT_USERPWD, 'api:' . MAILGUN_API);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);

    $plain = strip_tags(nl2br($message));

    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'POST');
    curl_setopt($ch, CURLOPT_URL, 'https://api.mailgun.net/v3/' . DOMAIN . '/messages');
    curl_setopt($ch, CURLOPT_POSTFIELDS, array(
        'from'    => 'postmaster@' . DOMAIN,
        'to'      => $to,
        'subject' => $subject,
        'html'    => $message,
        'text'    => $plain
    ));

    $j = json_decode(curl_exec($ch));

    $info = curl_getinfo($ch);

    if ($info['http_code'] != 200) {
        // Sanyi, we do nothing
    }

    curl_close($ch);

    return $j;
}

@mg_send(
    JOB_SEND_EMAIL_TO,
    'Job Application :: ' . date('Y-m-d H:i:s'),
    'Application from: ' . $_POST['contact']
);
