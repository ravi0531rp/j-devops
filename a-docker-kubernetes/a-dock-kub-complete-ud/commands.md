## Docker Commands Cheat Sheet

0. Check version
```sh 
docker version
```
1. Download image from docker hub & save locally (if doesn't exist locally) & run container
```sh
docker run hello-world 
```

2. Run a busybox image container
```sh
docker run busybox echo hi there idiot
>> hi there idiot
```

3. Run a busybox image container
```sh
docker run busybox echo bye bye
>> bye bye
```

4. Listing Containers
* Using -a lists all containers, even the ones that are exited
```sh
docker container ls -a  
>>
"""
CONTAINER ID   IMAGE     COMMAND           CREATED          STATUS                      PORTS     NAMES
7e4ce59d7a1f   busybox   "echo bye bye"    4 seconds ago    Exited (0) 3 seconds ago              nostalgic_edison
e1c85cc1ebc1   busybox   "echo hi there"   16 seconds ago   Exited (0) 15 seconds ago             infallible_wilson

"""

docker ps # only running

docker ps -a -q # q is for quiet
```

5. Only Create an Container from an Image & not run it
* docker run syntax has the format -> docker run {imageName} {valid commands to run}
* docker run is equal to == docker create image name + docker start container id
```sh
docker create hello-world 
"""
Unable to find image 'hello-world:latest' locally
latest: Pulling from library/hello-world
2db29710123e: Pull complete 
Digest: sha256:bfea6278a0a267fad2634554f4f0c6f31981eea41c553fdf5a83e95a41d40c38
Status: Downloaded newer image for hello-world:latest
9efa38f3610219a6cfb2c0fbba24e4514794bd1d70d19f8c8a3ca68b215e41fe
"""
```

6. Run an image with the container id
```sh
docker start -a 9efa38  # check output of prev command ; -a is for i/o
```


7. Cleaning Up Stuff
```sh
docker system prune
>>
"""
WARNING! This will remove:
  - all stopped containers
  - all networks not used by at least one container
  - all dangling images
  - all dangling build cache
"""

docker rm -f <container_id>  # cleans up the container with the ID
docker rm -f $(docker ps -a -q) # cleans up all the containers
```

8. Check Logs
```sh
docker create busybox echo hi world
>> 9c847d69771ee276e4a3a764859acb159435b917e6450feeee4957f84f568204

docker start 9c847
>> 9c847

docker logs 9c847
>> hi world

```

9. Stopping Containers
```sh
docker run busybox ping google.com

docker stop 1ed2d7433faf # gives time for cleanup (SIGTERM)
docker kill 1ed2d7433faf # immediate stop (SIGKILL)
>> 1ed2d7433faf  # this means that it stopped the running container

```

9. Execution Mode (Interactive)
```sh
docker run redis
>> # Starts running a redis server & engages that terminal
# Open a New Terminal
docker ps
>> 9542e26fc849 ( a part of the output for simplicity)

### To run commands inside the container, need to use exec
### docker exec -it <cont id> <command> 
### Need to handle 3 channels -> STDIN, STDOUT, STDERR
### -i is for attaching our terminal to the STDIN channel of the container
### -t is for tty ; handling the formatted i/o
docker exec -it 9542e26fc849 redis-cli 
>>
"""
127.0.0.1:6379

127.0.0.1:6379> set x 5 # running some random commands inside the container
OK
127.0.0.1:6379> get x
"5"

"""

## exec can also give us shell access into our application
docker exec -it 9542e26fc849 sh  # now we are inside the container terminal; ctrl-D for exit

```

10. Target : Create an image that runs redis server

```sh
Create the Dockerfile at ./a-basic-redis-server/Dockerfile
docker build .
>>
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
docker run df462560cbd6 # runs our custom image

```



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