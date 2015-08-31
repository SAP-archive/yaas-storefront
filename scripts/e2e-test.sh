#!/bin/bash

BASE_DIR=`dirname $0`
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
