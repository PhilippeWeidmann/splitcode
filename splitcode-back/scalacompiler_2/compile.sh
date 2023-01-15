#!/bin/bash
cd "${0%/*}"

if [ "$1" = "fast" ]; then
    sbt -client fastLinkJS
else
    sbt -client fullLinkJS
fi
