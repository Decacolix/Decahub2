<?php

declare(strict_types=1);

require_once dirname(__DIR__) . '/_proxy.php';

proxyNewsFeed('https://servis.idnes.cz/rss.aspx?c=zpravodaj');
