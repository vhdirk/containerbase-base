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

# renovate: datasource=github-releases packageName=helm/helm
ARG HELM_VERSION=3.8.0

#------------------------------------------------------------------
# testa: install helm AS root, run AS both
#------------------------------------------------------------------
FROM base AS testa

RUN install-tool helm "v${HELM_VERSION}"

RUN set -ex; helm version

RUN set -ex; \
  helm repo add stable https://charts.helm.sh/stable; \
  helm repo update

SHELL [ "/bin/sh", "-c" ]

RUN helm version | grep "${HELM_VERSION}"

USER 1000

RUN set -ex; \
  helm repo add stable https://charts.helm.sh/stable; \
  helm repo update

RUN helm version | grep "${HELM_VERSION}"

# even more restricted
USER 1000:1000

RUN set -ex; \
  helm repo update

RUN helm version | grep "${HELM_VERSION}"


#------------------------------------------------------------------
# testb: install helm AS user (openshift)
#------------------------------------------------------------------
FROM base AS testb

USER 1111

RUN id

RUN install-tool helm "v${HELM_VERSION}"

RUN set -ex; [ $(stat --format '%u' "/usr/local/bin/helm") -eq 1111 ]

RUN set -ex; helm version

RUN set -ex; \
  helm repo add stable https://charts.helm.sh/stable; \
  helm repo update

SHELL [ "/bin/sh", "-c" ]

RUN helm version | grep "${HELM_VERSION}"


#------------------------------------------------------------------
# testc: install AS user when already installed AS root (openshift)
#------------------------------------------------------------------
FROM base AS testc


RUN install-tool helm "v${HELM_VERSION}"

RUN set -ex; [ $(stat --format '%u' "/usr/local/bin/helm") -eq ${USER_ID} ]

USER 1111

# do not update
RUN install-tool helm v3.7.0

RUN set -ex; helm version

RUN set -ex; \
  helm repo add stable https://charts.helm.sh/stable; \
  helm repo update

SHELL [ "/bin/sh", "-c" ]

RUN helm version | grep "3.7.0"


#------------------------------------------------------------------
# final
#------------------------------------------------------------------
FROM base

COPY --from=testa /.dummy /.dummy
COPY --from=testb /.dummy /.dummy
COPY --from=testc /.dummy /.dummy
