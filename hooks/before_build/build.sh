#!/usr/bin/env node
var sys = require('sys')
var exec = require('child_process').exec;

var gulp = require('gulp');
var path  = require('path');

var rootdir = process.argv[2];
var gulpfile = path.join(rootdir, 'gulpfile.js');

function puts(error, stdout, stderr) {
    console.log("Start hooks/before_build/build.sh Gulp Task - AutoPrefixer");
    console.log(rootdir);
    console.log(gulpfile);
}
exec("gulp", puts);