<template>
  <div id="map">
    <div id="mapdiv"></div>
  </div>
</template>

<script>
export default {
  name: "Home",
  data() {
    return {
      markers: [
        [30.0563, 31.315]
      ]
    };
  },
  mounted() {
    this.updateMap();
  },
  methods: {
    updateMap() {
      let map = new OpenLayers.Map("mapdiv");
      map.addLayer(new OpenLayers.Layer.OSM());

      let azhar = new OpenLayers.LonLat(31.315, 30.0563).transform(
        new OpenLayers.Projection("EPSG:4326"), // transform from WGS 1984
        map.getProjectionObject() // to Spherical Mercator Projection
      );

      let zoom = 14;

      let markers = new OpenLayers.Layer.Markers("Markers");
      map.addLayer(markers);

      for (let coordinates of this.markers) {
        let lonLat = new OpenLayers.LonLat(
          coordinates[1],
          coordinates[0]
        ).transform(
          new OpenLayers.Projection("EPSG:4326"), // transform from WGS 1984
          map.getProjectionObject() // to Spherical Mercator Projection
        );

        let mark = new OpenLayers.Marker(lonLat);
        markers.addMarker(mark);
      }

      map.setCenter(azhar, zoom);
    }
  }
};
</script>

<style lang="sass">
#map
  height: 50vh
  width: 70vw
  margin: 0 auto
#mapdiv
  height: 100%
  width: auto
</style>
