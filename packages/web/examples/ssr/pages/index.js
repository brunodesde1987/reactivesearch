/* eslint-disable */
import React, { Component } from 'react';
import {
	ReactiveBase,
	DataSearch,
	NumberBox,
	// RangeSlider,
	ReactiveList,
	ResultCard,
} from '@appbaseio/reactivesearch';
import initReactivesearch from '@appbaseio/reactivesearch/lib/server';

const components = {
	settings: {
		app: 'airbnb-dev',
		url: 'https://a03a1cb71321:75b6603d-9456-4a5a-af6b-a487b309eb61@appbase-demo-ansible-abxiydt-arc.searchbase.io',
		theme: {
			colors: {
				primaryColor: '#FF3A4E',
			},
		},
		enableAppbase: true,
	},
	datasearch: {
		componentId: 'SearchSensor',
		dataField: ['name', 'name.search'],
		autosuggest: false,
		placeholder: 'Search by house names',
		iconPosition: 'left',
		className: 'search',
		highlight: true,
		URLParams: true,
	},
	numberbox: {
		componentId: 'GuestSensor',
		dataField: 'accommodates',
		title: 'Guests',
		defaultValue: 2,
		labelPosition: 'right',
		data: {
			start: 1,
			end: 16,
		},
		URLParams: true,
	},
	rangeslider: {
		componentId: 'PriceSensor',
		dataField: 'price',
		title: 'Price Range',
		range: {
			start: 10,
			end: 250,
		},
		rangeLabels: {
			start: '$10',
			end: '$250',
		},
		defaultValue: {
			start: 10,
			end: 50,
		},
		stepValue: 10,
		interval: 20,
	},
	resultcard: {
		className: 'right-col',
		componentId: 'SearchResult',
		dataField: 'name',
		size: 12,
		render: ({ data }) => (
			<ReactiveList.ResultCardsWrapper>
				{data.map((item) => (
					<ResultCard href={item.listing_url} key={item._id}>
						<ResultCard.Image src={item.images ? item.images[0] : ''} />
						<ResultCard.Title>{item.name}</ResultCard.Title>
						<ResultCard.Description>
							<div>
								<div className="price">${item.price}</div>
								<p className="info">
									{item.room_type} · {item.accommodates} guests
								</p>
							</div>
						</ResultCard.Description>
					</ResultCard>
				))}
			</ReactiveList.ResultCardsWrapper>
		),
		pagination: true,
		URLParams: true,
		react: {
			and: ['SearchSensor', 'GuestSensor'],
		},
		innerClass: {
			resultStats: 'result-stats',
			list: 'list',
			listItem: 'list-item',
			image: 'image',
		},
		sortOptions: [
			{
				label: 'Bed Type',
				dataField: 'bed_type',
				sortBy: 'asc',
			},
			{
				label: 'Bedrooms',
				dataField: 'bedrooms',
				sortBy: 'asc',
			},
		],
		defaultSortOption: 'Bedrooms',
	},
};

export default class Main extends Component {
	static async getInitialProps({ pathname, query }) {
		return {
			store: await initReactivesearch(
				[
					{
						...components.datasearch,
						source: DataSearch,
					},
					{
						...components.numberbox,
						source: NumberBox,
					},
					// {
					// 	...components.rangeslider,
					// 	source: RangeSlider,
					// },
					{
						...components.resultcard,
						source: ReactiveList,
					},
				],
				query,
				components.settings,
			),
		};
	}

	render() {
		return (
			<div className="container">
				<ReactiveBase {...components.settings} initialState={this.props.store}>
					<nav className="nav">
						<div className="title">Airbeds</div>
						<DataSearch {...components.datasearch} />
					</nav>
					<div className="left-col">
						<NumberBox {...components.numberbox} />
						{/* <RangeSlider {...components.rangeslider} /> */}
					</div>

					<ReactiveList {...components.resultcard} />
				</ReactiveBase>
			</div>
		);
	}
}
