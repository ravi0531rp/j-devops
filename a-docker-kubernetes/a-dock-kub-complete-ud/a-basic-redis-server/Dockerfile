# Use an existing docker image as base
FROM alpine

# Download & Add a Dependency
RUN apk add --update redis

# Tell the image what to do when it starts
CMD ["redis-server"]