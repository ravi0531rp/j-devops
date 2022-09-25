## Docker Commands Cheat Sheet

1. docker run hello-world

2. docker run busybox echo hi there
"""
hi there
"""

3. docker run busybox echo bye bye
"""
bye bye
"""

4. docker container ls -a  # used -a as these conts. exit immediately, so docker ps wont show these
"""
CONTAINER ID   IMAGE     COMMAND           CREATED          STATUS                      PORTS     NAMES
7e4ce59d7a1f   busybox   "echo bye bye"    4 seconds ago    Exited (0) 3 seconds ago              nostalgic_edison
e1c85cc1ebc1   busybox   "echo hi there"   16 seconds ago   Exited (0) 15 seconds ago             infallible_wilson

"""

## docker run syntax has the format -> docker run {imageName} {valid commands to run}
## docker run is equal to == docker create + docker start

5. docker create hello-world 
"""
Unable to find image 'hello-world:latest' locally
latest: Pulling from library/hello-world
2db29710123e: Pull complete 
Digest: sha256:bfea6278a0a267fad2634554f4f0c6f31981eea41c553fdf5a83e95a41d40c38
Status: Downloaded newer image for hello-world:latest
9efa38f3610219a6cfb2c0fbba24e4514794bd1d70d19f8c8a3ca68b215e41fe
"""

6. docker start -a 9efa38  # initials of the cont id from prev command # -a prints the output comind out of the terminal

7. docker system prune
"""
WARNING! This will remove:
  - all stopped containers
  - all networks not used by at least one container
  - all dangling images
  - all dangling build cache
"""

8. docker create busybox echo hi world
9c847d69771ee276e4a3a764859acb159435b917e6450feeee4957f84f568204

9. docker start 9c847
9c847

10. docker logs 9c847 # doesn't run the container, but only shows the already gen. o/p
hi world

### Stopping containers -> kill or stop

11. docker run busybox ping google.com

12. docker stop 1ed2d7433faf # waits for cleanup and then kills the process

13. docker run redis

14. redis-cli   # on other window ; gives error as can't connect. Redis is running 
inside the container, can't access from outside

### To run commands inside the container, need to use exec
### docker exec -it <cont id> <command> # it allows to provide i/p

15. docker exec -it 9542e26fc849 redis-cli
"""
127.0.0.1:6379

127.0.0.1:6379> set x 5 # running some random commands inside the container
OK
127.0.0.1:6379> get x
"5"

"""


## exec can also give us shell access into our application

16. docker exec -it 9542e26fc849 sh  # now we are inside the container terminal; ctrl-D for exit



### Dockerfile > Docker client > Docker Server > Usable Image

### Specify base image > Run commands to install > Specify command to run on startup

### Target : Create an image that runs redis server

a) Create the Dockerfile (see the file itself)

b) docker build .
"""
Sending build context to Docker daemon  2.048kB
Step 1/3 : FROM alpine
latest: Pulling from library/alpine
40e059520d19: Pull complete 
Digest: sha256:f22945d45ee2eb4dd463ed5a431d9f04fcd80ca768bb1acf898d91ce51f7bf04
Status: Downloaded newer image for alpine:latest
 ---> 76c8fb57b6fc
Step 2/3 : RUN apk add --update redis
 ---> Running in e731e41708d4
fetch https://dl-cdn.alpinelinux.org/alpine/v3.15/main/x86_64/APKINDEX.tar.gz
fetch https://dl-cdn.alpinelinux.org/alpine/v3.15/community/x86_64/APKINDEX.tar.gz
(1/1) Installing redis (6.2.6-r0)
Executing redis-6.2.6-r0.pre-install
Executing redis-6.2.6-r0.post-install
Executing busybox-1.34.1-r4.trigger
OK: 8 MiB in 15 packages
Removing intermediate container e731e41708d4
 ---> 681e017afa2b
Step 3/3 : CMD ["redis-server"]
 ---> Running in a60dff789dc8
Removing intermediate container a60dff789dc8
 ---> df462560cbd6
Successfully built df462560cbd6


"""
c) docker run df462560cbd6  # runs our custom image

### Tagging an image

17. docker build -t ravi0531rp/redis-gcc:latest .

### Use COPY to copy files from filesystem to docker filesystem


18. docker build -t ravi0531rp/simpleweb .

19. docker run -p 5000:8080 ravi0531rp/simpleweb # main system on "former" or listen on 5000, docker port on "latter" or publish/redirect on 8080  # node server


20. docker run -it ravi0531rp/simpleweb sh  # start a shell inside the container

### WORKDIR /usr/app # any following command will be executed relative to this path

### How to handle minor source code change without building dependencies again and
again

a) Write COPY dependencies file above, then use the RUN to install them
b) After these 2, write one more COPY with ./ ./


### Multi container Apps

## For files, go to visits folder

21) docker build -t ravi0531rp/visits .

## Need to have some networking capabilities between our node and redis containers,
which are running independently. -> Docker compose

22) See the docker-compose.yml file
"""
version: '3'
services: 
  redis-server:
    image: 'redis'
  node-app:
    build: .
    ports:
      - "4001:8081"

"""

4001 on our system, 8081 on docker

23) docker-compose up --build # --build makes sure to rebuild

23) docker-compose up # instead of running separately, just one command!
### use -d for containers to run in background

24) docker-compose down

### How to handle if our server crashes inside the runnig containers
### There are 4 restart policies which we can use inside docker-compose
a) no b) always c) on-failure d) unless-stopped