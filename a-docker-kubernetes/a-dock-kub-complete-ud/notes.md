## Docker Notes Sheet

1) Why use Docker ?
* Installation of Softwares & Tools is pretty inconvenient.
* If one step fails, then need to debug a lot.
* Also, packaging & replicating environments across multiple developers & multiple dev stages is tough.

2) Docker Ecosystem

```sh
|  Docker Client       Docker Server  |
|  Docker Machine      Docker Images  | -> Build Images & Run Containers
|  Docker Hub          Docker Compose |
```

3) Images & Containers
```sh
        | -> Container 1
Image --| -> Container 2
        | -> Container 3
```

4) Installation on Linux
* Install from [Source](https://docs.docker.com/install/linux/docker-ce/ubuntu/)
```sh
 $ sudo apt-get update
 $ sudo apt-get install \
    ca-certificates \
    curl \
    gnupg \
    lsb-release

$ sudo mkdir -p /etc/apt/keyrings

$ curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg

$ echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

$ sudo apt-get update
$ sudo apt-get install docker-ce docker-ce-cli containerd.io docker-compose-plugin

$ apt-cache madison docker-ce

$ sudo apt-get install docker-ce=<VERSION_STRING> docker-ce-cli=<VERSION_STRING> containerd.io docker-compose-plugin

$ sudo service docker start

$ sudo docker run hello-world

```

5) OS setup & Equivalence
```sh
           |Process1|     |Process2|     |Process3|
                |              |             |
        |System Call|  |System Call|  |System Call| 
        --------------------------------------------
                        Kernel
                          |
                ----------------------
                      Hard Disk
```

6) Image & Container
```sh
-------------------------------
|          Image               |
|                              |
|  FS Snapshot   Startup Cmd   |
|  Chrome Python    Run Chrome |
|______________________________|

```

7) Namespacing & Control Groups
* Namespacing - Isolating Resources per process
* Control Groups - Limit Amount of Resources per Process

8) Dockerfile
* Need to specify the beahviour and everything
* Dockerfile > Docker client > Docker Server > Usable Image
* Specify base image > Run commands to install > Specify command to run on startup

9) Contents of Dockerfile
* Base Image -> The most basic OS equivalent that you need to start a project
* For instance, like python base has python pre installed...

10) Make a Simple Node APP and Containerize it
* Create a Node JS APP
* Create Dockerfile
* Build Image from Dockerfile
* Run Image as Container
* Connect to Web app from a browser


11) Make a Multi Container App
```sh

| Docker Container |
|                  |--------|
| Node App         |        |
                            |
| Docker Container |        |
|                  |--------|---------> | Docker Container     |
| Node App         |        |           | Redis database Server|
                            |
| Docker Container |        |
|                  |--------|
| Node App         |


Using this Architecture, we can spawn any number of Containers..


```

12) Docker Compose
* Separate CLI that gets installed along with docker
* Used to start up multiple containers at once
* Automates the docker run processes.
* Just by adding container info in the docker-compose, we are telling docker-compose to make them 
  in the same network..


13. Auto Start Containers and Error Codes
```sh
Status Codes                Status
0                           Exited Properly & Everything is Okay
1,2,3,etc                   We exited because something went wrong

```

* Need to add a restart Policy
```sh
| Restart Policies |      |Description|
No                        Never restart
Always                    Always restart
On-failure                Only restart if container stops with an error code
Unless-stopped            Always restart unless we force stop it

```