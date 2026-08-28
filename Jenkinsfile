// ---------------------------------------------------------------------------
// Build, smoke-test and deploy the portfolio as a local container.
//
// Deliberately does NOT push to Docker Hub or any other registry — the image
// is built on the box that runs it, so there is no upload and no pull.
//
// The whole pipeline is one `docker build` plus a container swap. Everything
// expensive is cached by BuildKit between runs: an unchanged package-lock.json
// means the install layer is reused outright, and a changed one still installs
// from the mounted npm cache.
//
// The agent needs Docker and nothing else. There is no Node on the agent, no
// `npm ci` on the agent, and therefore no agent-side workspace to keep warm.
//
// The container is published on the loopback interface only. Caddy on the host
// owns :80/:443, terminates TLS for swornim.avernek.com and reverse-proxies to
// HOST_PORT — so nothing here should ever be reachable from outside the box.
// ---------------------------------------------------------------------------

pipeline {
    agent any

    options {
        timestamps()
        timeout(time: 15, unit: 'MINUTES')
        disableConcurrentBuilds()
        buildDiscarder(logRotator(numToKeepStr: '15', artifactNumToKeepStr: '5'))
        // The default checkout is fine; a shallow one is faster on a repo with
        // any history at all.
        skipDefaultCheckout(true)
    }

    parameters {
        string(
            name: 'SITE_URL',
            defaultValue: 'https://swornim.avernek.com',
            description: 'Canonical origin. Baked into canonical URLs, OG tags, sitemap.xml and robots.txt at build time.'
        )
        string(
            name: 'HOST_PORT',
            defaultValue: '2345',
            description: 'Loopback port the container is published on. Must match the reverse_proxy upstream in the host Caddyfile.'
        )
    }

    environment {
        IMAGE           = 'swornim-portfolio'
        CONTAINER       = 'swornim-portfolio'
        DOCKER_BUILDKIT = '1'

        // Jenkins only registers a `parameters` block on the job *after* a run
        // has completed with it, so the first build following a change here
        // sees no params at all and `set -u` kills the shell. Resolving them
        // through the environment gives every step a value on every run,
        // first one included.
        SITE_URL  = "${params.SITE_URL ?: 'https://swornim.avernek.com'}"
        HOST_PORT = "${params.HOST_PORT ?: '2345'}"

        // Loopback only. Caddy is the only thing that should reach the app.
        BIND_ADDR = '127.0.0.1'
    }

    stages {

        stage('Checkout') {
            steps {
                // Shallow, single-branch. The build does not read git history.
                checkout scmGit(
                    branches: scm.branches,
                    userRemoteConfigs: scm.userRemoteConfigs,
                    extensions: [
                        cloneOption(shallow: true, depth: 1, noTags: true, honorRefspec: true)
                    ]
                )
                script {
                    env.GIT_SHA = sh(
                        script: 'git rev-parse --short=8 HEAD',
                        returnStdout: true
                    ).trim()
                    env.TAG = "${env.BUILD_NUMBER}-${env.GIT_SHA}"
                }
                echo "Building ${env.IMAGE}:${env.TAG} for ${env.SITE_URL}"
            }
        }

        stage('Build image') {
            steps {
                // Typecheck and `vite build` both run inside this, in the
                // build stage of the Dockerfile.
                //
                // No --cache-from: the image is built and run on the same
                // daemon, so BuildKit's local layer cache already covers the
                // rebuild. Importing from a tag is pure overhead here, and it
                // fails outright on the first build, when :latest does not
                // exist yet.
                sh '''
                    set -eu
                    docker build \
                        --build-arg VITE_SITE_URL="${SITE_URL}" \
                        --tag "${IMAGE}:${TAG}" \
                        --tag "${IMAGE}:latest" \
                        .
                '''
            }
        }

        stage('Smoke test') {
            steps {
                // Prove the image serves before anything is taken down. A
                // deploy that replaces a working container with a broken one
                // is worse than a failed build.
                sh '''
                    set -eu
                    CID=$(docker run -d --rm -P "${IMAGE}:${TAG}")
                    trap 'docker rm -f "$CID" >/dev/null 2>&1 || true' EXIT

                    PORT=$(docker port "$CID" 80/tcp | head -n1 | sed 's/.*://')

                    # Caddy is up in well under a second; poll rather than sleep.
                    for i in $(seq 1 30); do
                        if curl -fsS "http://localhost:${PORT}/" >/dev/null 2>&1; then break; fi
                        [ "$i" = "30" ] && { echo "server never came up"; docker logs "$CID"; exit 1; }
                        sleep 1
                    done

                    echo "--- / serves the app shell"
                    curl -fsS "http://localhost:${PORT}/" | grep -q '<div id="root">'

                    echo "--- a client route falls back to index.html"
                    curl -fsS "http://localhost:${PORT}/work/avernek" | grep -q '<div id="root">'

                    echo "--- generated files are present"
                    curl -fsS "http://localhost:${PORT}/sitemap.xml" | grep -q '<urlset'
                    curl -fsS "http://localhost:${PORT}/robots.txt"  | grep -q 'Sitemap:'

                    echo "--- the built origin is the one we asked for"
                    curl -fsS "http://localhost:${PORT}/sitemap.xml" | grep -q "${SITE_URL}"

                    echo "--- assets are served pre-compressed and immutable"
                    ASSET=$(curl -fsS "http://localhost:${PORT}/" \
                            | grep -o '/assets/[^"]*\\.js' | head -n1)
                    curl -fsS -H 'Accept-Encoding: gzip' -D- -o /dev/null \
                         "http://localhost:${PORT}${ASSET}" \
                         | grep -qi 'content-encoding: gzip'

                    echo "smoke test passed"
                '''
            }
        }

        stage('Deploy') {
            steps {
                sh '''
                    set -eu
                    docker rm -f "${CONTAINER}" >/dev/null 2>&1 || true
                    docker run -d \
                        --name "${CONTAINER}" \
                        --restart unless-stopped \
                        -p "${BIND_ADDR}:${HOST_PORT}:80" \
                        --memory 128m \
                        --read-only \
                        --tmpfs /tmp \
                        "${IMAGE}:${TAG}"
                '''
                echo "Deployed ${env.IMAGE}:${env.TAG} on ${env.BIND_ADDR}:${env.HOST_PORT}"
            }
        }
    }

    post {
        success {
            // Keep the two most recent builds' images, bin the rest. Left
            // alone, a per-commit tag fills the disk within a month.
            sh '''
                set -eu
                docker image prune -f --filter "dangling=true" >/dev/null 2>&1 || true
                docker images "${IMAGE}" --format '{{.Tag}} {{.ID}}' \
                    | grep -v '^latest ' \
                    | tail -n +3 \
                    | awk '{print $2}' \
                    | xargs -r docker rmi -f >/dev/null 2>&1 || true
            '''
        }
        failure {
            sh 'docker logs --tail 80 "${CONTAINER}" 2>&1 || true'
        }
        cleanup {
            cleanWs()
        }
    }
}
