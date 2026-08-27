pipeline {
  agent any

  options {
    buildDiscarder(logRotator(numToKeepStr: '20'))
    disableConcurrentBuilds()
    skipDefaultCheckout(true)
    timestamps()
    timeout(time: 30, unit: 'MINUTES')
  }

  parameters {
    string(
      name: 'DOCKER_IMAGE',
      defaultValue: 'swornim-sanjel-portfolio',
      description: 'Local Docker image name'
    )
    string(
      name: 'NEXT_PUBLIC_SITE_URL',
      defaultValue: 'https://swornim.avernek.com',
      description: 'Canonical public URL embedded in the Next.js build'
    )
  }

  environment {
    DOCKER_BUILDKIT = '1'
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
        script {
          env.DOCKER_IMAGE = params.DOCKER_IMAGE?.trim() ?: 'swornim-sanjel-portfolio'
          env.NEXT_PUBLIC_SITE_URL = params.NEXT_PUBLIC_SITE_URL?.trim() ?: 'https://swornim.avernek.com'
          env.GIT_SHA = sh(
            script: 'git rev-parse --short=12 HEAD',
            returnStdout: true
          ).trim()
          env.IMAGE_REF = "${env.DOCKER_IMAGE}:${env.GIT_SHA}"
          currentBuild.displayName = "#${env.BUILD_NUMBER} ${env.GIT_SHA}"
        }
      }
    }

    stage('Validate inputs') {
      steps {
        sh '''
          set -eu

          case "$DOCKER_IMAGE" in
            ''|*[!a-z0-9._/:@-]*)
              echo 'DOCKER_IMAGE contains invalid characters or uppercase letters.' >&2
              exit 1
              ;;
          esac

          case "$NEXT_PUBLIC_SITE_URL" in
            http://*|https://*) ;;
            *)
              echo 'NEXT_PUBLIC_SITE_URL must start with http:// or https://.' >&2
              exit 1
              ;;
          esac
        '''
      }
    }

    stage('Build image') {
      steps {
        sh '''
          docker build \
            --target runner \
            --build-arg "NEXT_PUBLIC_SITE_URL=${NEXT_PUBLIC_SITE_URL}" \
            --label "org.opencontainers.image.revision=${GIT_COMMIT}" \
            --tag "$IMAGE_REF" \
            .
        '''
      }
    }

    stage('Smoke test') {
      steps {
        sh '''
          set -eu
          smoke_container="portfolio-smoke-${BUILD_NUMBER}"
          trap 'docker rm -f "$smoke_container" >/dev/null 2>&1 || true' EXIT

          docker run --detach --name "$smoke_container" "$IMAGE_REF" >/dev/null

          attempts=0
          while [ "$attempts" -lt 12 ]; do
            health_status="$(docker inspect --format '{{.State.Health.Status}}' "$smoke_container")"
            if [ "$health_status" = 'healthy' ]; then
              exit 0
            fi
            if [ "$health_status" = 'unhealthy' ]; then
              docker logs "$smoke_container"
              exit 1
            fi
            attempts=$((attempts + 1))
            sleep 5
          done

          docker logs "$smoke_container"
          echo 'Container did not become healthy within 60 seconds.' >&2
          exit 1
        '''
      }
    }
  }
}
