#/bin/bash

for file in *.jpg
do
	cwebp -q 90 "$file" -o "${file%.jpg}.webp"
done
