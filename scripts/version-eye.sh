#!/bin/bash

# Example for running script:
# version-eye.sh FILE_1 FILE_2

# version-eye.sh "C:\Job\yaas-storefront\bower.json" "C:\Job\yaas-storefront\package.json"

BASE_DIR=`dirname $0`
DEST_FILE=$BASE_DIR/result.json

function jsonval {
    temp=`echo $json | sed 's/\\\\\//\//g' | sed 's/[{}]//g' | awk -v k="text" '{n=split($0,a,","); for (i=1; i<=n; i++) print a[i]}' | sed 's/\"\:\"/\|/g' | sed 's/[\,]/ /g' | sed 's/\"//g' | grep -w $prop`
    echo ${temp##*|}
}

echo ""
echo "Creating new project in version eye and uploading $1"
echo "-------------------------------------------------------------------"

json=`curl --form upload=@$1 https://versioneye.hybris.com/api/v2/projects?api_key=7fe24345cea494dfdad8`
prop='id'
idVal=`jsonval`

echo ""
echo "Uploading $2"
echo ""

json=`curl --form project_file=@$2 https://versioneye.hybris.com/api/v2/projects/${idVal}?api_key=7fe24345cea494dfdad8`

echo ""
echo "Get state of dependencies"
echo ""

json=`curl https://versioneye.hybris.com/api/v2/projects/${idVal}?api_key=7fe24345cea494dfdad8`

echo "Writing json response to $DEST_FILE"
echo "$json" > "$DEST_FILE"

echo ""
echo "Delete newly created project"
echo ""

json=`curl -X "DELETE" https://versioneye.hybris.com/api/v2/projects/${idVal}?api_key=7fe24345cea494dfdad8`

echo ""
echo "Finished!"
echo ""