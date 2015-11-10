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
	var url = req.get('host');
    res.send('Working Function List<br /><a href="http://'+url+'/btc/getinfo">getinfo</a><br /><a href="http://'+url+'/btc/getpeerinfo">getpeerinfo</a><br /><a href="http://'+url+'/btc/backupwallet/walletbackup1">backupwallet/:backupname</a>');

});
//Backup Wallet
app.get('/btc/backupwallet/:backupname', function(req, res) {
	client.backupWallet('/home/'+dconfig.miniuser+'/'+req.params.backupname+'.dat',function(err,response,resHeaders){
	if (err) return res.send(err);
	if(response == null){res.send('Backup located at /home/'+dconfig.miniuser+'/'+req.params.backupname+'.dat on your mini');}
	});
});
//Add Node
app.get('/btc/addnode/:nodeadd', function(req, res) {
  client.cmd('addnode',req.params.nodeadd,'add',function(err, gotInfo, resHeaders) {
    if (err) return res.send(err);
    res.send(gotInfo);
   });
});
//List Accounts
app.get('/btc/listaccounts', function(req, res) {
  client.cmd('listaccounts','0',function(err, gotInfo, resHeaders) {
    if (err) return res.send(err);
    res.send(gotInfo);
   });
});
//Set Transaction Fee
app.get('/btc/settxfee/:fee', function(req, res) {
  client.cmd('settxfee',req.params.fee,function(err, gotInfo, resHeaders) {
    if (err) return res.send(err);
    res.send(gotInfo);
   });
});
//Validate Address
app.get('/btc/validateaddress/:add', function(req, res) {
  client.cmd('validateaddress',req.params.add,function(err, gotInfo, resHeaders) {
    if (err) return res.send(err);
    res.send(gotInfo);
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
