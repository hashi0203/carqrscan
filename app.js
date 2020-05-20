var app = new Vue({
  el: '#app',
  data: {
    scanner: null,
    activeCameraId: null,
    cameras: [],
    scans: []
  },
  mounted: function () {
    var self = this;
    self.scanner = new Instascan.Scanner({ video: document.getElementById('preview'), scanPeriod: 5 });
    self.scanner.addListener('scan', function (content, image) {
      self.scans.unshift({ date: +(Date.now()), content: content });
    });
    Instascan.Camera.getCameras().then(function (cameras) {
      self.cameras = cameras;
      if (cameras.length > 0) {
        self.activeCameraId = cameras[0].id;
        self.scanner.start(cameras[0]);
      } else {
        console.error('No cameras found.');
      }
    }).catch(function (e) {
      console.error(e);
    });
  },
  methods: {
    formatName: function (name) {
      return name || '(unknown)';
    },
    selectCamera: function (camera) {
      this.activeCameraId = camera.id;
      this.scanner.start(camera);
    },
    decode: function(scans) {
      var shakensho = {sd: null, kr: null, ym: null, st: null, ks1: null, ks2: null, zmm: null, zmu: null, zum: null, zuu: null, sk: null, ks: null, kh: null, os: null, np: null, no: null, pm: null, hk: null, ns: null, zt: null, hm: null, sb: null, gk: null, cs: null};
      if (scans.length === 0) {
        return null;
      }
      for (var scan of scans) {
        scan = scan.content.replace(/\s+/g, "").split('/');
        var l = scan.length;
        if (l == 6) {
          shakensho['sd'] = scan[1];
          shakensho['kr'] = scan[2];
          shakensho['ym'] = scan[3];
          shakensho['st'] = scan[4];
          shakensho['ks1'] = scan[5];
        } else if (l == 7 && scan[1] != "" && scan[2] != "") {
          shakensho['ks2'] = scan[0];
          shakensho['zmm'] = scan[1];
          shakensho['zmu'] = scan[2];
          shakensho['zum'] = scan[3];
          shakensho['zuu'] = scan[4];
          shakensho['sk'] = scan[5];
        } else if (l == 8) {
          shakensho['ks'] = scan[0];
          shakensho['kh'] = scan[1];
          shakensho['os'] = scan[2];
          shakensho['np'] = scan[3];
          shakensho['no'] = scan[4];
          shakensho['pm'] = scan[5];
          shakensho['hk'] = scan[6];
          shakensho['ns'] = scan[7];
        } else if (l == 2) {
          shakensho['zt'] = scan[1];
        } else if (l == 5 && scan[0].length == 0 && scan[1].length == 1) {
          shakensho['hm'] = scan[1];
          shakensho['sb'] = scan[2];
          shakensho['gk'] = scan[3];
          shakensho['cs'] = scan[4];
        }
      }
      console.log(shakensho);
      return shakensho;

      // console.log(scans);
      // console.log(scans[0].content.replace(/\s+/g, "").split('/'));
      // return scans[0].content.replace(/\s+/g, "").split('/')[0];
      // var items = [];
      // for (var scan in scans) {
      //   items.concat(scan.content.split('/'));
      // }
      // return items;
    }
  }
});
