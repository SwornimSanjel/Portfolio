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

    // No `parameters` block, deliberately. Jenkins stores parameter definitions
    // on the job and fills `params` for a triggered build from that stored
    // copy, which is only refreshed *after* a run completes — so editing a
    // defaultValue here does nothing to the very next build, and an old value
    // silently wins. Both of these have to agree with the reverse_proxy
    // upstream in the host Caddyfile, which makes them config, not knobs.
    // Keeping them here means the file in git is what actually deploys.
    environment {
        IMAGE           = 'swornim-portfolio'
        CONTAINER       = 'swornim-portfolio'
        DOCKER_BUILDKIT = '1'

        // Baked into canonical URLs, OG tags, sitemap.xml and robots.txt at
        // build time. Vite inlines VITE_*, so there is no runtime override.
        SITE_URL  = 'https://swornim.avernek.com'

        // Loopback only, and must match `reverse_proxy 127.0.0.1:2345` in the
        // host Caddyfile. Caddy is the only thing that should reach the app.
        BIND_ADDR = '127.0.0.1'
        HOST_PORT = '2345'
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

                    # The build prerenders every route into its own HTML file.
                    # If that step is ever skipped or silently fails, the two
                    # checks above still pass — an empty shell also contains
                    # the root div — so assert on rendered content as well.
                    echo "--- routes are prerendered, not an empty shell"
                    for r in / /work /about; do
                        curl -fsS "http://localhost:${PORT}$r" | grep -q '<h1' \
                            || { echo "no <h1> at $r: prerendering did not survive the build"; exit 1; }
                    done

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

                    # Also clears a container left behind by a run that was
                    # created but failed to start, which still holds the name.
                    docker rm -f "${CONTAINER}" >/dev/null 2>&1 || true

                    if ! docker run -d \
                        --name "${CONTAINER}" \
                        --restart unless-stopped \
                        -p "${BIND_ADDR}:${HOST_PORT}:80" \
                        --memory 128m \
                        --read-only \
                        --tmpfs /tmp \
                        "${IMAGE}:${TAG}"
                    then
                        # Almost always a port clash, and the daemon's error
                        # says which port but never which process. Name it.
                        echo "--- could not start; who holds ${BIND_ADDR}:${HOST_PORT}?"
                        ss -lptn "sport = :${HOST_PORT}" 2>/dev/null \
                            || netstat -lptn 2>/dev/null | grep ":${HOST_PORT} " \
                            || echo "(no ss/netstat on the agent)"
                        docker ps -a --filter "publish=${HOST_PORT}" \
                            --format 'container {{.Names}} -> {{.Ports}}' || true
                        docker rm -f "${CONTAINER}" >/dev/null 2>&1 || true
                        exit 1
                    fi
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
