#/bin/sh
#SAVEIFS=$IFS
#IFS=$(echo -en "\n\b")
for f in $1/*;
do
#echo "ffmpeg -y -i $f -vf scale=720:-1 $f";
ffmpeg -y -i $f -vf scale=720:-1 $f
done;
#retore $IFS
#IFS=$SAVEIFS
