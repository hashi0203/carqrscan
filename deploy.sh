#INSTA="instascan"
##if [ -d $INSTA ]; then
#	sudo rm -r ${INSTA}
#fi
#git clone https://github.com/hashi0203/instascan.git ${INSTA}
MODULES="node_moudles"
if [ -d $MODULES ]; then
	rm -r $MODULES
fi
npm install
browserify app.js -o bundle.js

