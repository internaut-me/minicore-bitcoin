var express = require('express');
var app = express();
var bitcoin = require('bitcoin');
var btclib = require('bitcoinjs-lib');
var dconfig = require('./btcd_config.json');
var client = new bitcoin.Client({
	host:dconfig.host,
	port:dconfig.port,
	user:dconfig.user,
	pass:dconfig.pass,
	timeout: dconfig.timeout
});

app.all('*',function(req,res,next){
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
});

app.get('/', function(req, res) {
    res.send('API root, type /btc/ for bitcoind and /lib/ for bitcoinjs-lib(coming soon)');

});
app.get('/btc', function(req, res) {
    res.send('Working Function List<br />getinfo<br />getpeerinfo<br />backupwallet/:backupname');

});
//Get Basic Info
app.get('/btc/getinfo', function(req, res) {
  client.getInfo(function(err, gotInfo, resHeaders) {
    if (err) return res.send(err);
    res.send(gotInfo);
   });
});
//Get Peer Info
app.get('/btc/getpeerinfo', function(req, res) {
  client.getPeerInfo(function(err, gotInfo, resHeaders) {
    if (err) return res.send(err);
    res.send(gotInfo);
   });
});
//Backup Wallet
app.get('/btc/backupwallet/:backupname', function(req, res) {
	client.backupWallet('/home/'+dconfig.miniuser+'/'+req.params.backupname+'.dat',function(err,response,resHeaders){
	if (err) return res.send(err);
	if(response == null){res.send('Backup located at /home/'+dconfig.miniuser+'/'+req.params.backupname+'.dat on your mini');}
	});
});


app.get('/btc/:command',function(req,res){
	client.cmd(req.params.command,function(err,response, resHeaders){
		if(err) return res.send(err);
		res.send(response);
	});
});
var server = app.listen(3000,function(){
       console.log('minicore-bitcoin API running on port 3000');
});
