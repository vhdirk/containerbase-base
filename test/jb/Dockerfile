#--------------------------------------
# Image: base
#--------------------------------------
FROM ghcr.io/containerbase/ubuntu:20.04 AS base

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

COPY --chown=1000:0 test/jb/test test
WORKDIR /test

#--------------------------------------
# build
#--------------------------------------
FROM base AS build

USER 1000

# renovate: datasource=github-releases packageName=jsonnet-bundler/jsonnet-bundler
RUN install-tool jb v0.5.1


#--------------------------------------
# test: jb install
#--------------------------------------

FROM build AS testa

RUN set -ex; \
    jb install; \
    test -d vendor/github.com/prometheus-operator/prometheus-operator; \
    test -d vendor/prometheus-operator

#--------------------------------------
# final
#--------------------------------------
FROM base

COPY --from=testa /.dummy /.dummy
