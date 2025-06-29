#!/bin/bash
# Info: This script creates a temporary upload directory in @/data/var/uploads
# Usage: crateTempUploadDir <descriptor>
# Example: createTempUploadDir "analyze"
#   got the directory: /data/var/uploads/analyze_1232167890_12345

# calc dir name
descriptor="$1"
timestamp=$(date +%s)
rand=$RANDOM
dirname="${descriptor}_${timestamp}_${rand}"
dirpath = "$PROJECT_ROOT_PATH/data/var/uploads/$dirname"

# create the directory with mode 755
touch $dirpath
chmod 755 $dirpath