import ReactDOM from 'react-dom/client';
import {
	ReactiveBase,
	DataSearch,
	ReactiveList,
	ResultCard,
	SelectedFilters,
} from '@appbaseio/reactivesearch';

import './index.css';

const Main = () => (
	<ReactiveBase
		app="good-books-ds"
		url="https://a03a1cb71321:75b6603d-9456-4a5a-af6b-a487b309eb61@appbase-demo-ansible-abxiydt-arc.searchbase.io"
		enableAppbase
		appbaseConfig={{
			recordAnalytics: true,
		}}
		preferences={{
			pages: {
				home: {
					componentSettings: {
						BookSensor: {
							enabled: true,
							rsConfig: {
								title: 'DataSearch Path',
								dataField: ['original_title', 'original_title.search'],
								URLParams: true,
								size: 5,
							},
						},
					},
				},
			},
			componentSettings: {
				SearchResult: {
					rsConfig: {
						componentId: 'SearchResult',
						dataField: 'original_title',
						size: 10,
						className: 'result-list-container',
						pagination: true,
						URLParams: true,
						react: {
							and: 'BookSensor',
						},
					},
				},
			},
		}}
	>
		<div className="row">
			<div className="col">
				<DataSearch
					componentId="BookSensor"
					preferencesPath="pages.home.componentSettings.BookSensor"
				/>
			</div>

			<div className="col">
				<SelectedFilters />
				<ReactiveList
					componentId="SearchResult"
					render={({ data }) => (
						<ReactiveList.ResultCardsWrapper>
							{data.map((item) => (
								<ResultCard id={item._id} key={item._id}>
									<ResultCard.Image src={item.image} />
									<ResultCard.Title>
										<div
											className="book-title"
											dangerouslySetInnerHTML={{
												__html: item.original_title,
											}}
										/>
									</ResultCard.Title>

									<ResultCard.Description>
										<div className="flex column justify-space-between">
											<div>
												<div>
													by{' '}
													<span className="authors-list">
														{item.authors}
													</span>
												</div>
												<div className="ratings-list flex align-center">
													<span className="stars">
														{
															/* eslint-disable */
															Array(item.average_rating_rounded)
																.fill('x')
																.map((_, index) => (
																	<i
																		className="fas fa-star"
																		key={index}
																	/>
																))
															/* eslint-enable */
														}
													</span>
													<span className="avg-rating">
														({item.average_rating} avg)
													</span>
												</div>
											</div>
											<span className="pub-year">
												Pub {item.original_publication_year}
											</span>
										</div>
									</ResultCard.Description>
								</ResultCard>
							))}
						</ReactiveList.ResultCardsWrapper>
					)}
				/>
			</div>
		</div>
	</ReactiveBase>
);
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Main />);
