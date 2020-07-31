const Instascan = require('instascan');

var app = new Vue({
  el: '#app',
  data: {
    scanner: null,
    activeCameraId: null,
    cameras: [],
    scans: [],
    qrs: [[1,0,0,0,0,0,1,1],[0,0,0,0,0,1]],
    cartype: 'mid'
  },
  mounted: function () {
    // prepare camera
    var self = this;
    self.scanner = new Instascan.Scanner({ video: document.getElementById('preview'), scanPeriod: 5, inferEncoding: true });
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
    toggle: function(mode) {
      this.cartype = mode;
    },
    formatName: function (name) {
      return name || '(unknown)';
    },
    selectCamera: function (camera) {
      this.activeCameraId = camera.id;
      this.scanner.start(camera);
    },
    decode: function() {
      var scans = this.scans;
      var shakenshos = [{sd: ["車台番号打刻位置"], kr: ["型式指定番号,類別区分番号"], ym: ["有効期間の満了する日"], st: ["初度登録年月"], ks1: ["型式"], ks2: ["型式(続き)"], zmm: ["軸重(前前)"], zmu: ["軸重(前後)"], zum: ["軸重(後前)"], zuu: ["軸重(後後)"], sk: ["騒音規制"], ks: ["近接排気騒音規制値"], kh: ["駆動方式"], os: ["オパシメータ測定車"], np: ["NOx・PM測定モード"], no: ["NOx値"], pm: ["PM値"], hk: ["保安基準適用年月日"], ns: ["燃料の種別コード"], zt: ["自動車登録番号"], hm: ["標板の枚数及び大きさ"], sb: ["車台番号"], gk: ["原動機型式"], cs: ["帳票種別"]}, {sh: ["自動車の種別"], yt: ["用途"], zz: ["自家用・事業用の別"], kz: ["車体の形状"], t1: ["乗車定員1"], t2: ["乗車定員2"], s1: ["最大積載量1"], s2: ["最大積載量2"], z1: ["車両総重量1"], z2: ["車両総重量2"], sm: ["車名(番号)"], skh: ["走行距離計・表示値"], skk: ["走行距離計・区分(km,mi)"], sz: ["使用者住所"], ss: ["使用者氏名"], sd: ["車台番号打刻位置"], kr: ["型式指定番号,類別区分番号"], ym: ["有効期間の満了する日"], st: ["初度登録年月"], ks: ["型式"], zmm: ["軸重(前前)"], zmu: ["軸重(前後)"], zum: ["軸重(後前)"], zuu: ["軸重(後後)"], sk: ["騒音規制"], ks: ["近接排気騒音規制値"], kh: ["駆動方式"], os: ["オパシメータ測定車"], np: ["NOx・PM測定モード"], no: ["NOx値"], pm: ["PM値"], zt: ["車両番号"], hm: ["標板の枚数及び大きさ"], sb: ["車台番号"], gk: ["原動機型式"], cs: ["帳票種別"], ys: ["輸出整理番号"]}];
      if (this.cartype == "mid") {
        var qrs = this.qrs[0];
        var shakensho = shakenshos[0];
        if (scans.length === 0) {
          return shakensho;
        }
        for (var scan of scans) {
          // document.getelementById('qr-0').style.opacity = 0.4;
          scan = scan.content.replace(/\s+/g, "").split('/');
          var l = scan.length;
          if (l == 6) {
            shakensho['sd'].push(scan[1]);
            shakensho['kr'].push(scan[2]);
            shakensho['ym'].push(scan[3]);
            shakensho['st'].push(scan[4]);
            shakensho['ks1'].push(scan[5]);
            qrs[1] = 1;
          } else if (l == 7 && scan[1] != "" && scan[2] != "") {
            shakensho['ks2'].push(scan[0]);
            shakensho['zmm'].push(scan[1]);
            shakensho['zmu'].push(scan[2]);
            shakensho['zum'].push(scan[3]);
            shakensho['zuu'].push(scan[4]);
            shakensho['sk'].push(scan[5]);
            qrs[2] = 1;
          } else if (l == 8) {
            shakensho['ks'].push(scan[0]);
            shakensho['kh'].push(scan[1]);
            shakensho['os'].push(scan[2]);
            shakensho['np'].push(scan[3]);
            shakensho['no'].push(scan[4]);
            shakensho['pm'].push(scan[5]);
            shakensho['hk'].push(scan[6]);
            shakensho['ns'].push(scan[7]);
            qrs[3] = 1;
          } else if (l == 2) {
            shakensho['zt'].push(scan[1]);
            qrs[4] = 1;
          } else if (l == 5 && scan[0].length == 0 && scan[1].length == 1) {
            shakensho['hm'].push(scan[1]);
            shakensho['sb'].push(scan[2]);
            shakensho['gk'].push(scan[3]);
            shakensho['cs'].push(scan[4]);
            qrs[5] = 1;
          }
        }
        for (var q of qrs) {
          if (q != 1) return shakensho;
        }
      } else if (this.cartype == "small") {
        var qrs = this.qrs[1];
        var shakensho = shakenshos[1];
        if (scans.length === 0) {
          return shakensho;
        }
        for (var scan of scans) {
          scan = scan.content.replace(/\s+/g, "").split('/');
          var l = scan.length;
          if (l == 15) {
            shakensho['sh'].push(scan[2]);
            shakensho['yt'].push(scan[3]);
            shakensho['zz'].push(scan[4]);
            shakensho['kz'].push(scan[5]);
            shakensho['t1'].push(scan[6]);
            shakensho['t2'].push(scan[7]);
            shakensho['s1'].push(scan[8]);
            shakensho['s2'].push(scan[9]);
            shakensho['z1'].push(scan[10]);
            shakensho['z2'].push(scan[11]);
            shakensho['sm'].push(scan[12]);
            shakensho['skh'].push(scan[13]);
            shakensho['skk'].push(scan[14]);
            qrs[0] = 1;
          } else if (l == 3 && scan[1][0] == '6') {
            shakensho['sz'].push(scan[2]);
            qrs[1] = 1;
          } else if (l == 3 && scan[1][0] == '5') {
            shakensho['ss'].push(scan[2]);
            qrs[2] = 1;
          } else if (l == 19) {
            shakensho['sd'].push(scan[2]);
            shakensho['kr'].push(scan[3]);
            shakensho['ym'].push(scan[4]);
            shakensho['st'].push(scan[5]);
            shakensho['ks'].push(scan[6]);
            shakensho['zmm'].push(scan[7]);
            shakensho['zmu'].push(scan[8]);
            shakensho['zum'].push(scan[9]);
            shakensho['zuu'].push(scan[10]);
            shakensho['sk'].push(scan[11]);
            shakensho['ks'].push(scan[12]);
            shakensho['kh'].push(scan[13]);
            shakensho['os'].push(scan[14]);
            shakensho['np'].push(scan[15]);
            shakensho['no'].push(scan[16]);
            shakensho['pm'].push(scan[17]);
            qrs[3] = 1;
          } else if (l == 7) {
            shakensho['zt'].push(scan[2]);
            shakensho['hm'].push(scan[3]);
            shakensho['sb'].push(scan[4]);
            shakensho['gk'].push(scan[5]);
            shakensho['cs'].push(scan[6]);
            qrs[4] = 1;
          // } else if (l == 6) {
          //   shakensho['ys'].push(scan[2]);
          //   qrs[5] = 1;
          }
        }
        for (var q of qrs) {
          if (q != 1) return shakensho;
        }
      }
      alert('すべてのQRコードをスキャンしました');
      return shakensho;
    }
  }
});
