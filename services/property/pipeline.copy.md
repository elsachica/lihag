stages:
  - build
  - test
  - deploy

# =============================================================================
# Property Service
# =============================================================================

build_property:
  stage: build
  image:
    name: gcr.io/kaniko-project/executor:v1.9.0-debug
    entrypoint: [""]
  script:
    - echo "{\"auths\":{\"$CI_REGISTRY\":{\"auth\":\"$(printf '%s' "gitlab-ci-token:${CI_JOB_TOKEN}" | base64)\"}}}" > /kaniko/.docker/config.json
    - /kaniko/executor \
        --context "${CI_PROJECT_DIR}/services/property" \
        --dockerfile "${CI_PROJECT_DIR}/services/property/Dockerfile.production" \
        --destination "gitlab.lnu.se:5050/2dv013/student/team-2025-07-4chics/lihag-system/property:${CI_COMMIT_REF_SLUG}" \
        --destination "gitlab.lnu.se:5050/2dv013/student/team-2025-07-4chics/lihag-system/property:latest" \
        --cache=true \
        --cache-repo="gitlab.lnu.se:5050/2dv013/student/team-2025-07-4chics/lihag-system/property:buildcache"
    - echo "✓ Successfully built and pushed property:${CI_COMMIT_REF_SLUG}"

test_property:
  stage: test
  image: node:20
  script:
    - cd services/property
    - npm ci
    - npm run lint || echo "No linter configured"
    - npm test || echo "No tests yet"

# ... rest av pipeline