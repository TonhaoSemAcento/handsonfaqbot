var zipFolder = require('zip-folder');
var path = require('path');
var fs = require('fs');
var request = require('request');

var rootFolder = path.resolve('.');
var zipPath = path.resolve(rootFolder, '../qnafactbot99b.zip');
var kuduApi = 'https://qnafactbot99b.scm.azurewebsites.net/api/zip/site/wwwroot';
var userName = '$qnafactbot99b';
var password = 'eJuN3cGc3E861fwLfjTCceXfJujFuzatTx7uaXYqJjT1peag3cMr9FJo94M4';

function uploadZip(callback) {
  fs.createReadStream(zipPath).pipe(request.put(kuduApi, {
    auth: {
      username: userName,
      password: password,
      sendImmediately: true
    },
    headers: {
      "Content-Type": "applicaton/zip"
    }
  }))
  .on('response', function(resp){
    if (resp.statusCode >= 200 && resp.statusCode < 300) {
      fs.unlink(zipPath);
      callback(null);
    } else if (resp.statusCode >= 400) {
      callback(resp);
    }
  })
  .on('error', function(err) {
    callback(err)
  });
}

function publish(callback) {
  zipFolder(rootFolder, zipPath, function(err) {
    if (!err) {
      uploadZip(callback);
    } else {
      callback(err);
    }
  })
}

publish(function(err) {
  if (!err) {
    console.log('qnafactbot99b publish');
  } else {
    console.error('failed to publish qnafactbot99b', err);
  }
});