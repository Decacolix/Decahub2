import { createNewsProxy } from '../_newsProxy';

export default createNewsProxy(
	'https://www.euronews.com/rss?format=mrss&level=theme&name=news',
);
