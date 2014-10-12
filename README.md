Uatu
====

A simple Sinatra app to monitor builds on multiple Jenkins servers. It should be straightforward to make this meet your own purposes by modifying the `public/javascript/status.js` and `config.yaml` files. The app can be started on port 4567 with the `rackup -p 4567` command or can be daemonized by running `rackup -D -p 4567`.

The inspiration for this was taken from the [Jenkins Build Monitor Plugin](https://wiki.jenkins-ci.org/display/JENKINS/Build+Monitor+Plugin).

![alt tag](https://raw.githubusercontent.com/vaneyckt/Uatu/master/screenshot.png)
