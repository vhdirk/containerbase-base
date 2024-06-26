#--------------------------------------
#--------------------------------------
# Image: base
#--------------------------------------
FROM ubuntu:focal as base

RUN touch /.dummy

ARG APT_HTTP_PROXY
ARG CONTAINERBASE_CDN
ARG CONTAINERBASE_DEBUG

ENV BASH_ENV=/usr/local/etc/env
SHELL ["/bin/bash" , "-c"]

ARG TARGETARCH

COPY dist/docker/ /
COPY dist/cli/containerbase-cli-${TARGETARCH} /usr/local/containerbase/bin/containerbase-cli

RUN install-containerbase

COPY --chown=1000:0 test/dart/test test
WORKDIR /test

#--------------------------------------
# build
#--------------------------------------
FROM base as build

RUN prepare-tool dart

#--------------------------------------
# test: dart 2.x (non-root)
#--------------------------------------
FROM build as testa

USER 1000

RUN install-tool dart 2.0.0

# renovate: datasource=docker
RUN install-tool dart 2.19.6


RUN set -ex; \
    cd a; \
    dart pub upgrade;


#--------------------------------------
# test: dart 2.x (root, openstack)
#--------------------------------------
FROM base as testb

# renovate: datasource=docker
RUN install-tool dart 2.19.6

# fix test file perms for openstack
RUN chown -R 1001 .

USER 1001

RUN set -ex; \
    cd a; \
    dart pub upgrade;


#--------------------------------------
# final
#--------------------------------------
FROM base

COPY --from=testa /.dummy /.dummy
COPY --from=testb /.dummy /.dummy
