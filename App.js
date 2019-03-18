/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */

import React, { Component } from "react";
import {
  Platform,
  StyleSheet,
  Button,
  Text,
  TouchableOpacity,
  Icon,
  View,
  NativeModules,
  Dimensions
} from "react-native";
//import Icon from 'react-native-vector-icons'
import MapboxGL from "@mapbox/react-native-mapbox-gl";
//import geoViewport from '@mapbox/geo-viewport';
const CENTER_COORD = [-82.4142, 23.1075];
const CENTER_COORD4 = [-82.4142, 23.1075];
import exampleIcon from './src/assets/example.png';
const instructions = Platform.select({
  ios: "Press Cmd+R to reload,\n" + "Cmd+D or shake for dev menu",
  android:
    "Double tap R on your keyboard to reload,\n" +
    "Shake or press menu button for dev menu"
});

type Props = {};
export default class App extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {
      zoomLevel: 12,
      pointInView: null,
      featureCollection: MapboxGL.geoUtils.makeFeatureCollection(),
    };
  }
  zoomIn = () => {
    if (this.state.zoomLevel > 0) {
      let zoom = this.state.zoomLevel - 1;
      this.setState({ zoomLevel: zoom });
      //alert(this.state.zoomLevel)
    }
  };
  zoomOut = () => {
    if (this.state.zoomLevel < 20) {
      let zoom = this.state.zoomLevel + 1;
      this.setState({ zoomLevel: zoom });
    }
  };
  saveOfflineMap = () => {
    const options = {
      name: "Habana",
      styleURL: MapboxGL.StyleURL.Street,
      bounds: [CENTER_COORD, CENTER_COORD4],
      minZoom: 12,
      maxZoom: 20
    };
    MapboxGL.offlineManager.createPack(options, this.onDownloadProgress);
  };
  onDownloadProgress(offlineRegion, offlineRegionStatus) {
    if(offlineRegionStatus.percentage == 100){
      alert("Se descargo el mapa completo")
    }
    console.log(offlineRegionStatus);
  }
  onPressOnMap = async (e) => {
    let feature = MapboxGL.geoUtils.makeFeature(e.geometry);
    feature.id = '' + Date.now();

    this.setState({
      featureCollection: MapboxGL.geoUtils.addToFeatureCollection(
        this.state.featureCollection,
        feature,
      ),
    });
    console.log(this.state)
  }
  deletePacks = async () => {
    await MapboxGL.offlineManager.deletePack("Habana");
    alert("Pack Eliminado");
  };
  getPacks = async () => {
    const offlinePacks = await MapboxGL.offlineManager.getPacks();
    if(offlinePacks == null){
      alert("No hay Mapas Guardados")
    }
    console.log(offlinePacks);
  };
  getVisibleBounds =  () => {
    
  };
  render() {
    
    this.getPacks();
    //this.getVisibleBounds()
    return (
      <View style={styles.container}>
        <MapboxGL.MapView
          showUserLocation={true}
          zoomLevel={this.state.zoomLevel}
          centerCoordinate={CENTER_COORD}
          logoEnabled={false}
          ref={(c) => (this._map = c)}
          styleURL={MapboxGL.StyleURL.Street}
          compassEnabled={true}
          onPress={e => this.onPressOnMap(e)}
          //zoomLevel={8}
          //userTrackingMode={MapboxGL.UserTrackingModes.Follow}
          style={styles.matchParent}
          
        >
        <MapboxGL.ShapeSource
            id="symbolLocationSource"
            hitbox={{ width: 20, height: 20 }}
            onPress={this.onSourceLayerPress}
            shape={this.state.featureCollection}>
            <MapboxGL.SymbolLayer
              id="symbolLocationSymbols"
              minZoomLevel={1}
              style={styles2.icon}
            />
          </MapboxGL.ShapeSource>
        </MapboxGL.MapView>
        <TouchableOpacity
          onPress={this.zoomOut}
          style={{
            borderWidth: 1,
            borderColor: "rgba(0,0,0,0.2)",
            alignItems: "center",
            justifyContent: "center",
            width: 70,
            position: "absolute",
            bottom: Dimensions.get("screen").height / 2,
            right: 10,
            height: 70,
            backgroundColor: "#fff",
            borderRadius: 100
          }}
        >
          <Text>+</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={this.zoomIn}
          style={{
            borderWidth: 1,
            borderColor: "rgba(0,0,0,0.2)",
            alignItems: "center",
            justifyContent: "center",
            width: 70,
            position: "absolute",
            bottom: Dimensions.get("screen").height / 1.59,
            right: 10,
            height: 70,
            backgroundColor: "#fff",
            borderRadius: 100
          }}
        >
          <Text>-</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={this.getPacks}
          style={{
            borderWidth: 1,
            borderColor: "rgba(0,0,0,0.2)",
            alignItems: "center",
            justifyContent: "center",
            width: 70,
            position: "absolute",
            bottom: Dimensions.get("screen").height / 1.29,
            right: 10,
            height: 70,
            backgroundColor: "#fff",
            borderRadius: 100
          }}
        >
          <Text>Save</Text>
        </TouchableOpacity>
        <Button
          style={{ marginBottom: 20 }}
          title="Guardar Maps"
          onPress={this.saveOfflineMap}
        />
        <Button
          style={{ marginBottom: 20 }}
          title="Eliminar Packs"
          onPress={this.deletePacks}
        />
       
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF"
  },
  welcome: {
    fontSize: 20,
    textAlign: "center",
    margin: 10
  },
  instructions: {
    textAlign: "center",
    color: "#333333",
    marginBottom: 5
  },
  matchParent: {
    // flex: 1,
    height: Dimensions.get("screen").height - 100,
    width: Dimensions.get("screen").width
  }
});
const styles2 = MapboxGL.StyleSheet.create({
  icon: {
    iconImage: exampleIcon,
    iconAllowOverlap: true,
    iconSize: 0.5,
  },
});

