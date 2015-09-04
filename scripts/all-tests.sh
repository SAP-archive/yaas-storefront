#!/bin/bash

BASE_DIR=`dirname $0`

echo "Preparing to run all tests..."

echo ""
echo "Starting Karma Server (http://karma-runner.github.io)"
echo $BASE_DIR
echo "-------------------------------------------------------------------"

echo "Running unit tests..."

$BASE_DIR/../node_modules/karma/bin/karma start $BASE_DIR/../config/karma.conf.js $*


export PATH=$PATH:$BASE_DIR/../node_modules/phantomjs/bin
echo $PATH

echo ""
echo "Updating WebDriver"
echo $BASE_DIR
echo "-------------------------------------------------------------------"

$BASE_DIR/../node_modules/protractor/bin/webdriver-manager update


echo ""
echo "Starting Protractor tests"
echo $BASE_DIR
echo "-------------------------------------------------------------------"

$BASE_DIR/../node_modules/protractor/bin/protractor $BASE_DIR/../config/protractor-conf.js $*