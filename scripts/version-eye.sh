#!/bin/bash

# Example for running script:
# version-eye.sh API_KEY FILE_1 FILE_2

# version-eye.sh "7fe24345cea494dfdad8" "C:\Job\yaas-storefront\bower.json" "C:\Job\yaas-storefront\package.json"

BASE_DIR=`dirname $0`
DEST_FILE=$BASE_DIR/result.json

jsonval () {
    temp=`echo $json | sed 's/\\\\\//\//g' | sed 's/[{}]//g' | awk -v k="text" '{n=split($0,a,","); for (i=1; i<=n; i++) print a[i]}' | sed 's/\"\:\"/\|/g' | sed 's/[\,]/ /g' | sed 's/\"//g' | grep -w $prop`
    echo ${temp##*|}
}

echo ""
echo "Creating new project in version eye and uploading $2"
echo "-------------------------------------------------------------------"

json=`curl --form upload=@$2 https://versioneye.hybris.com/api/v2/projects?api_key=${1}`
prop='id'
idVal=`jsonval`

echo ""
echo "Uploading $3"
echo ""

json=`curl --form project_file=@$3 https://versioneye.hybris.com/api/v2/projects/${idVal}?api_key=${1}`

echo ""
echo "Get state of dependencies"
echo ""

json=`curl https://versioneye.hybris.com/api/v2/projects/${idVal}?api_key=${1}`

echo "Writing json response to $DEST_FILE"
echo "$json" > "$DEST_FILE"

echo ""
echo "Delete newly created project"
echo ""

json=`curl -X "DELETE" https://versioneye.hybris.com/api/v2/projects/${idVal}?api_key=${1}`

echo ""
echo "Finished!"
echo ""