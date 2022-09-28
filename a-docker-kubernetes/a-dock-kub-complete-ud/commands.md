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

11. Tagging
```sh
docker build -t ravi0531rp/redis-gcc:latest .
>> # Everything same but now the image created has a name

```


17. Concerned with the Node App (Project B)
Dockerfile Looks like this
```sh
FROM node:14-apline

WORKDIR /usr/app

RUN npm install

COPY ./ ./

CMD ["npm", "start"]

```
Now run
```sh
docker build -t ravi0531rp/simpleweb .
docker run -p 5000:8080 ravi0531rp/simpleweb # main system on "former" or listen on 5000, docker port on "latter" or publish/redirect on 8080  # node server
```


20. We can override the default command by using the -it & open a shell
```sh
docker run -it ravi0531rp/simpleweb sh  # start a shell inside the container

```

21. Concerned with the Redis Node APP(Docker Compose Project)
```
# Make the dockerfile for the Node APP

FROM node:14-alpine

COPY ./package.json ./

RUN npm install .

COPY ./ ./

CMD npm start


# Build the image

docker build -t ravi0531rp/nodeapp .

# Run a Redis server in other terminal
docker run redis

# Run a container for it
docker run ravi0531rp/nodeapp
```
* Still not working, right?
* How would these containers talk to each other?
* Either use Docker CLI (port mappings) or use docker-compose

```sh
# Check out the docker-compose
version: '3' # version of docker-compose

services:
  redis-server:
    image: 'redis'
  node-app:
    build: .
    ports:
      - "5000:8081"

```
* Running Docker Compose Containers
```sh
docker-compose up --build

docker-compose up

docker-compose up -d # -d for running in the bg

docker-compose down
```

22. Restart Policy
```
version: '3'

services:
  redis-server:
    image: 'redis'
  node-app:
    restart : always
    build: .
    ports:
      - "5000:8081"

```

23. Status of Docker Compose Containers
```sh
docker-compose ps # run from the same directory as the docker-compose.yml

```

24. Development Workflow Project
* Create a React Dummy Project # Make sure that you are working in a fresh directory to create a git repo
```sh
npx create-react-app frontend # frontend is the name of the app

```
* Commands to memorize
```sh
npm run start # starts a development server ; for dev only

npm run test # Runs tests associated with the project

npm run build # Builds a production version of the app ; creates a build directory
```

* Let's work on the code
```sh
# Create a Dockerfile.dev in the source directory
docker build -f Dockerfile.dev .

docker run -p 3000:3000 <image_id>

```
* Delete the node_modules folder as it messes up the dependency.

* What to do if we want changes to reflect immediately??
a) Rebuild the image & Run 
b) Figure out a clever soln ; <b>DOCKER VOLUMES</b>

* Dont do straight COPY which is time-locked
* Add a reference to the local machine folders..

```sh

docker run -p 3000:3000 -v /app/node_modules -v $(pwd):/app <image_id>
                            /                   \
  Put a bookmark for node                    Take everything from pwd & map to app folder        
  modules folder . It says, don't look               inside the container 
  for that folder inside the project repo.

```

* We can shorten the process via Docker Compose
```sh
# This is how the docker-compose would look like (Since we are using Dockerfile.dev for dev env)
version : '3'

services:
  web:
    build : 
      context: .
      dockerfile: Dockerfile.dev
    ports : 
      - "3000:3000"
    volumes:
      - /app/node_modules
      - .:/app
```
* Executing Tests
```sh
# Build Normally
docker build -f Dockerfile.dev .

# Override the existing command with test
docker run -it <cont_id> npm run test


```

* Live Updating Tests
```sh
# Copy & paste the test code once again in the src/App.test.js file to make changes
# The test suite didn't rerun with 2 tests. Since we are using the snapshot method for the test container.
# We could use a similar approach (using volumes)
# Other way is running the container & then running the test via docker exec
docker exec -it <cont_id> npm run test

# This is not the proper way though
# We can create a second service in the docker-compose for the test suite
# Now the docker-compose looks like this
version : '3'

services:
  web:
    build : 
      context: .
      dockerfile: Dockerfile.dev
    ports : 
      - "3000:3000"
    volumes:
      - /app/node_modules
      - .:/app

  test:
    build : 
      context: .
      dockerfile: Dockerfile.dev
    volumes:
      - /app/node_modules
      - .:/app
    command: ["npm", "run", "test"]



# Now run
docker-compose up
# Make any change to the App.test.js ; It reflects agains

```


* Shortcomings : UI becomes messed up ; Can't use any other commands while testing..
* Can Make use of <b>DOCKER ATTACH</b> (forwards our i/p)

```sh
# Use docker ps to get cont ids
docker ps

# docker attach <>

```

* What to do with prod ? Need nginx
```sh
    PROD ENVIRONMENT
              |   Web Container           |
              |                           |
|USER| <----> | |NGINX| <---> |index.html||
              |         <---> |main.js|   |
              |                           |

# Need a new Dockerfile (Adapted from Dockerfile.dev)
# Build will be Multistep as we have to have nginx image as well as node-alpine in the same container..

# Build Phase
Use node:alpine
      |
Copy Package.json
      |
Install Dependencies
      |
Run npm run build

# Run phase
Use nginx
    |
Copy over the result of npm run build # Why copy other files if we already built an app (only the build dir)
    |
Start nginx
```
* Implementation

```sh
# Dockerfile looks like this

FROM node:14-alpine AS builder
WORKDIR '/app'
COPY package.json .
RUN npm install
COPY . .
RUN npm run build
FROM nginx
COPY --from=builder /app/build /usr/share/nginx/html


# Build and Run
docker build .

docker run -p 8080:80 <image_id>

```



