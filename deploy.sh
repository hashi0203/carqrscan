sudo rm -r instascan
git clone https://github.com/hashi0203/instascan.git instascan
rm -r node_modules
npm install
browserify app.js -o bundle.js

