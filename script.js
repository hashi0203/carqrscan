var videoTag = document.getElementById('preview');
var info = document.getElementById('info');
var scanner = new Instascan.Scanner({ video: videoTag });

//QRコードを認識して情報を取得する
scanner.addListener('scan', function (value) {
  info.textContent = value;
});

//PCのカメラ情報を取得する
Instascan.Camera.getCameras()
.then(function (cameras) {

    //カメラデバイスを取得できているかどうか？
    if (cameras.length > 0) {

      //スキャンの開始
      scanner.start(cameras[0]);
    }
    else {
      alert('カメラが見つかりません！');
    }
})
.catch(function(err) {
  alert(err);
});