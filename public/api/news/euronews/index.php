<?php

declare(strict_types=1);

require_once dirname(__DIR__) . '/_proxy.php';

proxyNewsFeed('https://www.euronews.com/rss?format=mrss&level=theme&name=news');
