import GmapVue, { components } from 'gmap-vue';
import VueTypes from 'vue-types';
import { componentTypes } from '@appbaseio/reactivecore/lib/utils/constants';
import { RMConnected } from './ReactiveMap.jsx';
import GoogleMapMarkers from './GoogleMapMarkers.jsx';
import types from '../../utils/vueTypes';

const { MapLayer: Map } = components;

const ReactiveGoogleMap = {
	name: 'ReactiveGoogleMap',
	props: {
		className: types.string,
		componentId: types.stringRequired,
		dataField: types.stringRequired,
		defaultQuery: VueTypes.func,
		loader: types.title,
		defaultZoom: VueTypes.number.def(13),
		react: types.react,
		size: types.number,
		sortBy: types.sortBy,
		URLParams: VueTypes.bool,
		mapProps: VueTypes.object,
		showMarkers: VueTypes.bool.def(true),
		showMarkerClusters: VueTypes.bool.def(false),
		searchAsMove: VueTypes.bool.def(false),
		searchAsMoveLabel: VueTypes.string,
		markerProps: VueTypes.object,
		clusterProps: VueTypes.object,
		renderItem: VueTypes.func,
		showSearchAsMove: VueTypes.bool.def(true),
		autoClosePopover: VueTypes.bool,
		pagination: VueTypes.bool,
		defaultPin: VueTypes.string,
		autoCenter: VueTypes.bool,
		defaultCenter: types.location,
		center: types.location,
		defaultRadius: types.number,
		unit: types.string,
		pages: VueTypes.number.def(5),
		calculateMarkers: VueTypes.func,
		highlightMarkerOnHover: VueTypes.bool.def(true),
	},
	methods: {
		renderMap({
			resultsToRender,
			center,
			zoom,
			handleZoomChange,
			handleOnDragEnd,
			handleOnIdle,
			renderSearchAsMove,
			handlePreserveCenter,
			getPosition,
			autoClosePopover,
			defaultPin,
		}) {
			const style = {
				width: '100%',
				height: '100%',
				position: 'relative',
			};
			return (
				<div style={style}>
					<Map
						ref="mapRef"
						map-type-id="terrain"
						style={{
							height: '100%',
						}}
						options={{
							zoomControl: true,
						}}
						center={center}
						zoom={zoom}
						{...{ props: this.mapProps }}
						onzoom_changed={handleZoomChange}
						ondragend={handleOnDragEnd}
						onidle={handleOnIdle}
					>
						{this.showMarkers ? (
							<GoogleMapMarkers
								resultsToRender={resultsToRender}
								getPosition={getPosition}
								markerProps={this.markerProps}
								clusterProps={this.clusterProps}
								handlePreserveCenter={handlePreserveCenter}
								highlightMarkerOnHover={this.highlightMarkerOnHover}
								renderItem={
									this.$scopedSlots.renderItem
										? () => ({
											custom: this.$scopedSlots.renderItem,
										  })
										: this.renderItem
								}
								defaultPin={defaultPin}
								autoClosePopover={autoClosePopover}
								renderPopover={this.$scopedSlots.renderPopover}
								renderClusterPopover={this.$scopedSlots.renderClusterPopover}
								showMarkerClusters={this.showMarkerClusters}
								{...{
									on: this.$listeners,
								}}
							/>
						) : null}
					</Map>
					{renderSearchAsMove()}
				</div>
			);
		},
		getMapRef() {
			return this.mapRef;
		},
		removeMarkers() {
			let clusterManagerInstance;
			let currentInstance = this;
			while (currentInstance) {
				if (
					currentInstance
					&& currentInstance.$options
					&& currentInstance.$options.name === 'connect-ClusterMarkers'
				) {
					clusterManagerInstance = currentInstance;
					currentInstance = null;
				} else if (currentInstance.$children) {
					[currentInstance] = currentInstance.$children;
				} else {
					currentInstance = null;
				}
			}
			if (clusterManagerInstance && clusterManagerInstance.removeMarkers) {
				clusterManagerInstance.removeMarkers();
			}
		},
	},
	mounted() {
		if (this.$refs.mapRef) {
			this.$refs.mapRef.$mapPromise.then((map) => {
				this.mapRef = map;
			});
		}
	},
	render() {
		return (
			<RMConnected
				getMapRef={this.getMapRef}
				renderMap={this.renderMap}
				componentId={this.componentId}
				className={this.className}
				dataField={this.dataField}
				defaultZoom={this.defaultZoom}
				react={this.react}
				size={this.size}
				sortBy={this.sortBy}
				pagination={this.pagination}
				URLParams={this.URLParams}
				defaultSearchAsMove={this.searchAsMove}
				showSearchAsMove={this.showSearchAsMove}
				searchAsMoveLabel={this.searchAsMoveLabel}
				showMarkers={this.showMarkers}
				markerProps={this.markerProps}
				autoClosePopover={this.autoClosePopover}
				defaultPin={this.defaultPin}
				defaultQuery={this.defaultQuery}
				autoCenter={this.autoCenter}
				defaultCenter={this.defaultCenter}
				defaultRadius={this.defaultRadius}
				unit={this.unit}
				pages={this.pages}
				center={this.center}
				loader={this.loader}
				calculateMarkers={this.calculateMarkers}
				{...{
					scopedSlots: this.$scopedSlots,
					on: this.$listeners,
				}}
			/>
		);
	},
};

ReactiveGoogleMap.install = function (Vue, options) {
	Vue.component(ReactiveGoogleMap.name, ReactiveGoogleMap);
	if (!options || !options.key) {
		console.error('ReactiveSearch: map key is required to use ReactiveGoogleMap component');
	}
	Vue.use(GmapVue, {
		load: {
			key: options.key,
			libraries: 'places',
		},
		installComponents: false,
	});
};

// Add componentType for SSR
ReactiveGoogleMap.componentType = componentTypes.reactiveMap;

export default ReactiveGoogleMap;
