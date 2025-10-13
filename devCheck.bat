#!/bin/bash

export TMPDIR=/home/$USER/tmp
mkdir -p $TMPDIR

nuxt dev
