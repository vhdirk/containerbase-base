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

COPY --chown=1000:0 test/php/test test
WORKDIR /test

#--------------------------------------
# test: php 7.4
#--------------------------------------
FROM base AS testa

# old php version, not for renovating
RUN install-tool php 7.4.14

# old composer version, not for renovating
RUN install-tool composer 1.10.0

RUN set -ex; \
  composer --version | grep 1.10.0; \
  [ "$(command -v composer)" = "/usr/local/bin/composer" ] && echo "works" || exit 1;

USER 1000

# old composer version, not for renovating
# testing user install overwrite
RUN install-tool composer 1.10.20

RUN set -ex; \
  [ ! -z "$(command -v php)" ] && echo "php installed" || exit 1;

RUN set -ex; \
  $(php -r 'exit(extension_loaded("mbstring") ? 0 : 1);') && echo "php-mbstring installed" || exit 1;

RUN set -ex; \
  $(php -r 'exit(extension_loaded("curl") ? 0 : 1);') && echo "php-curl installed" || exit 1;

RUN set -ex; \
  $(php -r 'exit(extension_loaded("xml") ? 0 : 1);') && echo "php-xml installed" || exit 1;

RUN set -ex; \
  $(php -r 'exit(extension_loaded("json") ? 0 : 1);') && echo "php-json installed" || exit 1;

RUN php --version
RUN set -ex; \
  composer --version | grep 1.10.20; \
  [ "$(command -v composer)" = "/usr/local/bin/composer" ] && echo "works" || exit 1;


RUN set -ex; \
  cd a; \
  composer install --no-ansi --no-interaction

#--------------------------------------
# test: php 5.6
#--------------------------------------
FROM base AS testb

# old php version, not for renovating
RUN install-tool php 5.6.40

USER 1000

# old composer version, not for renovating
RUN install-tool composer 1.10.20

RUN set -ex; \
  [ ! -z "$(command -v php)" ] && echo "php installed" || exit 1;

RUN set -ex; \
  $(php -r 'exit(extension_loaded("mbstring") ? 0 : 1);') && echo "php-mbstring installed" || exit 1;

RUN set -ex; \
  $(php -r 'exit(extension_loaded("curl") ? 0 : 1);') && echo "php-curl installed" || exit 1;

RUN set -ex; \
  $(php -r 'exit(extension_loaded("xml") ? 0 : 1);') && echo "php-xml installed" || exit 1;

RUN set -ex; \
  $(php -r 'exit(extension_loaded("json") ? 0 : 1);') && echo "php-json installed" || exit 1;

RUN php --version
RUN composer --version

#--------------------------------------
# test: php 8.0
#--------------------------------------
FROM base AS testc

# no auto env for testing
SHELL [ "/bin/sh", "-c" ]

# renovate: datasource=github-releases packageName=containerbase/php-prebuild
RUN install-tool php 8.3.9


# renovate: datasource=github-releases packageName=composer/composer
RUN install-tool composer 2.7.7

# test with latest version
RUN install-tool composer latest

USER 1000

RUN set -ex; \
  [ ! -z "$(command -v php)" ] && echo "php installed" || exit 1;

RUN set -ex; \
  $(php -r 'exit(extension_loaded("mbstring") ? 0 : 1);') && echo "php-mbstring installed" || exit 1;

RUN set -ex; \
  $(php -r 'exit(extension_loaded("curl") ? 0 : 1);') && echo "php-curl installed" || exit 1;

RUN set -ex; \
  $(php -r 'exit(extension_loaded("xml") ? 0 : 1);') && echo "php-xml installed" || exit 1;

RUN set -ex; \
  $(php -r 'exit(extension_loaded("json") ? 0 : 1);') && echo "php-json installed" || exit 1;

RUN php --version
RUN composer --version

#--------------------------------------
# testd: php 8.0 (non-root)
#--------------------------------------
FROM base AS testd

# no auto env for testing
SHELL [ "/bin/sh", "-c" ]

RUN prepare-tool php

USER 1000


# renovate: datasource=github-releases packageName=containerbase/php-prebuild
RUN install-tool php 8.3.9

# test without version
RUN install-tool composer

# renovate: datasource=github-releases packageName=composer/composer
RUN install-tool composer 2.7.7


RUN set -ex; \
  [ ! -z "$(command -v php)" ] && echo "php installed" || exit 1;

RUN set -ex; \
  $(php -r 'exit(extension_loaded("mbstring") ? 0 : 1);') && echo "php-mbstring installed" || exit 1;

RUN set -ex; \
  $(php -r 'exit(extension_loaded("curl") ? 0 : 1);') && echo "php-curl installed" || exit 1;

RUN set -ex; \
  $(php -r 'exit(extension_loaded("xml") ? 0 : 1);') && echo "php-xml installed" || exit 1;

RUN set -ex; \
  $(php -r 'exit(extension_loaded("json") ? 0 : 1);') && echo "php-json installed" || exit 1;

RUN php --version
RUN composer --version

# test from getcomposer.org
RUN install-tool composer 2.0.0

#--------------------------------------
# final
#--------------------------------------
FROM base

COPY --from=testa /.dummy /.dummy
COPY --from=testb /.dummy /.dummy
COPY --from=testc /.dummy /.dummy
