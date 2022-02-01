#!/bin/bash -e

PORT=${1:-3306}
HOST=${2:-localhost}
RETRY=60
for i in $(eval echo "{1..$RETRY}"); do
  if echo PING | nc "$HOST" "$PORT" | grep -q 'mysql'; then
    echo "mysql took $SECONDS seconds"
    exit 0
  else
    if [ "$i" -lt $RETRY ]; then
      echo -ne "\rretrying mysql [${spin:$((i%4)):1}] ($i of $RETRY)\r"
      sleep 1
    fi
  fi
done

exit 1
