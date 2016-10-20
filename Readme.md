This is an example of a webforms project being compiled into a docker container. The gulp file is used for build orchestration. This is for **windows 10** or **server 2016**

## Gettting started

Install docker with [this script on windows 10](https://gist.github.com/TerribleDev/dd424d3d090bcf5634dcf8417411a081), or setup docker on [server 2016](https://gist.github.com/TerribleDev/106197d88d1535dd0546165f5a7eb6a8)

Install nodejs

run: 
```
npm install -g gulp
npm install
```

## tasks



`clean:` clean up artifacts

`retrieve:` alias for retrieve docker image and nuget

`build:` build everything

`restore:nuget` restores nugets

`build:patchAssemblyInfo` patch assemblyinfo cs files

`build:csharp` compile csharp

`build:dockerImage` build the docker image


arguments:
`--version` version to set for assemblyinfo docker image

usage:

`gulp build --version 1.0.1` 


output:

```
docker images

REPOSITORY                    TAG                 IMAGE ID            CREATED             SIZE
tparnell/mywebforms           1.0.1               de4de30a1b13        34 minutes ago      9.246 GB

```