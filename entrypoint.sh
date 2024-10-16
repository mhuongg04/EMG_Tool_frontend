#!/bin/bash
# no verbose
set +x
# config
envFilename='.env.production'
buildFolder='./var/www/'
function apply_path {
  echo "start file entrypoint.sh"
  echo "------ Replacing -----"

  # read all config file  
  while read line; do
    # no comment or not empty
    echo "read: ${line}"

    if [ "${line:0:1}" == "#" ] || [ "${line}" == "" ]; then
      continue
    fi
    
    # split
    configName="$(cut -d'=' -f1 <<<"$line")"
    configValue="$(cut -d'=' -f2 <<<"$line")"

    # get system env
    envValue=$(env | grep "^$configName=" | grep -oe '[^=]*$');

    # if config found
    if [ -n "$configValue" ] && [ -n "$envValue" ]; then
      # replace all
      echo "Replace all configName: ${configName} value: ${configValue} with: ${envValue}"
      find $buildFolder \( -type d -name .git -prune \) -o -type f -print0 | xargs -0 sed -i "s#$configValue#$envValue#g"
      continue
    fi
  done < $envFilename
  echo "------ Done Replacing -----"

}
apply_path
exec "$@"