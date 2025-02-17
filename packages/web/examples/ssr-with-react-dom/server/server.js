import Express from 'express';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { renderStylesToString } from 'emotion-server';
import initReactivesearch from '@appbaseio/reactivesearch/lib/server';
import { SingleRange, ReactiveList } from '@appbaseio/reactivesearch';

import App from '../common/App';
import BookCard from '../common/BookCard';

// settings for the ReactiveBase component
const settings = {
	app: 'good-books-ds',
	url: 'https://a03a1cb71321:75b6603d-9456-4a5a-af6b-a487b309eb61@appbase-demo-ansible-abxiydt-arc.searchbase.io',
	enableAppbase: true,
};

// props for ReactiveSearch components
// we need these to run the query and get the results server side
const singleRangeProps = {
	componentId: 'BookSensor',
	dataField: 'average_rating',
	data: [
		{
			start: 0,
			end: 3,
			label: 'Rating < 3',
		},
		{
			start: 3,
			end: 4,
			label: 'Rating 3 to 4',
		},
		{
			start: 4,
			end: 5,
			label: 'Rating > 4',
		},
	],
	URLParams: true,
};

const reactiveListProps = {
	componentId: 'SearchResult',
	dataField: 'original_title',
	from: 0,
	size: 10,
	renderItem: data => <BookCard key={data._id} data={data} />,
	react: {
		and: ['BookSensor'],
	},
};

const app = Express();
const port = 3000;

// Serve static files
// Since we're passing all requests to same handleRenderer
// We need to serve the bundle.js as it is
// Alternatively you can define your own set of routes
app.use('/dist', Express.static('dist'));

function renderFullPage(html, preloadedState) {
	return `
		<!doctype html>
		<html>
		<head>
			<title>ReactiveSearch SSR Example</title>
		</head>
		<body>
			<div id="root">${html}</div>
			<script>
				window.__PRELOADED_STATE__ = ${JSON.stringify(preloadedState)}
			</script>
			<script src="dist/bundle.js"></script>
		</body>
		</html>
    `;
}

async function handleRender(req, res) {
	try {

		// Create a new store instance and wait for results
		const store = await initReactivesearch(
			[
				{
					...singleRangeProps,
					source: SingleRange,
				},
				{
					...reactiveListProps,
					source: ReactiveList,
				},
			],
			null,
			settings,
		);
		// Render the component to a string
		// renderStylesToString is from emotion
		// ReactiveSearch uses emotion and this will inline the styles
		// so you can get the correct styles for ReactiveSearch's components
		// on the first load
		const html = renderStylesToString(
			renderToString(
				<App
					store={store}
					settings={settings}
					singleRangeProps={singleRangeProps}
					reactiveListProps={reactiveListProps}
				/>,
			),
		);

		// Send the rendered page back to the client
		res.send(renderFullPage(html, store));
	} catch (err) {
		console.error(err)
		res.status(500).end()
	}
}

// This is fired every time the server side receives a request
app.use(handleRender);
app.listen(port, (error) => {
	if (error) {
		console.error(error);
	} else {
		// eslint-disable-next-line
		console.info(
			`==> 🌎  Listening on port ${port}. Open up http://localhost:${port}/ in your browser.`,
		);
	}
});
