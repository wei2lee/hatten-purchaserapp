#!/bin/bash
PROJECT_NAME="Purchaser"
SCHEME_NAME="Purchaser"
STARTTIME=$(date +%s);
APP_NAME="infradesign_hattenpurchaser"
PROVISION_NAME="InfraDesign ProSync Inhouse"

CURR_PATH=`pwd`

if [[ $CORDOVA_PLATFORMS == *"ios"* ]]
then
echo "ios"
# #echo "$CURR_PATH"/platforms/ios
# cd "$CURR_PATH"/platforms/ios
# echo "=========================================="
# cd "$CURR_PATH"/platforms/ios
# echo "=========================================="
# echo "xcodebuild clean -project $PROJECT_NAME.xcodeproj -configuration Release -alltargets"
# #xcodebuild -destination generic/platform=iOS -scheme "$SCHEME_NAME" -configuration Release clean archive -archivePath build/"$PROJECT_NAME" 
# echo "=========================================="
# echo "xcodebuild archive -project $PROJECT_NAME.xcodeproj -scheme $SCHEME_NAME -archivePath build/$PROJECT_NAME.xcarchive -destination generic/platform=iOS"
# #xcodebuild -exportArchive -exportFormat ipa -archivePath "build/$PROJECT_NAME.xcarchive" -exportPath "build/$APP_NAME.ipa" -exportProvisioningProfile "$PROVISION_NAME"

# echo "=========================================="
# echo "xcodebuild -exportArchive -archivePath build/$PROJECT_NAME.xcarchive -exportPath build/$APP_NAME.ipa -exportFormat ipa -exportProvisioningProfile \"$PROVISION_NAME\""
# echo "=========================================="
# cp "build/$APP_NAME.ipa" "$CURR_PATH"/../../dist
fi


if [[ $CORDOVA_PLATFORMS == *"android"* ]]
then
echo "android"
cp $CURR_PATH/platforms/android/build/outputs/apk/android-debug.apk ../../dist/$APP_NAME.apk
fi
